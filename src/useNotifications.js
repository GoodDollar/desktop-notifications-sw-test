import { useCallback, useEffect, useState } from "react"

const checkNotificationPermissions = (permission = null) =>
  (permission || Notification.permission) === "granted"

const useNotifications = () => {
  const [enabled, setEnabled] = useState(checkNotificationPermissions)

  const query = useCallback(async () => {
    const isEnabled = checkNotificationPermissions()

    if (!isEnabled) {
      const permission = await Notification.requestPermission()

      setEnabled(checkNotificationPermissions(permission))
    }
  }, [setEnabled])

  const send = useCallback((title, body, icon) => {
    const options = { body, icon }

    return enabled ? new Notification(title, options) : null
  }, [enabled])

  return [enabled, query, send]
}

export default useNotifications
