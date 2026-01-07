const express = require('express');
const router = express.Router();

// Controllers
const { healthCheck } = require('../controllers/health.controller');
const { dbTest } = require('../controllers/db.controller');
const authController = require('../controllers/auth.controller');

// Middleware
const auth = require('../middleware/auth.middleware');

// Routes modules
const chatRoutes = require('./chat.routes');
const messageRoutes = require('./message.routes');
const postRoutes = require('./post.routes');
const postViewRoutes = require('./postView.routes');

// Health & DB check
router.get('/health', healthCheck);
router.get('/db-test', dbTest);

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', auth, authController.me);

// Other feature routes
router.use(chatRoutes);
router.use(messageRoutes);
router.use(postRoutes);
router.use(postViewRoutes);

module.exports = router;