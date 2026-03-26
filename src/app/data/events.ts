export type AppEvent = {
  title: string
  location: string
  event_time: string | null
  description: string
  org_id: string
}

export const myEvents: AppEvent[] = [
  {
    title: 'Startup Sprint Demo Night',
    location: 'Innovation Lab',
    event_time: '2026-03-27T18:30:00Z',
    description:
      'Pitch practice, rapid demos, and founder feedback for teams building before finals week.',
    org_id: '550e8400-e29b-41d4-a716-446655440000',
  },
  {
    title: 'Sunrise Run Club',
    location: 'North Quad',
    event_time: '2026-03-28T11:00:00Z',
    description:
      'Low-pressure miles, coffee after, and enough accountability to actually leave your dorm.',
    org_id: '0b2f0d2f-7f6d-49c3-9a55-946bce7d1111',
  },
  {
    title: 'Design Crit and Portfolio Lab',
    location: 'Media Studio 204',
    event_time: '2026-03-31T21:15:00Z',
    description: 'Bring a draft, get sharp feedback, and leave with a cleaner portfolio story.',
    org_id: '6aa0ef8f-b8fb-4c13-b060-2e7d0f4c2222',
  },
  {
    title: 'Volunteer Garden Reset',
    location: 'Campus Greenhouse',
    event_time: null,
    description:
      'Help prep beds for spring planting, then split snacks and starter herbs with the crew.',
    org_id: '2d9b7b44-8cf4-4db5-9863-1f3c2f183333',
  },
]

export const recommendedEvents: AppEvent[] = [
  {
    title: 'Moonlight Market',
    location: 'Student Center Lawn',
    event_time: '2026-04-02T20:00:00Z',
    description:
      'Late-night food stalls, student vendors, and a live DJ set under the string lights.',
    org_id: '940d57fd-3c9a-4ae8-850a-d94120068888',
  },
  {
    title: 'AI for Everyone Fireside',
    location: 'Library Forum',
    event_time: '2026-04-03T16:00:00Z',
    description:
      'A practical conversation on using AI tools without losing your own judgment or voice.',
    org_id: '4e2cc020-2d1c-4d85-9d9a-e56aa1099999',
  },
  {
    title: 'Pottery Pop-Up',
    location: 'Arts Courtyard',
    event_time: '2026-04-05T13:00:00Z',
    description:
      'Wheel demos, hand-building stations, and take-home clay kits while supplies last.',
    org_id: '8e746a88-3cab-46b5-b80f-fdb65f2aaaaa',
  },
  {
    title: 'Hack and Snack Study Jam',
    location: 'CS Lab East',
    event_time: '2026-04-07T20:00:00Z',
    description:
      'A quiet build session with mentors floating, whiteboards open, and enough snacks to stay late.',
    org_id: 'c1763eb7-109f-4d7f-bf19-cba0a8dfcccc',
  },
  {
    title: 'Founder Office Hours',
    location: 'Launchpad Hub',
    event_time: null,
    description:
      'Book a quick slot to pressure-test an idea, pricing plan, or pitch with alumni founders.',
    org_id: '27ee52ab-0d70-49d8-9182-2cf94431eeee',
  },
]
