import styles from './StartScreen.module.css'
import logo from '../assets/Vector Logo - De Slimste Mens.png'
import sliderLogo from '../assets/Slider_IG_logo.png'

function StartScreen({ onStart }) {
  return (
    <main className={styles.root}>
      <header className={styles.logoWrapper}>
        <img src={logo} alt="De Slimste Mens logo" className={styles.logo} />
      </header>

      <button
        type="button"
        className={styles.startButton}
        onClick={onStart}
        aria-label="Start het spel en open de timer"
      >
        Start het spel
      </button>

      <footer className={styles.footerLogo} aria-label="Identity Games">
        <img src={sliderLogo} alt="Identity Games" />
      </footer>
    </main>
  )
}

export default StartScreen

