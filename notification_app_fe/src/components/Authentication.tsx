import React, { useState } from 'react';
import evaluationService from '../services/evaluationService';

const Authentication: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    rollNo: '',
    accessCode: '',
    clientId: '',
    clientSecret: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await evaluationService.authenticate(formData);
      setMessage(
        'Authentication successful! Your access token has been saved in the browser.'
      );
      console.log('Auth Response:', response);
      try {
        await evaluationService.logInfo(
          `User authenticated successfully`,
          'notification-app-fe'
        );
      } catch {
        // ignore log failures
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Authentication failed';
      setError(errorMsg);
      try {
        await evaluationService.logError(
          `Authentication failed: ${errorMsg}`,
          'notification-app-fe'
        );
      } catch {
        // ignore log failures
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px' }}>
      <h2>User Authentication</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Roll No:</label>
          <input
            type="text"
            name="rollNo"
            value={formData.rollNo}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Access Code:</label>
          <input
            type="text"
            name="accessCode"
            value={formData.accessCode}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Client ID:</label>
          <input
            type="text"
            name="clientId"
            value={formData.clientId}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Client Secret:</label>
          <input
            type="password"
            name="clientSecret"
            value={formData.clientSecret}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#2196F3',
            color: 'white',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Authenticating...' : 'Authenticate'}
        </button>
      </form>
      {message && <p style={{ color: 'green', marginTop: '15px' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
    </div>
  );
};

export default Authentication;
