const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');
const auth = require('../middleware/auth');

router.post('/', auth, folderController.createFolder);
router.get('/', auth, folderController.getFolders);

module.exports = router;
