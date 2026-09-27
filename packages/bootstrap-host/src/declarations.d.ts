/// <reference types="vite/client" />

declare module 'salt_mfe/SaltWidget' {
  import React from 'react';
  export interface SaltWidgetProps {
    colorMode?: 'light' | 'dark' | 'auto';
    density?: 'high' | 'medium' | 'low' | 'touch';
    compatMode?: boolean;
    activeTab?: string;
    onTabChange?: (tab: string) => void;
  }
  export const SaltWidget: React.ComponentType<SaltWidgetProps>;
  export default SaltWidget;
}
