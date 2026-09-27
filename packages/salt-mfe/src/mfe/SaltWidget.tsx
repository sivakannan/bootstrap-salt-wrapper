import React from 'react';
import '@salt-ds/theme/index.css';
import '../styles/salt-bootstrap-bridge/index.css';
import { SaltMFEWrapper } from '../components/SaltMFEWrapper';
import { SaltProvider } from '@salt-ds/core';
import { SaltMicrofrontend } from './SaltMicrofrontend';

export interface SaltWidgetProps {
  colorMode?: 'light' | 'dark' | 'auto';
  density?: 'high' | 'medium' | 'low' | 'touch';
  /**
   * When true, applies the .salt-bootstrap-compat bridge so the component adopts Bootstrap styles.
   * When false (standalone mode), runs as pure Salt DS with native Salt styling and Open Sans font.
   * @default true
   */
  compatMode?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const SaltWidget: React.FC<SaltWidgetProps> = ({
  colorMode = 'auto',
  density = 'medium',
  compatMode = true,
  activeTab,
  onTabChange,
}) => {
  if (!compatMode) {
    return (
      <SaltProvider mode={colorMode === 'auto' ? 'light' : colorMode} density={density}>
        <SaltMicrofrontend compatMode={false} activeTab={activeTab} onTabChange={onTabChange} />
      </SaltProvider>
    );
  }

  return (
    <SaltMFEWrapper colorMode={colorMode} density={density}>
      <SaltMicrofrontend compatMode={true} activeTab={activeTab} onTabChange={onTabChange} />
    </SaltMFEWrapper>
  );
};

export default SaltWidget;
