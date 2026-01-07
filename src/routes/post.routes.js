const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const auth = require('../middleware/auth.middleware');

router.post('/posts', auth, postController.createPost);
router.get('/posts', postController.getAllPosts);

module.exports = router;
