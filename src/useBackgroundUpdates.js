import { useCallback, useEffect, useRef } from "react";

const { serviceWorker } = navigator

const getChannel = async () => {
  let { controller: channel } = serviceWorker

  if (!channel) {
    const { active } = await serviceWorker.ready;

    channel = active
  }

  return channel
}

const useBackgroundUpdates = (onUpdate = () => {}, autoStart = false) => {
  const isRunningRef = useRef(false)

  const startUpdates = useCallback(async () => {
    const channel = await getChannel()
    const { current: isRunning } = isRunningRef

    if (isRunning) {
      return
    }

    isRunningRef.current = true;
    channel.postMessage('startPolling');
  }, [])

  const stopUpdates = useCallback(async () => {
    const channel = await getChannel()
    const { current: isRunning } = isRunningRef;

    if (isRunning && channel) {
      isRunningRef.current = false;
      channel.postMessage('stopPolling');
    }
  }, [])

  useEffect(() => {
    const onMessage = ({ data }) => {
      const { message, notification, notificationSent } = data

      if ("update" === message) {
        onUpdate(notification, notificationSent)
      }
    }

    serviceWorker.addEventListener('message', onMessage);

    return () => {
      serviceWorker.removeEventListener('message', onMessage);
    }
  }, [onUpdate])

  useEffect(() => {
    if (autoStart) {
      startUpdates();
    }

    return stopUpdates;
  }, [autoStart, startUpdates, stopUpdates])

  return startUpdates;
}

export default useBackgroundUpdates
