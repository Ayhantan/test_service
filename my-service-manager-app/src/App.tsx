import { useState } from 'react';
import { UserService } from './services/UserService';
import { ApiClient } from './core/ApiClient';

function App() {
  const [result, setResult] = useState<any>(null);

  const handleGetOne = async () => {
    const res = await UserService.getOne(1);
    setResult(res);
  };

  const handlePost = async () => {
    const res = await UserService.create({ name: 'Test', email: 'test@example.com' });
    setResult(res);
  };

  const handlePut = async () => {
    const res = await UserService.update(1, { name: 'Updated' });
    setResult(res);
  };

  const handlePatch = async () => {
    const res = await ApiClient.patch('/users/1', { name: 'Patched' });
    setResult(res);
  };

  const handleDelete = async () => {
    await ApiClient.delete('/users/1');
    setResult('Deleted');
  };


  const handlePostForm = async () => {
    const formData = new FormData();
    formData.append('title', 'Test Title');
    formData.append('body', 'Test Body');

    const res = await ApiClient.postForm('/posts', formData);
    setResult(res);
  };

  const handleRequest = async () => {
    const res = await ApiClient.request({
      url: '/users/1',
      method: 'GET',
    });
    setResult(res);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>ServiceManager Test Playground</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        <button onClick={handleGetOne}>GET One</button>
        <button onClick={handlePost}>POST</button>
        <button onClick={handlePut}>PUT</button>
        <button onClick={handlePatch}>PATCH</button>
        <button onClick={handleDelete}>DELETE</button>
        <button onClick={handlePostForm}>POST FormData</button>
        <button onClick={handleRequest}>Generic Request</button>
      </div>

      <h3 style={{ marginTop: '2rem' }}>Result:</h3>
      <pre style={{ background: '#f5f5f5', padding: '1rem' }}>
        {result ? JSON.stringify(result, null, 2) : 'No result yet.'}
      </pre>
    </div>
  );
}

export default App;
