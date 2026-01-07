const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const auth = require('../middleware/auth.middleware');

router.post('/posts', auth, postController.createPost);
/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [pet, service]
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               pet_detail:
 *                 type: object
 *               service_detail:
 *                 type: object
 *     responses:
 *       201:
 *         description: Created
 */

router.get('/posts', postController.getAllPosts);
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [pet, service]
 *     responses:
 *       200:
 *         description: Success
 */


module.exports = router;
