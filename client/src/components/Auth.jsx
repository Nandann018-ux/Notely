import { useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import useNoteStore from '../store/useNoteStore';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Auth = () => {
  const [mode, setMode] = useState('login'); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loginSuccess = useAuthStore((s) => s.loginSuccess);
  const continueOffline = useAuthStore((s) => s.continueOffline);
  const fetchNotes = useNoteStore((s) => s.fetchNotes);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload = mode === 'login' ? { email, password } : { name, email, password };
      const { data } = await axios.post(`${API_BASE}${url}`, payload);
      loginSuccess(data.user, data.token);
      await fetchNotes();
    } catch (err) {
      const msg = err.response?.data?.error || 'Unable to reach server. Check your connection or try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-50">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome to Notely</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {mode === 'login'
              ? 'Log in to sync your notes across devices.'
              : 'Create an account to sync and back up your notes.'}
          </p>
        </div>

        <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1 text-xs font-medium">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`px-3 py-1 rounded-md ${
              mode === 'login'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`px-3 py-1 rounded-md ${
              mode === 'register'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Sign up
          </button>
        </div>

        {error && (
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center rounded-lg bg-primary text-white text-sm font-medium py-2.5 hover:opacity-95 disabled:opacity-60 transition-opacity"
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => continueOffline()}
          className="w-full text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mt-2"
        >
          Continue in offline mode
        </button>
      </div>
    </div>
  );
};

export default Auth;

