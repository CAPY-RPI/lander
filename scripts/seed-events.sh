#!/usr/bin/env bash

set -euo pipefail

API_BASE_URL="${API_BASE_URL:-http://localhost:8080}"
API_VERSION="${API_VERSION:-/api/v1}"
EVENT_COUNT="${EVENT_COUNT:-25}"
ORG_ID="${ORG_ID:-66168f44-624a-47ad-9b07-7a92121bce01}"
START_DATE="${START_DATE:-2026-03-30T17:30:00Z}"
REGISTER_CREATED_EVENTS="${REGISTER_CREATED_EVENTS:-false}"
REGISTER_EVERY_N="${REGISTER_EVERY_N:-1}"
REGISTRATION_METHOD="${REGISTRATION_METHOD:-POST}"
REGISTRATION_PATH_TEMPLATE="${REGISTRATION_PATH_TEMPLATE:-/events/{{eid}}/registrations}"
REGISTRATION_BODY_TEMPLATE="${REGISTRATION_BODY_TEMPLATE:-}"
SEED_USER_ID="${SEED_USER_ID:-}"
COOKIE_HEADER="${COOKIE_HEADER:-}"

export ORG_ID
export START_DATE

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required." >&2
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "node is required." >&2
  exit 1
fi

curl_with_optional_cookie() {
  if [[ -n "${COOKIE_HEADER}" ]]; then
    curl --silent --show-error --fail -H "Cookie: ${COOKIE_HEADER}" "$@"
  else
    curl --silent --show-error --fail "$@"
  fi
}

create_event_payload() {
  node -e '
    const orgId = process.env.ORG_ID;
    const payload = {
      org_id: orgId,
    };

    process.stdout.write(JSON.stringify(payload));
  '
}

create_event_update_payload() {
  local index="$1"

  node -e '
    const index = Number(process.argv[1]);
    const rawStartDate = process.env.START_DATE;
    const startDate = new Date(rawStartDate);

    if (Number.isNaN(startDate.getTime())) {
      console.error(`Invalid START_DATE: ${rawStartDate}. Expected ISO format like 2026-03-18T17:30:00Z.`);
      process.exit(1);
    }

    startDate.setUTCDate(startDate.getUTCDate() + index);
    startDate.setUTCHours(18 + (index % 3), 15 * (index % 4), 0, 0);

    const payload = {
      location: `Seed Venue ${index + 1}`,
      event_time: startDate.toISOString(),
      description: `Seeded event ${index + 1} for local load testing and UI validation.`,
    };

    process.stdout.write(JSON.stringify(payload));
  ' "$index"
}

extract_eid() {
  node -e '
    let raw = "";
    process.stdin.on("data", (chunk) => {
      raw += chunk;
    });
    process.stdin.on("end", () => {
      try {
        const parsed = JSON.parse(raw);
        if (!parsed?.eid) process.exit(1);
        process.stdout.write(parsed.eid);
      } catch {
        process.exit(1);
      }
    });
  '
}

render_registration_body() {
  local eid="$1"

  if [[ -z "${REGISTRATION_BODY_TEMPLATE}" ]]; then
    return 0
  fi

  local rendered="${REGISTRATION_BODY_TEMPLATE//\{\{eid\}\}/${eid}}"
  rendered="${rendered//\{\{uid\}\}/${SEED_USER_ID}}"
  printf '%s' "${rendered}"
}

register_for_event() {
  local eid="$1"
  local path="${REGISTRATION_PATH_TEMPLATE//\{\{eid\}\}/${eid}}"
  path="${path//\{\{uid\}\}/${SEED_USER_ID}}"

  local body=""
  body="$(render_registration_body "${eid}")"

  if [[ -n "${body}" ]]; then
    curl_with_optional_cookie \
      -X "${REGISTRATION_METHOD}" \
      -H 'Content-Type: application/json' \
      --data "${body}" \
      "${API_BASE_URL}${API_VERSION}${path}" >/dev/null
  else
    curl_with_optional_cookie \
      -X "${REGISTRATION_METHOD}" \
      "${API_BASE_URL}${API_VERSION}${path}" >/dev/null
  fi
}

update_event() {
  local eid="$1"
  local index="$2"
  local body=""
  body="$(create_event_update_payload "${index}")"

  curl_with_optional_cookie \
    -X PUT \
    -H 'Content-Type: application/json' \
    --data "${body}" \
    "${API_BASE_URL}${API_VERSION}/events/${eid}" >/dev/null
}

echo "Seeding ${EVENT_COUNT} events into ${API_BASE_URL}"

for ((i = 0; i < EVENT_COUNT; i += 1)); do
  payload="$(create_event_payload)"
  response="$(
    curl_with_optional_cookie \
      -X POST \
      -H 'Content-Type: application/json' \
      --data "${payload}" \
      "${API_BASE_URL}${API_VERSION}/events"
  )"

  eid="$(printf '%s' "${response}" | extract_eid)"
  echo "Created event ${i} -> ${eid}"
  update_event "${eid}" "${i}"
  echo "Updated event ${i} -> ${eid}"

  if [[ "${REGISTER_CREATED_EVENTS}" == "true" ]] && (( i % REGISTER_EVERY_N == 0 )); then
    register_for_event "${eid}"
    echo "Registered for event ${i} -> ${eid}"
  fi
done
