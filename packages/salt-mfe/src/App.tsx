import React, { useState } from 'react';
import { SaltWidget } from './mfe/SaltWidget';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [density, setDensity] = useState<'touch' | 'low' | 'medium' | 'high'>('medium');
  const [bridgeEnabled, setBridgeEnabled] = useState<boolean>(false);

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', maxWidth: '850px', margin: '0 auto', fontFamily: bridgeEnabled ? 'var(--bs-body-font-family)' : '"Open Sans", sans-serif' }}>
      {/* Standalone Control Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
            Salt Microfrontend (Port 3001 Standalone)
          </h2>
          <p style={{ margin: '0.25rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
            Mode: <strong>{bridgeEnabled ? 'Bridge Compatibility Active (Bootstrap styling)' : 'Pure Salt DS Native Behavior'}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Bridge Toggle */}
          <button
            type="button"
            onClick={() => setBridgeEnabled(!bridgeEnabled)}
            style={{
              padding: '0.4rem 0.8rem',
              cursor: 'pointer',
              borderRadius: '4px',
              border: bridgeEnabled ? '2px solid #0d6efd' : '1px solid #999',
              background: bridgeEnabled ? '#0d6efd' : '#f0f0f0',
              color: bridgeEnabled ? '#fff' : '#222',
              fontWeight: 600,
            }}
          >
            {bridgeEnabled ? '✓ Bridge Enabled' : 'Enable Bootstrap Bridge'}
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            style={{ padding: '0.4rem 0.8rem', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>

          {/* Density Selector */}
          <select
            value={density}
            onChange={(e) => setDensity(e.target.value as any)}
            style={{ padding: '0.4rem 0.8rem', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}
          >
            <option value="high">High Density</option>
            <option value="medium">Medium Density</option>
            <option value="low">Low Density</option>
            <option value="touch">Touch Density</option>
          </select>
        </div>
      </div>

      {/* Widget Container */}
      <div style={{ border: '1px solid rgba(128, 128, 128, 0.25)', borderRadius: '8px', overflow: 'hidden' }}>
        <SaltWidget
          colorMode={theme}
          density={density}
          compatMode={bridgeEnabled}
        />
      </div>
    </div>
  );
};

export default App;
