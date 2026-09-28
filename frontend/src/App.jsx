import { useEffect, useState } from 'react';
import api from './api';

function App() {
  const [status, setStatus] = useState('');

  useEffect(() => {
    api.get('/health')
      .then((response) => setStatus(response.data.status))
      .catch(() => setStatus('error'));
  }, []);

  return (
    <div>
      <h1>Fitness Center</h1>
      <p>Backend status: {status}</p>
    </div>
  );
}

export default App;
