import { useState, useRef, useEffect } from 'react';
import useNoteStore from '../store/useNoteStore';
import TopBar from './TopBar';
import AISummaryModal from './AISummaryModal';
import { FileText, Tag, Pin, Menu, Settings, Sparkles } from 'lucide-react';
import axios from 'axios';
import { getAuthToken } from '../store/useAuthStore';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Editor = ({ onOpenSidebar, onSettingsClick }) => {
  const { activeNoteId, notes, updateNote } = useNoteStore();
  const activeNote = notes.find((n) => n._id === activeNoteId);

  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setAiMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAiAction = async (type) => {
    setAiMenuOpen(false);
    const token = getAuthToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    if (type === 'summarize') {
      setAiModalOpen(true);
      setAiLoading(true);
      setAiSummary(null);
      try {
        const { data } = await axios.post(
          `${API_BASE}/api/ai/summarize`,
          { content: activeNote?.content ?? '' },
          { headers }
        );
        setAiSummary(data.summary ?? data.content ?? '');
      } catch (err) {
        console.error('AI summarize failed', err);
        setAiSummary('Summary could not be generated. Try again when online.');
      } finally {
        setAiLoading(false);
      }
    } else if (type === 'title') {
      setAiLoading(true);
      try {
        const { data } = await axios.post(
          `${API_BASE}/api/ai/generate-title`,
          { content: activeNote?.content ?? '' },
          { headers }
        );
        if (data?.title) updateNote(activeNoteId, { title: data.title });
      } catch (err) {
        console.error('AI title failed', err);
      } finally {
        setAiLoading(false);
      }
    } else if (type === 'tags') {
      setAiLoading(true);
      try {
        const { data } = await axios.post(
          `${API_BASE}/api/ai/suggest-tags`,
          { content: activeNote?.content ?? '' },
          { headers }
        );
        const newTags = data?.tags ?? [];
        const current = activeNote?.tags ?? [];
        updateNote(activeNoteId, { tags: [...new Set([...current, ...newTags])] });
      } catch (err) {
        console.error('AI tags failed', err);
      } finally {
        setAiLoading(false);
      }
    }
  };

  const copySummaryToNote = () => {
    if (!activeNoteId || !aiSummary) return;
    const block = `\n\n---\n> **AI Summary**\n> ${String(aiSummary).replace(/\n/g, '\n> ')}\n`;
    updateNote(activeNoteId, { content: (activeNote?.content ?? '') + block });
    setAiSummary(null);
    setAiModalOpen(false);
  };

  if (!activeNote) {
    return (
      <div className="flex-1 flex flex-col min-w-0 h-full bg-slate-50 dark:bg-black">
        <header className="h-14 shrink-0 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 bg-white dark:bg-black">
          <div className="flex items-center gap-3">
            {onOpenSidebar && (
              <button
                onClick={onOpenSidebar}
                className="md:hidden p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <span className="text-sm font-medium text-slate-400">Notely</span>
          </div>
          <button
            onClick={onSettingsClick}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
          <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-neutral-900 flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 opacity-50" />
          </div>
          <p className="text-sm font-medium">Select a note or create a new one</p>
        </div>
      </div>
    );
  }

  const breadcrumbs = 'Work / ' + (activeNote.title || 'Untitled');
  const lines = (activeNote.content ?? '').split('\n');
  const lineCount = lines.length;
  const colCount = (lines[lineCount - 1] ?? '').length + 1;
  const wordCount = (activeNote.content ?? '').split(/\s+/).filter(Boolean).length;

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full bg-slate-50 dark:bg-black relative">
      <TopBar
        breadcrumbs={breadcrumbs}
        onAiClick={() => setAiMenuOpen((v) => !v)}
        aiLoading={aiLoading}
        onOpenSidebar={onOpenSidebar}
        onSettingsClick={onSettingsClick}
      />


      {aiMenuOpen && (
        <div
          ref={menuRef}
          className="absolute top-[3.5rem] right-4 lg:right-6 z-50 w-64 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl overflow-hidden py-1"
        >
          <button
            onClick={() => handleAiAction('summarize')}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <FileText className="w-4 h-4" />
            </span>
            <div className="text-left">
              <p className="font-medium">Summarize</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Create a brief overview</p>
            </div>
          </button>
          <button
            onClick={() => handleAiAction('title')}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-sm">
              T
            </span>
            <div className="text-left">
              <p className="font-medium">Generate Title</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Based on content</p>
            </div>
          </button>
          <button
            onClick={() => handleAiAction('tags')}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Tag className="w-4 h-4" />
            </span>
            <div className="text-left">
              <p className="font-medium">Suggest Tags</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Auto-categorize note</p>
            </div>
          </button>
        </div>
      )}

      <div className="flex-1 flex min-h-0">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500">
            {new Date(activeNote.lastModified || Date.now()).toLocaleString()}
          </div>
          <textarea
            value={activeNote.content ?? ''}
            onChange={(e) => updateNote(activeNoteId, { content: e.target.value })}
            className="flex-1 w-full min-h-0 p-4 resize-none bg-transparent font-mono text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none leading-relaxed"
            placeholder="Start writing in Markdown…"
            spellCheck={false}
          />
        </div>
      </div>

      <footer className="h-12 shrink-0 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-6 bg-white dark:bg-[#0f172a]">
        <div className="flex items-center gap-3">
          <button className="p-1.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" title="Pin">
            <Pin className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 flex-wrap">
            {(activeNote.tags ?? []).map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs"
              >
                #{t}
                <button
                  onClick={() => updateNote(activeNoteId, { tags: (activeNote.tags ?? []).filter((x) => x !== t) })}
                  className="hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
            <button className="px-2.5 py-0.5 rounded-md border border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 text-xs hover:border-slate-400 dark:hover:border-slate-500 transition-colors">
              + Add tag
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span>Ln {lineCount}, Col {colCount}</span>
          <span>{wordCount} words</span>
          <span>Markdown</span>
        </div>
      </footer>

      <button
        type="button"
        onClick={() => setAiMenuOpen((v) => !v)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground w-11 h-11 shadow-lg hover:opacity-90 transition-opacity"
        aria-label="AI Assist"
      >
        <Sparkles className="w-5 h-5" />
      </button>

      <AISummaryModal
        open={aiModalOpen}
        onClose={() => { setAiModalOpen(false); setAiSummary(null); }}
        noteTitle={activeNote.title}
        summary={aiSummary}
        onCopyToNote={copySummaryToNote}
        loading={aiLoading}
      />
    </div>
  );
};

export default Editor;
