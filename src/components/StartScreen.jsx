import styles from './StartScreen.module.css'
import logo from '../assets/Vector Logo - De Slimste Mens.png'
import sliderLogo from '../assets/Slider_IG_logo.png'

function StartScreen({ onStart }) {
  return (
    <div className={styles.root}>
      <div className={styles.logoWrapper}>
        <img src={logo} alt="De Slimste Mens" className={styles.logo} />
      </div>

      <button type="button" className={styles.startButton} onClick={onStart}>
        Start Game
      </button>

      <div className={styles.helperText}>Tip: gebruik in landscape-modus voor het beste resultaat.</div>

      <div className={styles.footerLogo}>
        <img src={sliderLogo} alt="Identity Games logo" />
      </div>
    </div>
  )
}

export default StartScreen

