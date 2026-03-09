import TimerDisplay from './TimerDisplay.jsx'
import TimerControls from './TimerControls.jsx'
import { useTimer } from '../hooks/useTimer.js'
import styles from './TimerPage.module.css'

function TimerPage({ onBackToStart }) {
  const {
    seconds,
    status,
    soundEnabled,
    isOn,
    startStop,
    add20,
    minus20,
    reset,
    togglePower,
    toggleSound,
  } = useTimer()

  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.topBar}>
          <button type="button" className={styles.backButton} onClick={onBackToStart}>
            ← Menu
          </button>
          <div className={styles.gameTitle}>De Slimste Mens · Timer</div>
        </div>

        <TimerDisplay
          seconds={seconds}
          status={status}
          soundEnabled={soundEnabled}
          isOn={isOn}
          onToggleSound={toggleSound}
        >
          <TimerControls
            onStartStop={startStop}
            onAdd20={add20}
            onMinus20={minus20}
            onReset={reset}
            onPowerToggle={togglePower}
          />
        </TimerDisplay>

        <div className={styles.footerHint}>
          Houd de START/STOP-knop 2 seconden ingedrukt om het apparaat aan/uit te zetten.
        </div>
      </div>
    </div>
  )
}

export default TimerPage

