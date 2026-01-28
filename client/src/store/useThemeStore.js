import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const getSystemTheme = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export default create(
    persist(
        (set, get) => ({
            theme: 'light',
            effectiveTheme: 'light',

            setTheme: (theme) => {
                const effective = theme === 'system' ? getSystemTheme() : theme;
                set({ theme, effectiveTheme: effective });
                if (typeof document !== 'undefined') {
                    document.documentElement.classList.toggle('dark', effective === 'dark');
                }
            },

            init: () => {
                const { theme } = get();
                const effective = theme === 'system' ? getSystemTheme() : theme;
                document.documentElement.classList.toggle('dark', effective === 'dark');
                set({ effectiveTheme: effective });
            },
        }),
        { name: 'notely-theme' }
    )
);
