import React, { useState, useEffect } from 'react';
import { testSupabaseConnection, testOwnerLogin, testUserLogin } from '../utils/supabaseTest';

const DebugPage = () => {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [testCredentials, setTestCredentials] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const result = await testSupabaseConnection();
    setConnectionStatus(result);
  };

  const handleTestLogin = async (userType) => {
    try {
      let result;
      if (userType === 'owner') {
        result = await testOwnerLogin(testCredentials.email, testCredentials.password);
      } else {
        result = await testUserLogin(testCredentials.email, testCredentials.password);
      }
      setTestResult({ type: userType, result });
    } catch (error) {
      setTestResult({ type: userType, result: { error: error.message } });
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Debug Page - Supabase Connection Test</h1>
      
      <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3>Connection Status</h3>
        <button onClick={checkConnection} style={{ padding: '10px', margin: '10px 0' }}>
          Test Connection
        </button>
        {connectionStatus && (
          <div style={{ 
            padding: '10px', 
            backgroundColor: connectionStatus.success ? '#d4edda' : '#f8d7da',
            border: connectionStatus.success ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
            borderRadius: '5px',
            marginTop: '10px'
          }}>
            <strong>Status:</strong> {connectionStatus.success ? 'Connected' : 'Failed'}<br/>
            {connectionStatus.error && <><strong>Error:</strong> {connectionStatus.error}</>}
            {connectionStatus.data && <><strong>Data:</strong> {JSON.stringify(connectionStatus.data)}</>}
          </div>
        )}
      </div>

      <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3>Login Test</h3>
        <div style={{ margin: '10px 0' }}>
          <label>Email: </label>
          <input 
            type="email" 
            value={testCredentials.email}
            onChange={(e) => setTestCredentials({...testCredentials, email: e.target.value})}
            style={{ padding: '5px', margin: '0 10px', width: '200px' }}
          />
        </div>
        <div style={{ margin: '10px 0' }}>
          <label>Password: </label>
          <input 
            type="password" 
            value={testCredentials.password}
            onChange={(e) => setTestCredentials({...testCredentials, password: e.target.value})}
            style={{ padding: '5px', margin: '0 10px', width: '200px' }}
          />
        </div>
        <div style={{ margin: '10px 0' }}>
          <button 
            onClick={() => handleTestLogin('owner')}
            style={{ padding: '10px', margin: '5px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px' }}
          >
            Test Owner Login
          </button>
          <button 
            onClick={() => handleTestLogin('user')}
            style={{ padding: '10px', margin: '5px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '3px' }}
          >
            Test User Login
          </button>
        </div>
        
        {testResult && (
          <div style={{ 
            padding: '10px', 
            backgroundColor: testResult.result.error ? '#f8d7da' : '#d4edda',
            border: testResult.result.error ? '1px solid #f5c6cb' : '1px solid #c3e6cb',
            borderRadius: '5px',
            marginTop: '10px'
          }}>
            <strong>Test Type:</strong> {testResult.type}<br/>
            <strong>Result:</strong> <pre>{JSON.stringify(testResult.result, null, 2)}</pre>
          </div>
        )}
      </div>

      <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3>Current Environment</h3>
        <p><strong>User Agent:</strong> {navigator.userAgent}</p>
        <p><strong>URL:</strong> {window.location.href}</p>
        <p><strong>Local Storage:</strong></p>
        <pre>{JSON.stringify(localStorage.getItem('currentUser'), null, 2)}</pre>
      </div>
    </div>
  );
};

export default DebugPage;
