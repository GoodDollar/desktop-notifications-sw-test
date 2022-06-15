import './App.css';
import useNotifications from './useNotifications';
import { useCallback, useEffect } from 'react';
import useBackgroundUpdates from './useBackgroundUpdates';

const App = () => {
  const [enabled, query, send] = useNotifications();

  const onUpdate = useCallback((notification, notificationSent) => {
    const { title, options } = notification

    console.log('Update received!', { notification, notificationSent });

    // Safari doesnt supports sending desktop notifications from the service worker
    // So we're checking 'sent' flag and if SW hadn't sent it, re-trying to send on the app's side
    if (!notificationSent) {
      send(title, options)
    }
  }, [send]);

  const startUpdates = useBackgroundUpdates(onUpdate);

  useEffect(() => {
    if (enabled) {
      startUpdates();
    }
  }, [enabled, startUpdates])

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Notifications: <code>{enabled ? 'enabled' : 'disabled'}</code>
        </p>
        {!enabled && (
          <button onClick={query}>Enable</button>
        )}
      </header>
    </div>
  );
}

export default App;
