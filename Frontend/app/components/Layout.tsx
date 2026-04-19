'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSettings } from '../hooks/useSettings';
import SettingsSidebar from './SettingsSidebar';
import SearchModal from './SearchModal';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { settings, updateSettings } = useSettings();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    router.push('/');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-left-controls">
            {pathname !== '/' && (
              <button
                type="button"
                className="navbar-action"
                onClick={handleBack}
                aria-label="Go back"
              >
                ← Back
              </button>
            )}
          </div>
          <h2 className="navbar-title">Quran</h2>
          <div className="navbar-right-controls">
            <button
              type="button"
              className="navbar-action"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
            >
              Search
            </button>
            <button
              type="button"
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              ⚙️
            </button>
          </div>
        </div>
      </nav>

      <div className="layout-container">
        {sidebarOpen && (
          <SettingsSidebar
            settings={settings}
            updateSettings={updateSettings}
            onClose={() => setSidebarOpen(false)}
          />
        )}
        <main className="main-content">
          {children}
        </main>
      </div>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}

      <footer className="footer">
        <p>&copy; 2026 Quran Web App. All rights reserved.</p>
      </footer>
    </div>
  );
}
