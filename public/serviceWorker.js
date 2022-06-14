let polling = false;
let pollingInterval;

const channel = new BroadcastChannel('backgroundUpdates');

const checkNotificationPermissions = (permission = null) => {
  const status = permission || Notification.permission;

  return status === "granted"
};

const sendNotification = (title, body, icon) => {
  const options = { body, icon };
  const isEnabled = checkNotificationPermissions();

  if (isEnabled) {
    self.registration.showNotification(title, options)
  }
};

const startPolling = () => {
  if (polling) {
    return
  }

  polling = true;
  pollingInterval = setInterval(() => {
    channel.postMessage('update');
    sendNotification('Test notification', 'You\'ve got an update!');
  }, 5000);
}

const stopPolling = () => {
  if (polling) {
    polling = false;
    clearInterval(pollingInterval);
  }
};

channel.addEventListener('message', ({ data }) => {
  switch (data) {
    case 'startPolling':
      startPolling();
      break;
    case 'stopPolling':
      stopPolling();
      break;
    default:
      break;
  }
});
