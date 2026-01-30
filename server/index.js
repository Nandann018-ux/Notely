require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authController = require('./controllers/authController');
const noteController = require('./controllers/noteController');
const aiController = require('./controllers/aiController');
const auth = require('./middleware/auth');

const app = express()
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/notely';

app.use(cors());
app.use(express.json());

app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);

app.post('/api/notes/sync', auth, noteController.syncNotes);

app.get('/api/notes', auth, noteController.getNotes);

app.post('/api/ai/summarize', auth, aiController.summarize);
app.post('/api/ai/generate-title', auth, aiController.generateTitle);
app.post('/api/ai/suggest-tags', auth, aiController.suggestTags);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

console.log("Loaded Mongo URI:", process.env.MONGODB_URI);

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error('MongoDB Connection Error:', err));
