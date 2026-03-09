import { useState } from 'react'
import StartScreen from './components/StartScreen.jsx'
import TimerPage from './components/TimerPage.jsx'
import styles from './App.module.css'

function App() {
  const [screen, setScreen] = useState('start') // 'start' | 'timer'

  return (
    <div className={styles.appRoot}>
      {screen === 'start' ? (
        <StartScreen onStart={() => setScreen('timer')} />
      ) : (
        <TimerPage onBackToStart={() => setScreen('start')} />
      )}
    </div>
  )
}

export default App
