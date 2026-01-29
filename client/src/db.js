import { openDB } from 'idb';

const DB_NAME = 'notely_db';
const DB_VERSION = 1;

export const initDB = async () => {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('notes')) {
                const store = db.createObjectStore('notes', { keyPath: '_id' });
                store.createIndex('syncStatus', 'syncStatus');
            }
        },
    });
};

export const getNotes = async () => {
    const db = await initDB();
    return db.getAll('notes');
};

export const saveNote = async (note) => {
    const db = await initDB();
    await db.put('notes', note);
    return note;
};

export const deleteNote = async (id) => {
    const db = await initDB();
    await db.delete('notes', id);
};

export const getPendingNotes = async () => {
    const db = await initDB();
    const notes = await db.getAllFromIndex('notes', 'syncStatus', 'pending');
    return notes;
};
