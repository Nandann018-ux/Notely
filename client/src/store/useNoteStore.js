import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import * as db from '../db'
import { syncWithServer } from '../services/syncService'

const useNoteStore = create((set, get) => ({
    notes: [],
    activeNoteId: null,
    syncStatus: 'synced',

    fetchNotes: async () => {
        const localNotes = await db.getNotes();
        set({ notes: localNotes });

        if (localNotes.some(n => n.syncStatus === 'pending')) {
            set({ syncStatus: 'pending' });
            const success = await syncWithServer();
            if (success) {
                const updatedNotes = await db.getNotes();
                set({ notes: updatedNotes, syncStatus: 'synced' });
            } else {
                set({ syncStatus: 'error' });
            }
        }
    },

    syncNotes: async () => {
        set({ syncStatus: 'pending' });
        const success = await syncWithServer();
        const notes = await db.getNotes();
        set({ notes, syncStatus: success ? 'synced' : 'error' });
        return success;
    },

    addNote: async () => {
        const newNote = {
            _id: uuidv4(),
            id: undefined,
            title: 'New Note',
            content: '',
            tags: [],
            lastModified: Date.now(),
            createdAt: Date.now(),
            syncStatus: 'pending'
        };

        newNote.id = newNote._id;

        set((state) => ({
            notes: [newNote, ...state.notes],
            activeNoteId: newNote._id,
            syncStatus: 'pending'
        }));

        await db.saveNote(newNote);
        get().triggerSync();
    },

    updateNote: async (id, updates) => {
        const note = get().notes.find(n => n._id === id);
        if (!note) return;

        const updatedNote = {
            ...note,
            ...updates,
            lastModified: Date.now(),
            syncStatus: 'pending'
        };

        set((state) => ({
            notes: state.notes.map(n => n._id === id ? updatedNote : n),
            syncStatus: 'pending'
        }));

        await db.saveNote(updatedNote);
        get().triggerSync();
    },

    deleteNote: async (id) => {
        set((state) => ({
            notes: state.notes.filter(n => n._id !== id),
            activeNoteId: state.activeNoteId === id ? null : state.activeNoteId,
            syncStatus: 'pending'
        }));

        await db.deleteNote(id);
        get().triggerSync();
    },

    setActiveNote: (id) => set({ activeNoteId: id }),

    triggerSync: (() => {
        let timeout;
        return () => {
            clearTimeout(timeout);
            timeout = setTimeout(async () => {
                const success = await syncWithServer();
                if (success) {
                    const updatedNotes = await db.getNotes();
                    set({ notes: updatedNotes, syncStatus: 'synced' });
                } else {
                    set({ syncStatus: 'error' });
                }
            }, 3000); 
        };
    })(),
}));


if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
        useNoteStore.getState().triggerSync();
    });
}

export default useNoteStore;
