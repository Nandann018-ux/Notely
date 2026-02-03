const Folder = require('../models/Folder');

exports.createFolder = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user._id;

        if (!name) {
            return res.status(400).json({ error: 'Folder name is required' });
        }

        const folder = new Folder({
            name,
            user: userId
        });

        await folder.save();
        res.status(201).json(folder);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: 'Folder with this name already exists' });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.getFolders = async (req, res) => {
    try {
        const userId = req.user.id;
        const folders = await Folder.find({ user: userId }).sort({ name: 1 });
        res.json(folders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
