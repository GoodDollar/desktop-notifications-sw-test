let polling = false;
let pollingInterval;

const makeNotification = (title, body, icon) => {
  const options = { body, icon };

  return { title, options };
}

const sendNotification = notification => {
  const { title, options } = notification
  const isEnabled = "undefined" !== typeof Notification
    && "granted" === Notification.permission;

  if (isEnabled) {
    self.registration.showNotification(title, options)
  }

  return isEnabled
};

const startPolling = channel => {
  if (polling) {
    return
  }

  polling = true;
  pollingInterval = setInterval(() => {
    const notification = makeNotification('Test notification', 'You\'ve got an update!');
    // trying to send notification from SW
    const notificationSent = sendNotification(notification);

    channel.postMessage({
      message: 'update',
      notification,
      notificationSent // Safari doesnt sends notifications from SW,
      // so we're passing 'sent' flag for the app could re-send it if false
    });
  }, 5000);
}

const stopPolling = () => {
  if (polling) {
    polling = false;
    clearInterval(pollingInterval);
  }
};

addEventListener('message', ({ source, data }) => {
  switch (data) {
    case 'startPolling':
      startPolling(source);
      break;
    case 'stopPolling':
      stopPolling();
      break;
    default:
      break;
  }
});
