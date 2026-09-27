import React, { useEffect, useState, useCallback } from 'react';
import { SaltProvider } from '@salt-ds/core';

type ColorMode = 'light' | 'dark' | 'auto';
type Density = 'high' | 'medium' | 'low' | 'touch';

export interface SaltMFEWrapperProps {
  children: React.ReactNode;
  /** Color mode. 'auto' detects from Bootstrap's [data-bs-theme]. @default 'auto' */
  colorMode?: ColorMode;
  /** Salt density. 'medium' maps closest to Bootstrap. @default 'medium' */
  density?: Density;
  /** Additional CSS class name */
  className?: string;
  /** Enable debug mode — logs warnings for unmapped tokens. @default false */
  debug?: boolean;
  /** ID attribute for the wrapper div */
  id?: string;
}

function getBootstrapTheme(): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'dark' : 'light';
}

function validateBridgeTokens(el: HTMLElement): void {
  const styles = getComputedStyle(el);
  const tokens = [
    '--salt-actionable-primary-background',
    '--salt-content-primary-foreground',
    '--salt-container-primary-background',
    '--salt-text-fontFamily',
    '--salt-status-error-foreground',
  ];

  const issues = tokens.filter(t => !styles.getPropertyValue(t).trim());

  if (issues.length > 0) {
    console.warn('[SaltMFEWrapper] Unmapped tokens:', issues);
  } else {
    console.log('[SaltMFEWrapper] ✅ All critical bridge tokens mapped.');
  }
}

/**
 * Wraps any Salt DS micro-frontend so its design tokens adopt Bootstrap host app tokens.
 */
export const SaltMFEWrapper: React.FC<SaltMFEWrapperProps> = ({
  children,
  colorMode = 'auto',
  density = 'medium',
  className = '',
  debug = false,
  id,
}) => {
  const [bsTheme, setBsTheme] = useState<'light' | 'dark'>(getBootstrapTheme);

  useEffect(() => {
    if (colorMode !== 'auto') return;
    setBsTheme(getBootstrapTheme());

    const observer = new MutationObserver(() => setBsTheme(getBootstrapTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-bs-theme'],
    });
    return () => observer.disconnect();
  }, [colorMode]);

  const wrapperRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node && debug) {
        requestAnimationFrame(() => validateBridgeTokens(node));
      }
    },
    [debug]
  );

  const resolvedMode = colorMode === 'auto' ? bsTheme : colorMode;

  return (
    <div
      ref={wrapperRef}
      className={['salt-bootstrap-compat', className].filter(Boolean).join(' ')}
      id={id}
    >
      <SaltProvider mode={resolvedMode} density={density}>
        {children}
      </SaltProvider>
    </div>
  );
};

export default SaltMFEWrapper;
