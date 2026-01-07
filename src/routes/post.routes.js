const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');

router.get('/posts', postController.getAllPosts);

module.exports = router;
