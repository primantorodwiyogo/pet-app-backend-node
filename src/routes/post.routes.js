const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const postController = require('../controllers/post.controller');

router.post(
    '/posts',
    auth,
    upload.array('images', 5), // ⬅️ INI WAJIB
    postController.createPost
);

module.exports = router;
