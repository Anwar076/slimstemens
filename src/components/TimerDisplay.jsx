import clsx from 'clsx'
import styles from './TimerDisplay.module.css'

function formatSeconds(seconds) {
  return String(seconds).padStart(2, '0')
}

function TimerDisplay({ seconds, status, soundEnabled, isOn, onToggleSound, children }) {
  const isRunning = status === 'running'
  const isPaused = status === 'paused'
  const isAlarm = status === 'alarm'

  return (
    <div className={styles.root}>
      <div className={clsx(styles.shell, !isOn && styles.shellOff)}>
        <div className={clsx(styles.screen, isAlarm && styles.screenAlarm)}>
          <div className={clsx(styles.digits, !isOn && styles.digitsOff)}>{formatSeconds(seconds)}</div>
        </div>

        <div className={styles.buttonSlot}>{children}</div>

        <div className={styles.statusRow}>
          <div className={styles.statusLights}>
            <div
              className={clsx(styles.statusDot, (isRunning || isAlarm) && styles.statusDotActive)}
              style={{ color: isAlarm ? '#ff1744' : '#4caf50' }}
            />
            <span className={styles.statusLabel}>{isAlarm ? 'Alarm' : isRunning ? 'Running' : 'Ready'}</span>
          </div>

          <div className={styles.stateText}>
            {status === 'off' && 'Power Off'}
            {status === 'running' && 'Counting Down'}
            {status === 'paused' && 'Paused'}
            {status === 'alarm' && 'Time Up'}
          </div>

          <button
            type="button"
            className={clsx(styles.soundToggle, soundEnabled && styles.soundToggleActive)}
            onClick={onToggleSound}
          >
            {soundEnabled ? 'Sound On' : 'Sound Off'}
          </button>
        </div>
      </div>

      {isPaused && (
        <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>
          Timer gepauzeerd – tik op START/STOP om verder te gaan.
        </div>
      )}
    </div>
  )
}

export default TimerDisplay

