import { useEffect, useState } from 'react';
import useNoteStore from './store/useNoteStore';
import useThemeStore from './store/useThemeStore';
import useAuthStore from './store/useAuthStore';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Settings from './components/Settings';
import Auth from './components/Auth';

function App() {
  const fetchNotes = useNoteStore((s) => s.fetchNotes);
  const initTheme = useThemeStore((s) => s.init);
  const token = useAuthStore((s) => s.token);
  const isOfflineMode = useAuthStore((s) => s.isOfflineMode);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('editor'); 
  const [settingsSection, setSettingsSection] = useState('Sync & Cloud');

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  useEffect(() => {
    if (token) {
      fetchNotes();
    }
  }, [fetchNotes, token]);

  if (!token && !isOfflineMode) {
    return <Auth />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 transition-theme">
      {currentView === 'editor' ? (
        <>
          <Sidebar
            mobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
            onSettingsClick={() => {
              setSettingsSection('Profile');
              setCurrentView('settings');
            }}
          />
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Editor
              onOpenSidebar={() => setMobileSidebarOpen(true)}
              onSettingsClick={() => {
                setSettingsSection('Sync & Cloud');
                setCurrentView('settings');
              }}
            />
          </main>
        </>
      ) : (
        <Settings onBack={() => setCurrentView('editor')} initialSection={settingsSection} />
      )}
    </div>
  );
}

export default App;
