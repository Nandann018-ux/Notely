import { Cloud, CloudOff, Loader2, Sparkles, Share2, Download, Settings, Menu } from 'lucide-react';
import useNoteStore from '../store/useNoteStore';

function SyncStatusBadge() {
  const { syncStatus, syncNotes } = useNoteStore();

  if (syncStatus === 'synced') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
        <Cloud className="w-4 h-4" />
        <span>Saved locally</span>
      </div>
    );
  }
  if (syncStatus === 'pending') {
    return (
      <button
        onClick={() => syncNotes()}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-sm font-medium hover:bg-amber-500/25 transition-colors"
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Syncing…</span>
      </button>
    );
  }
  return (
    <button
      onClick={() => syncNotes()}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-500/25 transition-colors"
    >
      <CloudOff className="w-4 h-4" />
      <span>Sync failed</span>
    </button>
  );
}

const TopBar = ({ breadcrumbs, onAiClick, aiLoading, onOpenSidebar, onSettingsClick }) => {
  return (
    <header className="h-14 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-black flex items-center justify-between px-4 lg:px-6 gap-4">
      <div className="min-w-0 flex-1 flex items-center gap-3">
        {onOpenSidebar && (
          <button
            onClick={onOpenSidebar}
            className="md:hidden p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        {breadcrumbs && (
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
            {breadcrumbs}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <SyncStatusBadge />
        <button
          onClick={onAiClick}
          disabled={aiLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-95 disabled:opacity-70 transition-opacity"
        >
          <Sparkles className="w-4 h-4" />
          AI Assist
        </button>
        <button
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          title="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>
        <button
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          title="Download"
        >
          <Download className="w-4 h-4" />
        </button>
        <button
          onClick={onSettingsClick}
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default TopBar;