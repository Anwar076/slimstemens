import { useEffect, useRef, useState } from 'react'

const DEFAULT_SECONDS = 60
const STEP = 20

function playAlarmSound() {
  try {
    const audio = new Audio('/sounds/alarm.mp3')
    audio.play().catch(() => {
      // Ignore play errors (e.g. not allowed without user gesture)
    })
  } catch {
    // Ignore audio errors
  }
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
  const [soundEnabled, setSoundEnabled] = useState(true)

  const intervalRef = useRef(null)

  // Keep screen awake while actively counting down
  useWakeLock(isRunning && !isAlarm)

  useEffect(() => {
    if (!isRunning || isAlarm) {
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
  }, [isRunning, isAlarm])

  // Trigger alarm when we hit 0 from a running state
  useEffect(() => {
    if (!isRunning || seconds > 0) return

    setIsRunning(false)
    setIsAlarm(true)

    if (soundEnabled) {
      playAlarmSound()
    }
  }, [seconds, isRunning, soundEnabled])

  const startStop = () => {
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

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev)
  }

  let status = 'paused'
  if (isAlarm) status = 'alarm'
  else if (isRunning) status = 'running'

  return {
    seconds,
    isRunning,
    isAlarm,
    soundEnabled,
    status,
    startStop,
    add20,
    minus20,
    reset,
    toggleSound,
  }
}

export default useTimer

