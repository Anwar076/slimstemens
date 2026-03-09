import { useCallback, useRef } from 'react'
import styles from './TimerControls.module.css'

const LONG_PRESS_MS = 2000

function TimerControls({ onStartStop, onAdd20, onMinus20, onReset, onPowerToggle }) {
  const powerPressTimeout = useRef(null)

  const schedulePowerLongPress = useCallback(() => {
    if (powerPressTimeout.current) {
      clearTimeout(powerPressTimeout.current)
    }
    powerPressTimeout.current = setTimeout(() => {
      onPowerToggle()
      powerPressTimeout.current = null
    }, LONG_PRESS_MS)
  }, [onPowerToggle])

  const clearPowerLongPress = useCallback(() => {
    if (powerPressTimeout.current) {
      clearTimeout(powerPressTimeout.current)
      powerPressTimeout.current = null
    }
  }, [])

  const handlePowerDown = () => {
    schedulePowerLongPress()
  }

  const handlePowerUp = () => {
    // Short press: do nothing (no power toggle)
    clearPowerLongPress()
  }

  const handlePowerLeave = () => {
    clearPowerLongPress()
  }

  const confirmReset = () => {
    // eslint-disable-next-line no-alert
    const ok = window.confirm('Reset timer to 60 seconds?')
    if (ok) {
      onReset()
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.mainRow}>
        <button
          type="button"
          className={`${styles.secondaryButton} ${styles.mainCircle}`}
          onClick={onMinus20}
        >
          -20
        </button>

        <button
          type="button"
          className={`${styles.primaryButton} ${styles.mainCircle}`}
          onClick={onStartStop}
        >
          Start
          <br />
          Stop
        </button>

        <button
          type="button"
          className={`${styles.secondaryButton} ${styles.mainCircle}`}
          onClick={onAdd20}
        >
          +20
        </button>
      </div>

      <div className={styles.secondaryRow}>
        <button
          type="button"
          className={styles.resetButton}
          onClick={confirmReset}
        >
          Reset
        </button>

        <button
          type="button"
          className={styles.powerButton}
          onPointerDown={handlePowerDown}
          onPointerUp={handlePowerUp}
          onPointerLeave={handlePowerLeave}
          onPointerCancel={handlePowerLeave}
        >
          Power
          <div className={styles.smallLabel}>Hold 2s</div>
        </button>
      </div>
    </div>
  )
}

export default TimerControls

