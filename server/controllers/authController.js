const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_notely_key_123', {
        expiresIn: '30d'
    });
};

exports.register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const user = await User.create({ email, password, name });
        const token = signToken(user._id);

        res.status(201).json({
            user: { id: user._id, email: user.email, name: user.name },
            token
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = signToken(user._id);

        res.json({
            user: { id: user._id, email: user.email, name: user.name },
            token
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
