const express = require('express');
const router = express.Router();


const { healthCheck } = require('../controllers/health.controller');
const { dbTest } = require('../controllers/db.controller');
const auth = require('../middleware/auth.middleware');
const authController = require('../controllers/auth.controller');


router.get('/health', healthCheck);
router.get('/db-test', dbTest);


router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', auth, authController.me);

const postRoutes = require('./post.routes');

router.use(postRoutes);

module.exports = router;