import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { AnimatedPanel } from '../components/AnimatedPanel'
import { useExitNavigation } from '../hooks/useExitNavigation'
import { StaggerWords } from '../components/StaggerWords'
import { TypewriterWord } from '../components/TypewriterWord'

export function HeroSection() {
  const [howModalOpen, setHowModalOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  const navigateWithExit = useExitNavigation()

  useEffect(() => {
    if (!howModalOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setHowModalOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [howModalOpen])

  const openHowModal = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    setHowModalOpen(true)
  }

  const onAppCtaClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    navigateWithExit(event, 'https://capyrpi.org/app')
  }

  const closeHowModal = () => setHowModalOpen(false)

  return (
    <>
      <AnimatedPanel className="panel heroPanel" id="launch" staggerIndex={0}>
        <div className="heroRows">
          <div className="heroRowTitle">
            <h1>
              <span>
                more <TypewriterWord words={['sleep', 'growth', 'fun']} />
              </span>
              <span>
                <StaggerWords text="for you" baseDelay={0.12} />
              </span>
            </h1>
          </div>
          <div className="heroRowBottom">
            <div className="heroDescription">
              <p>
                <StaggerWords
                  text="your campus life, simplified."
                  baseDelay={0.2}
                  stagger={0.018}
                />
              </p>
              <p>
                <StaggerWords
                  text="find your community, track your impact, and discover opportunities."
                  baseDelay={0.28}
                  stagger={0.018}
                />
              </p>
              <p>
                <StaggerWords
                  text="built by students, for students."
                  baseDelay={0.36}
                  stagger={0.018}
                />
              </p>
            </div>
            <div className="heroCtas">
              <a
                className="pillButton accent"
                href="https://capyrpi.org/app"
                onClick={onAppCtaClick}
              >
                <StaggerWords text="absolutely" baseDelay={0.28} />
              </a>
              <a className="pillButton subtle" href="#features" onClick={openHowModal}>
                <StaggerWords text="how" baseDelay={0.34} />
              </a>
            </div>
          </div>
        </div>
      </AnimatedPanel>

      <AnimatePresence>
        {howModalOpen ? (
          <motion.div
            className="howModalBackdrop"
            onClick={closeHowModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="howModalCard"
              role="dialog"
              aria-modal="true"
              aria-label="Demo update"
              onClick={(event) => event.stopPropagation()}
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 12, scale: 0.98, filter: 'blur(2px)' }
              }
              animate={
                reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
              }
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 10, scale: 0.985, filter: 'blur(2px)' }
              }
              transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="howModalText">
                we're working on the demo video (and sleeping!). in the meantime, reach out at{' '}
                <a href="mailto:hello@capyrpi.org">hello@capyrpi.org</a> for a demo, or{' '}
                <a href="https://capyrpi.org/app" onClick={onAppCtaClick}>
                  get started right away!
                </a>
              </p>
              <button type="button" className="howModalClose" onClick={closeHowModal}>
                close
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
