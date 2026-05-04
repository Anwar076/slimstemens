import styles from './TimerControls.module.css'

function TimerControls({ onStartStop, onAdd20, onMinus20, onReset }) {
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
          onClick={onAdd20}
        >
          +20
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
          onClick={onMinus20}
        >
          -20
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
      </div>
    </div>
  )
}

export default TimerControls

