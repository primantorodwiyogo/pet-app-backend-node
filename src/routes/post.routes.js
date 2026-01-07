const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const postController = require('../controllers/post.controller');

router.get('/posts', postController.getPosts);
router.get('/posts/mine', auth, postController.getMyPosts);
router.get('/posts/:id', postController.getPostById);


router.post(
    '/posts',
    auth,
    upload.array('images', 5), // ⬅️ INI WAJIB
    postController.createPost
);

module.exports = router;
