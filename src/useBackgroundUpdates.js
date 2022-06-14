import { useCallback, useEffect, useRef } from "react";

const channel = new BroadcastChannel('backgroundUpdates');

const useBackgroundUpdates = (onUpdate = () => {}, autoStart = false) => {
  const isRunningRef = useRef(false)

  const startUpdates = useCallback(() => {
    if (isRunningRef.current) {
      return
    }

    isRunningRef.current = true
    channel.postMessage('startPolling')
  }, [])

  const stopUpdates = useCallback(() => {
    if (isRunningRef.current) {
      isRunningRef.current = false
      channel.postMessage('stopPolling')
    }
  }, [])

  useEffect(() => {
    const onMessage = ({ data }) => onUpdate(data)

    channel.addEventListener('message', onMessage)
    return () => channel.removeEventListener('message', onMessage)
  }, [onUpdate])

  useEffect(() => {
    if (autoStart) {
      startUpdates()
    }

    return stopUpdates
  }, [autoStart, startUpdates, stopUpdates])

  return startUpdates
}

export default useBackgroundUpdates
