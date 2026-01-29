import { useState } from 'react';
import useNoteStore from '../store/useNoteStore';
import useThemeStore from '../store/useThemeStore';
import useAuthStore from '../store/useAuthStore';
import { Plus, FileText, Star, FolderOpen, Trash2, Share2, Cloud, CloudOff, Settings, Sun, Moon } from 'lucide-react';

const FOLDERS = [{ id: 'default', label: 'Default' }];

function SyncIcon({ status }) {
  if (status === 'error'){
    return <CloudOff className="w-3.5 h-3.5 text-red-500 shrink-0" />;
  }
  if (status === 'pending'){
    return <Cloud className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />;
  }
  return <Cloud className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
}

const Sidebar = ({ mobileOpen, onCloseMobile, onSettingsClick }) => {
  const { notes, activeNoteId, setActiveNote, addNote, updateNote } = useNoteStore();
  const isDark = useThemeStore((s) => s.effectiveTheme === 'dark');
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const { user, token, logout } = useAuthStore();

  const [filter, setFilter] = useState('all');

  const cycleTheme = () => {
    const next = { light: 'dark', dark: 'system', system: 'light' }[theme] || 'dark';
    setTheme(next);
  };

  const handleNoteClick = (id) => {
    setActiveNote(id);
    onCloseMobile?.();
  };

  const formatDate = (ms) => {
    const d = new Date(ms);
    const now = new Date();
    const diff = now - d;
    if (diff < 60_000) return 'Just now';
    if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m`;
    if (diff < 86400_000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const snippet = (text, max = 60) => {
    if (!text?.trim()) return 'Start taking notes...';
    const t = text.replace(/\s+/g, ' ').trim();
    return t.length <= max ? t : t.slice(0, max) + '…';
  };

  const filteredNotes = notes.filter((note) => {
    const tags = note.tags || [];
    const isDeleted = note.isDeleted;
    if (filter === 'trash') return isDeleted;
    if (isDeleted) return false;
    if (filter === 'favorites') return tags.includes('favorite');
    if (filter === 'shared') return tags.includes('shared');
    return true;
  });

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
          aria-hidden
        />
      )}
      <aside
        className={`
          w-[280px] lg:w-[260px] h-full flex flex-col shrink-0 border-r transition-theme
          bg-slate-50 dark:bg-black border-slate-200 dark:border-slate-800
          fixed md:relative inset-y-0 left-0 z-50 md:z-auto
          transform transition-transform duration-200 ease-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-4 lg:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-slate-900 dark:text-white tracking-tight block">Notely</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">v2.4.0</span>
            </div>
          </div>
          <button
            onClick={cycleTheme}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors shrink-0"
            title={theme === 'light' ? 'Dark mode' : theme === 'dark' ? 'System' : 'Light mode'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <nav className="p-2 flex-1 overflow-y-auto custom-scrollbar">
          <button
            onClick={() => setFilter('all')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-slate-900/5 dark:bg-white/5 text-slate-900 dark:text-white'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            All Notes
          </button>
          <button
            onClick={() => setFilter('favorites')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-colors ${
              filter === 'favorites'
                ? 'bg-slate-900/5 dark:bg-white/5 text-slate-900 dark:text-white'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
            }`}
          >
            <Star className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            Favorites
          </button>
          <button
            onClick={() => setFilter('shared')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-colors ${
              filter === 'shared'
                ? 'bg-slate-900/5 dark:bg-white/5 text-slate-900 dark:text-white'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
            }`}
          >
            <Share2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            Shared
          </button>
          <button
            onClick={() => setFilter('trash')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-colors ${
              filter === 'trash'
                ? 'bg-slate-900/5 dark:bg-white/5 text-slate-900 dark:text-white'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
            }`}
          >
            <Trash2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            Trash
          </button>

          <div className="pt-2 pb-1 px-3 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Folders
            </span>
            <button
              type="button"
              className="text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 text-xs font-semibold px-1"
              onClick={() => {
                const baseName = 'New Folder';
                let name = window.prompt('Folder name', baseName) || baseName;
                let suffix = 1;
                const existingNames = FOLDERS.map((f) => f.label.toLowerCase());
                while (existingNames.includes(name.toLowerCase())) {
                  name = `${baseName} (${suffix++})`;
                }
                alert(`Folder \"${name}\" will appear once folder persistence is implemented.`);
              }}
            >
              +
            </button>
          </div>
          {FOLDERS.map((f) => (
            <button
              key={f.id}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-colors
              ${
                f.id === 'default'
                  ? 'bg-slate-900/5 dark:bg-white/5 text-slate-900 dark:text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <FolderOpen className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" />
              {f.label}
            </button>
          ))}

          <div className="pt-4 space-y-1">
            {filteredNotes.map((note) => {
              const isActive = activeNoteId === note._id;
              return (
                <button
                  key={note._id}
                  onClick={() => handleNoteClick(note._id)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    const updatedTags = Array.isArray(note.tags) ? note.tags.slice() : [];
                    if (updatedTags.includes('favorite')) {
                      const nextTags = updatedTags.filter((t) => t !== 'favorite');
                      updateNote(note._id, { tags: nextTags });
                    } else {
                      updateNote(note._id, { tags: [...updatedTags, 'favorite'] });
                    }
                  }}
                  className={`
                  w-full text-left px-3 py-3 rounded-xl transition-all border
                  ${isActive
                      ? 'bg-primary/10 dark:bg-primary/20 border-primary/30 dark:border-primary/40 shadow-sm'
                      : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }
                `}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-semibold text-sm truncate flex-1 ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                      {note.title || 'Untitled'}
                    </h3>
                    <SyncIcon status={note.syncStatus} />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {snippet(note.content)}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-wide">
                    {formatDate(note.lastModified)}
                  </p>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <button
            onClick={addNote}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all shadow-lg shadow-primary/25"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            New Note
          </button>
          <div className="flex items-center justify-between pt-2">
            {token ? (
              <>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 text-xs font-bold ring-2 ring-white dark:ring-slate-900 shadow-sm">
                    {(user?.name || user?.email || 'U')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {user?.name || 'Notely User'}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {user?.email || 'Connected account'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onSettingsClick}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  title="Profile settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-black border border-dashed border-slate-400 flex items-center justify-center text-slate-600 dark:text-slate-100 text-xs font-bold">
                    OFF
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">Offline mode</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      Notes stored on this device
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => logout()}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Sign in
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
