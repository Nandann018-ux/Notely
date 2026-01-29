import { useState, useEffect } from 'react';
import {
    X, Settings as SettingsIcon, Cloud, Palette, Cpu,
    User, Shield, Laptop, Monitor, Moon, Sun,
    ChevronRight, Check, Search, Bell, History,
    Database, Globe, Keyboard, Zap, Smartphone,
    ExternalLink, LogOut, Trash2, Save, RotateCcw
} from 'lucide-react';
import useThemeStore from '../store/useThemeStore';
import useNoteStore from '../store/useNoteStore';
import useAuthStore from '../store/useAuthStore';

const Settings = ({ onBack, initialSection = 'Sync & Cloud' }) => {
    const { theme, setTheme } = useThemeStore();
    const { syncStatus, syncNotes, notes } = useNoteStore();
    const { user, logout } = useAuthStore();
    const [activeSection, setActiveSection] = useState(initialSection);
    const [searchQuery, setSearchQuery] = useState('');
    const [avatarPreview, setAvatarPreview] = useState(null);

    useEffect(() => {
        setActiveSection(initialSection);
    }, [initialSection]);

    const sections = [
        { id: 'General', icon: SettingsIcon, description: 'Basic application preferences' },
        { id: 'Sync & Cloud', icon: Cloud, description: 'Cloud synchronization and providers' },
        { id: 'Appearance', icon: Palette, description: 'Themes, fonts, and dark mode' },
        { id: 'Editor', icon: Cpu, description: 'Text editor behavior and shortcuts' },
        { id: 'AI Integration', icon: Zap, description: 'Language model settings' },
        { id: 'Profile', icon: User, description: 'Account information' },
        { id: 'Privacy', icon: Shield, description: 'Security and data protection' },
    ];

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'Sync & Cloud':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Sync & Cloud</h2>
                            <p className="text-slate-500 dark:text-slate-400">Keep your notes updated across all your devices with end-to-end encrypted synchronization.</p>
                        </div>

                        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 transition-all hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">Enable Cloud Sync</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Automatically backup and sync your notes to the cloud.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Select Provider</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { name: 'Dropbox', icon: Cloud, selected: false },
                                    { name: 'Google Drive', icon: Globe, selected: true },
                                    { name: 'Custom S3', icon: Database, selected: false }
                                ].map((provider) => (
                                    <button
                                        key={provider.name}
                                        className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all ${provider.selected
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                            }`}
                                    >
                                        <provider.icon className="w-8 h-8 mb-3" />
                                        <span className="font-medium">{provider.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                <div className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 animate-spin-slow">
                                    <RotateCcw className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-slate-100">Last Synced Status</p>
                                    <p>Successfully synced 2 minutes ago</p>
                                </div>
                            </div>
                            <button
                                onClick={() => syncNotes()}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                            >
                                <RotateCcw className={`w-4 h-4 ${syncStatus === 'pending' ? 'animate-spin' : ''}`} />
                                Sync Now
                            </button>
                        </div>
                    </div>
                );
            case 'Appearance':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Appearance</h2>
                            <p className="text-slate-500 dark:text-slate-400">Customize how Notely looks and feels to suit your preference.</p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Color Theme</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { name: 'Light', value: 'light', icon: Sun },
                                    { name: 'Dark', value: 'dark', icon: Moon },
                                    { name: 'System', value: 'system', icon: Laptop }
                                ].map((t) => (
                                    <button
                                        key={t.value}
                                        onClick={() => setTheme(t.value)}
                                        className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all ${theme === t.value
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                            }`}
                                    >
                                        <t.icon className="w-6 h-6 mb-3" />
                                        <span className="font-medium">{t.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Font Size</h3>
                            <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs">Aa (Small)</span>
                                    <span className="text-lg">Aa (Large)</span>
                                </div>
                                <input
                                    type="range"
                                    min="12"
                                    max="24"
                                    defaultValue="16"
                                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <div className="mt-4 p-4 rounded bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center">
                                    <p className="text-sm opacity-70 italic">The quick brown fox jumps over the lazy dog.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Profile': {
                const totalNotes = (notes || []).filter((n) => !n.isDeleted).length;
                const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'Notely User');
                const initials = (displayName || 'U')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase();

                const handleAvatarChange = (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    setAvatarPreview(url);
                };

                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Profile</h2>
                            <p className="text-slate-500 dark:text-slate-400">
                                Manage your account details, profile picture, and connected accounts.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 flex gap-6 items-center">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-100 font-semibold text-lg overflow-hidden">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                                    ) : (
                                        initials
                                    )}
                                </div>
                                <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-[10px] cursor-pointer shadow">
                                    <span>✎</span>
                                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                                </label>
                            </div>
                            <div className="flex-1 space-y-2">
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{displayName}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email || 'Offline user'}</p>
                                </div>
                                <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-400">
                                    <span>{totalNotes} saved notes</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 space-y-4">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Account details</h3>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Name</p>
                                        <p className="mt-0.5 text-slate-800 dark:text-slate-100">{displayName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                                        <p className="mt-0.5 text-slate-800 dark:text-slate-100">{user?.email || 'Offline user'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 space-y-4">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Connected accounts</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Connect your Google account to use single sign‑on and quickly switch between workspaces.
                                </p>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <Globe className="w-4 h-4" />
                                    Connect Google
                                </button>
                                <p className="text-[10px] text-slate-400">
                                    We never store your Google password. You can disconnect at any time from your Google account settings.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                Signed in as <span className="font-medium text-slate-900 dark:text-slate-100">{displayName}</span>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        logout();
                                        onBack();
                                    }}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 dark:border-red-800 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                );
            }
            case 'AI Integration':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">AI Integration</h2>
                            <p className="text-slate-500 dark:text-slate-400">Configure Large Language Model providers for smart summaries and note organization.</p>
                        </div>

                        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                                <h3 className="font-semibold mb-1">OpenAI API Key</h3>
                                <div className="relative">
                                    <input
                                        type="password"
                                        defaultValue="sk-.........................................."
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                                    />
                                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                        <Monitor className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-[10px] mt-2 text-slate-400 italic">Your keys are stored locally and never touch our servers.</p>
                            </div>
                            <div className="p-6 bg-slate-50/50 dark:bg-slate-900/20">
                                <h3 className="font-semibold mb-4 text-sm">Active Models</h3>
                                <div className="space-y-3">
                                    {['Summarization (GPT-4o mini)', 'Tag Suggestion (GPT-4o)', 'Title Generation (GPT-3.5 Turbo)'].map((model, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                            <Check className="w-4 h-4 text-emerald-500" />
                                            {model}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default: {
                const sectionMeta = sections.find((s) => s.id === activeSection);
                const Icon = sectionMeta?.icon || SettingsIcon;

                return (
                    <div className="flex flex-col items-center justify-center h-full py-20 text-center space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                            <Icon className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">{activeSection}</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-xs">
                                Settings for {activeSection} are coming soon in this version of Notely.
                            </p>
                        </div>
                    </div>
                );
            }
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#0f172a] overflow-hidden lg:rounded-2xl lg:m-4 lg:shadow-2xl border-l lg:border border-slate-200 dark:border-slate-800 animate-in fade-in duration-500">
            <header className="h-16 shrink-0 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                            <SettingsIcon className="w-4 h-4 text-primary" />
                        </div>
                        <h1 className="text-lg font-bold tracking-tight">Settings</h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 overflow-y-auto">
                    <div className="p-4 space-y-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search settings..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-3 px-2">System</h3>
                                <div className="space-y-1">
                                    {sections.slice(0, 5).map((section) => (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group ${activeSection === section.id
                                                    ? 'bg-primary text-white shadow-md'
                                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                                                }`}
                                        >
                                            <section.icon className={`w-4 h-4 ${activeSection === section.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100'}`} />
                                            {section.id}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-3 px-2">Account</h3>
                                <div className="space-y-1">
                                    {sections.slice(5).map((section) => (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group ${activeSection === section.id
                                                    ? 'bg-primary text-white shadow-md'
                                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                                                }`}
                                        >
                                            <section.icon className={`w-4 h-4 ${activeSection === section.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100'}`} />
                                            {section.id}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-20">
                            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all">
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900/20">
                    <div className="max-w-2xl mx-auto py-12 px-8">
                        {renderSectionContent()}
                    </div>
                </main>
            </div>

            <footer className="h-10 shrink-0 border-t border-slate-100 dark:border-slate-800 px-6 flex items-center justify-between text-[10px] text-slate-400 bg-slate-50/30 dark:bg-slate-900/30">
                <div>&copy; 2024 Notely Inc. v2.4.0-stable</div>
                <div className="flex items-center gap-4">
                    <a href="#" className="hover:text-slate-600 dark:hover:text-slate-200">Release Notes</a>
                    <a href="#" className="hover:text-slate-600 dark:hover:text-slate-200">Documentation</a>
                </div>
            </footer>
        </div>
    );
};

export default Settings;
