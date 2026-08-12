import { useEffect, useState } from 'react';
import { Switch } from '@backstage/ui';

export const THEME_STORAGE_KEY = 'acme-theme-mode';

/**
 * The choice has to outlive the page: a first load starts from nothing, and a
 * client-side swap replaces <html> along with the attribute. It is persisted
 * to localStorage and applied by the inline script in Layout.astro — on first
 * paint and again on every `astro:after-swap`. This component only syncs the
 * knob to whatever that script already decided.
 */
export function ThemeSwitch() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(
      document.documentElement.getAttribute('data-theme-mode') === 'dark',
    );
  }, []);

  const onChange = (selected: boolean) => {
    setIsDark(selected);
    const mode = selected ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme-mode', mode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // storage unavailable (private mode, disabled cookies) — theme still
      // applies for this page, it just will not survive navigation
    }
  };

  return <Switch label="Dark mode" isSelected={isDark} onChange={onChange} />;
}
