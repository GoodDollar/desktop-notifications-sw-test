import './App.css';
import useNotifications from './useNotifications';
import { useCallback, useEffect } from 'react';
import useBackgroundUpdates from './useBackgroundUpdates';

const App = () => {
  const [enabled, query] = useNotifications();
  const onUpdate = useCallback(() => console.log('Update received!'), []);
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
