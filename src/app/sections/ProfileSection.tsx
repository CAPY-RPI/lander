import { AnimatedPanel } from '@/shared/components/AnimatedPanel'
import { useAuth } from '@/shared/context/AuthContext'
import styles from './ProfileSection.module.css'

export function ProfileSection() {
  const { user, isAuthed } = useAuth()

  return (
    <AnimatedPanel className={`panel ${styles.profilePanel}`} id="profile" staggerIndex={1}>
      <div className={styles.header}>
        <h1 className={styles.title}>profile</h1>
        <p>Manage your campus identity, track your impact, and rule them all.</p>
        {isAuthed && user ? (
          <div className={styles.userInfo}>
            <p>
              Welcome,{' '}
              <strong>
                {user.first_name} {user.last_name}
              </strong>
              !
            </p>
            <p className={styles.email}>{user.email}</p>
            <span className={styles.roleTag}>{user.role}</span>
          </div>
        ) : (
          <p>Please sign in to view your profile.</p>
        )}
      </div>
    </AnimatedPanel>
  )
}
