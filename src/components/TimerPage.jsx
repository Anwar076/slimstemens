import TimerDisplay from './TimerDisplay.jsx'
import TimerControls from './TimerControls.jsx'
import { useTimer } from '../hooks/useTimer.js'
import styles from './TimerPage.module.css'

function TimerPage({ onBackToStart }) {
  const {
    seconds,
    status,
    soundEnabled,
    startStop,
    add20,
    minus20,
    reset,
    toggleSound,
  } = useTimer()

  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <TimerDisplay
          seconds={seconds}
          status={status}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
        >
          <TimerControls
            onStartStop={startStop}
            onAdd20={add20}
            onMinus20={minus20}
            onReset={reset}
          />
        </TimerDisplay>

        {/* <div className={styles.footerHint}>Tip: gebruik landschapsmodus voor het beste speelgevoel.</div> */}
      </div>
    </div>
  )
}

export default TimerPage

