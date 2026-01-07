const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const chatController = require('../controllers/chat.controller');

router.post('/chats', auth, chatController.createChat);
router.get('/chats', auth, chatController.getChats);

module.exports = router;
