import { useEffect, useRef, useState } from 'react'

const DEFAULT_SECONDS = 60
const STEP = 20

function createAlarmBeep() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return null
    const ctx = new AudioContext()
    const duration = 0.6
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()

    oscillator.type = 'square'
    oscillator.frequency.value = 880

    gain.gain.setValueAtTime(0.001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

    oscillator.connect(gain)
    gain.connect(ctx.destination)

    oscillator.start()
    oscillator.stop(ctx.currentTime + duration)

    oscillator.onended = () => {
      ctx.close()
    }
  } catch {
    // Ignore audio errors (e.g. unsupported browser)
  }
  return null
}

function useWakeLock(isActive) {
  const wakeLockRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    async function requestWakeLock() {
      if (!('wakeLock' in navigator) || wakeLockRef.current || !isActive) return

      try {
        const lock = await navigator.wakeLock.request('screen')
        if (cancelled) {
          await lock.release()
          return
        }
        wakeLockRef.current = lock
        lock.addEventListener('release', () => {
          wakeLockRef.current = null
        })
      } catch {
        // Silent fail – wake lock is a progressive enhancement
      }
    }

    if (isActive) {
      requestWakeLock()
    } else if (wakeLockRef.current) {
      wakeLockRef.current.release()
      wakeLockRef.current = null
    }

    return () => {
      cancelled = true
      if (wakeLockRef.current) {
        wakeLockRef.current.release()
        wakeLockRef.current = null
      }
    }
  }, [isActive])
}

export function useTimer() {
  const [seconds, setSeconds] = useState(DEFAULT_SECONDS)
  const [isRunning, setIsRunning] = useState(false)
  const [isAlarm, setIsAlarm] = useState(false)
  const [isOn, setIsOn] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const intervalRef = useRef(null)

  // Keep screen awake while actively counting down
  useWakeLock(isRunning && isOn && !isAlarm)

  useEffect(() => {
    if (!isRunning || !isOn || isAlarm) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return undefined
    }

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRunning, isOn, isAlarm])

  // Trigger alarm when we hit 0 from a running state
  useEffect(() => {
    if (!isRunning || seconds > 0 || !isOn) return

    setIsRunning(false)
    setIsAlarm(true)

    if (soundEnabled) {
      createAlarmBeep()
    }
  }, [seconds, isRunning, isOn, soundEnabled])

  const startStop = () => {
    if (!isOn) return

    if (isAlarm) {
      // Clear alarm and reset to default
      setIsAlarm(false)
      setSeconds(DEFAULT_SECONDS)
      setIsRunning(false)
      return
    }

    setIsRunning((prev) => !prev)
  }

  const adjustSeconds = (delta) => {
    if (!isOn) return
    setSeconds((prev) => {
      const next = prev + delta
      if (next < 0) return 0
      return next
    })
    if (isAlarm && delta > 0) {
      setIsAlarm(false)
    }
  }

  const add20 = () => adjustSeconds(STEP)
  const minus20 = () => adjustSeconds(-STEP)

  const reset = () => {
    setSeconds(DEFAULT_SECONDS)
    setIsRunning(false)
    setIsAlarm(false)
  }

  const togglePower = () => {
    setIsOn((prev) => {
      const next = !prev
      if (!next) {
        setIsRunning(false)
        setIsAlarm(false)
      } else {
        setSeconds(DEFAULT_SECONDS)
      }
      return next
    })
  }

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev)
  }

  let status = 'paused'
  if (!isOn) status = 'off'
  else if (isAlarm) status = 'alarm'
  else if (isRunning) status = 'running'

  return {
    seconds,
    isRunning,
    isAlarm,
    isOn,
    soundEnabled,
    status,
    startStop,
    add20,
    minus20,
    reset,
    togglePower,
    toggleSound,
  }
}

export default useTimer

