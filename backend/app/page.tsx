'use client';

import { useState } from 'react';

export default function Home() {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [testResults, setTestResults] = useState<any>({});

  const testHealth = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealthStatus(data);
    } catch (error) {
      setHealthStatus({ error: String(error) });
    }
  };

  const testImageAPI = async () => {
    try {
      // Create a small test image (1x1 red pixel)
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');
      ctx!.fillStyle = 'red';
      ctx!.fillRect(0, 0, 1, 1);
      const testImage = canvas.toDataURL('image/png');

      const res = await fetch('/api/scan-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: testImage }),
      });
      const data = await res.json();
      setTestResults({ ...testResults, image: data });
    } catch (error) {
      setTestResults({ ...testResults, image: { error: String(error) } });
    }
  };

  const testVideoAPI = async () => {
    try {
      // Create test frames (3 small images)
      const frames: string[] = [];
      for (let i = 0; i < 3; i++) {
        const canvas = document.createElement('canvas');
        canvas.width = 10;
        canvas.height = 10;
        const ctx = canvas.getContext('2d');
        ctx!.fillStyle = i === 0 ? 'red' : i === 1 ? 'green' : 'blue';
        ctx!.fillRect(0, 0, 10, 10);
        frames.push(canvas.toDataURL('image/png'));
      }

      const res = await fetch('/api/scan-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frames }),
      });
      const data = await res.json();
      setTestResults({ ...testResults, video: data });
    } catch (error) {
      setTestResults({ ...testResults, video: { error: String(error) } });
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', background: '#1a1a1a', color: '#fff', minHeight: '100vh' }}>
      <h1>🔧 CyberGuard Backend Test</h1>
      
      <div style={{ marginTop: '2rem' }}>
        <h2>1. Health Check</h2>
        <button 
          onClick={testHealth}
          style={{ padding: '0.5rem 1rem', marginBottom: '1rem', cursor: 'pointer' }}
        >
          Test /api/health
        </button>
        {healthStatus && (
          <pre style={{ background: '#2a2a2a', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
            {JSON.stringify(healthStatus, null, 2)}
          </pre>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>2. Image Scanner API</h2>
        <button 
          onClick={testImageAPI}
          style={{ padding: '0.5rem 1rem', marginBottom: '1rem', cursor: 'pointer' }}
        >
          Test /api/scan-image
        </button>
        {testResults.image && (
          <pre style={{ background: '#2a2a2a', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
            {JSON.stringify(testResults.image, null, 2)}
          </pre>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>3. Video Scanner API</h2>
        <button 
          onClick={testVideoAPI}
          style={{ padding: '0.5rem 1rem', marginBottom: '1rem', cursor: 'pointer' }}
        >
          Test /api/scan-video
        </button>
        {testResults.video && (
          <pre style={{ background: '#2a2a2a', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
            {JSON.stringify(testResults.video, null, 2)}
          </pre>
        )}
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#2a2a2a', borderRadius: '4px' }}>
        <h3>📝 Lưu ý:</h3>
        <ul>
          <li>Đảm bảo file <code>.env.local</code> có <code>GROQ_API_KEY</code></li>
          <li>Audio API cần file thật, không test được với mock data</li>
          <li>Nếu thấy lỗi 503, kiểm tra lại API key</li>
        </ul>
      </div>
    </div>
  );
}

