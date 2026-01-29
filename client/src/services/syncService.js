import axios from 'axios';
import { getPendingNotes, saveNote } from '../db';
import { getAuthToken } from '../store/useAuthStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const syncWithServer = async () => {
  try {
    const token = getAuthToken();
    if (!token) return false;

    const pendingNotes = await getPendingNotes();
    if (pendingNotes.length === 0) return true;

    const payloadNotes = pendingNotes.map((note) => ({
      ...note,
      id: note.id || note._id,
    }));

    const response = await axios.post(
      `${API_URL}/notes/sync`,
      { notes: payloadNotes },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      const { notes: updatedNotes } = response.data;
      for (const note of updatedNotes) {
        const localNote = {...note,
          _id: note.id,
          id: note.id,
          syncStatus:'synced',
        };
        await saveNote(localNote);
      }
      return true;
    }
  } catch (error) {
    console.error('Sync failed:', error);
    return false;
  }
};
