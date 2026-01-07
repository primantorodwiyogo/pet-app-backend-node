const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const postViewController = require('../controllers/postView.controller');

router.post(
    '/posts/:postId/view',
    auth,
    postViewController.addPostView
);

module.exports = router;
