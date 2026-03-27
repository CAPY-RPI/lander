import { useMemo, useState } from 'react'
import { OrgDetailsModal } from '@/app/components/OrgDetailsModal'
import { OrgRail } from '@/app/components/OrgRail'
import type { AppOrganization } from '@/app/data/organizations'
import { AnimatedPanel } from '@/shared/components/AnimatedPanel'
import { PillButton } from '@/shared/components/PillButton'
import type { Organization } from '@/shared/models/organization'
import { useAuth } from '@/shared/context/AuthContext'
import { useOrganizations } from '@/shared/hooks/useOrganizations'
import { useUserOrganizations } from '@/shared/hooks/useUserOrganizations'
import styles from './OrgsSection.module.css'

type OrgsSectionProps = {
  refreshKey?: number
  onCreateOrganization: () => void
  onOrganizationsChanged: () => void
}

function toAppOrganization(organization: Organization): AppOrganization {
  return {
    oid: organization.oid,
    name: organization.name || 'Untitled organization',
    date_created: organization.date_created,
    date_modified: organization.date_modified,
  }
}

export function OrgsSection({
  refreshKey = 0,
  onCreateOrganization,
  onOrganizationsChanged,
}: OrgsSectionProps) {
  const { isAuthed, user } = useAuth()
  const { organizations, isLoading, error } = useOrganizations(20, 0, refreshKey)
  const {
    organizations: myOrganizations,
    membershipByOrgId,
    isLoading: isLoadingMyOrganizations,
    error: myOrganizationsError,
  } = useUserOrganizations(organizations, user?.uid, isAuthed, refreshKey)
  const [selectedOrganization, setSelectedOrganization] = useState<AppOrganization | null>(null)
  const recommendedOrganizations = useMemo(
    () =>
      organizations.map((organization) => ({
        ...toAppOrganization(organization),
        isMember: membershipByOrgId[organization.oid] === true,
      })),
    [organizations, membershipByOrgId],
  )
  const myOrganizationCards = myOrganizations.map((organization) => ({
    ...toAppOrganization(organization),
    isMember: true,
  }))

  return (
    <AnimatedPanel className={`panel ${styles.orgsPanel}`} id="orgs" staggerIndex={3}>
      <div className={styles.panelHeader}>
        <PillButton
          type="button"
          subtle
          className={styles.createButton}
          onClick={onCreateOrganization}
          aria-label="Create organization"
          title="Create organization"
        >
          +
        </PillButton>
      </div>
      {isLoading ? <p className={styles.status}>Loading organizations...</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}
      {isAuthed && isLoadingMyOrganizations ? (
        <p className={styles.status}>Loading your organizations...</p>
      ) : null}
      {isAuthed && myOrganizationsError ? (
        <p className={styles.error}>{myOrganizationsError}</p>
      ) : null}
      {!isLoading && !error ? (
        <>
          {isAuthed ? (
            <OrgRail
              title="my orgs"
              organizations={myOrganizationCards}
              carouselLabel="My organizations carousel"
              onOrganizationSelect={setSelectedOrganization}
            />
          ) : null}
          <OrgRail
            title="recommended"
            organizations={recommendedOrganizations}
            carouselLabel="Recommended organizations carousel"
            onOrganizationSelect={setSelectedOrganization}
          />
        </>
      ) : null}
      <OrgDetailsModal
        organization={selectedOrganization}
        isOpen={selectedOrganization !== null}
        onClose={() => setSelectedOrganization(null)}
        onJoined={() => {
          onOrganizationsChanged()
          setSelectedOrganization((current) => (current ? { ...current, isMember: true } : current))
        }}
        onLeft={() => {
          onOrganizationsChanged()
          setSelectedOrganization((current) =>
            current ? { ...current, isMember: false } : current,
          )
        }}
      />
    </AnimatedPanel>
  )
}
