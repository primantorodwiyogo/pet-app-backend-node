const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const messageController = require('../controllers/message.controller');

router.get('/messages/:chatId', auth, messageController.getMessages);
router.post('/messages/:chatId', auth, messageController.sendMessage);

module.exports = router;
