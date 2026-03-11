import clsx from 'clsx'
import styles from './TimerDisplay.module.css'

function formatSeconds(seconds) {
  return String(seconds).padStart(2, '0')
}

function TimerDisplay({ seconds, status, soundEnabled, onToggleSound, children }) {
  const isRunning = status === 'running'
  const isPaused = status === 'paused'
  const isAlarm = status === 'alarm'

  return (
    <div className={styles.root}>
      <div className={clsx(styles.shell)}>
        <div className={clsx(styles.screen, isAlarm && styles.screenAlarm)}>
          <div className={clsx(styles.digits)}>{formatSeconds(seconds)}</div>
        </div>

        <div className={styles.buttonSlot}>{children}</div>

        <div className={styles.statusRow}>
          <div className={styles.statusLights}>
            <div
              className={clsx(styles.statusDot, (isRunning || isAlarm) && styles.statusDotActive)}
              style={{ color: isAlarm ? '#ff1744' : '#4caf50' }}
            />
          </div>

          <button
            type="button"
            className={clsx(styles.soundToggle, soundEnabled && styles.soundToggleActive)}
            onClick={onToggleSound}
          >
            Geluid: {soundEnabled ? 'aan' : 'uit'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TimerDisplay

