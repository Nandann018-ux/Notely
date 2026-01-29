const Note = require('../models/Note');

exports.syncNotes = async (req, res) => {
    try {
        const { notes } = req.body;
        if (!notes || !Array.isArray(notes)) {
            return res.status(400).json({ error: 'Invalid notes data' });
        }

        const userId = req.user._id;

        const operations = notes.map(note => ({
            updateOne: {
                filter: {
                    id: note.id,
                    userId: userId 
                },
                update: {
                    $set: {
                        title: note.title,
                        content: note.content,
                        tags: note.tags,
                        lastModified: note.lastModified,
                        isDeleted: note.isDeleted,
                        userId: userId,
                        id: note.id
                    }
                },
                upsert: true
            }
        }));

        const fancyOperations = notes.map(note => ({
            updateOne: {
                filter: { id: note.id, userId: userId },
                update: [
                    {
                        $set: {
                            title: { $cond: [{ $gt: [note.lastModified, { $ifNull: ["$lastModified", 0] }] }, note.title, "$title"] },
                            content: { $cond: [{ $gt: [note.lastModified, { $ifNull: ["$lastModified", 0] }] }, note.content, "$content"] },
                            tags: { $cond: [{ $gt: [note.lastModified, { $ifNull: ["$lastModified", 0] }] }, note.tags, "$tags"] },
                            isDeleted: { $cond: [{ $gt: [note.lastModified, { $ifNull: ["$lastModified", 0] }] }, note.isDeleted, "$isDeleted"] },
                            lastModified: { $max: [note.lastModified, { $ifNull: ["$lastModified", 0] }] },
                            userId: userId,
                            id: note.id
                        }
                    }
                ],
                upsert: true
            }
        }));

        const result = await Note.bulkWrite(fancyOperations);
        const allNotes = await Note.find({ userId, isDeleted: false });

        res.status(200).json({
            message: 'Sync successful',
            notes: allNotes
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: 'Sync conflict, please retry' });
        }
        console.error('Sync Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user._id, isDeleted: false });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
