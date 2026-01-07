const db = require('../config/database');

exports.createPost = async (req, res) => {

    const conn = await db.getConnection();

    try {
        await conn.beginTransaction();

        const userId = req.user.id;
        const { type, title, description, location } = req.body;

        if (!type || !title) {
            await conn.rollback();
            return res.status(400).json({ error: 'type and title are required' });
        }

        if (!['pet', 'service'].includes(type)) {
            await conn.rollback();
            return res.status(400).json({ error: 'invalid post type' });
        }

        const [postResult] = await conn.query(
            `INSERT INTO posts (user_id, type, title, description, location)
             VALUES (?, ?, ?, ?, ?)`,
            [userId, type, title, description || null, location || null]
        );

        const postId = postResult.insertId;

        if (type === 'pet') {
            const { species, breed, age, gender, is_vaccinated } = req.body;

            await conn.query(
                `INSERT INTO pet_details
                 (post_id, species, breed, age, gender, is_vaccinated)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    postId,
                    species || null,
                    breed || null,
                    age || null,
                    gender || null,
                    is_vaccinated === true || is_vaccinated === 'true'
                ]
            );
        }

        if (type === 'service') {
            const { service_type, price, duration, description: serviceDescription } = req.body;

            await conn.query(
                `INSERT INTO service_details
                 (post_id, service_type, price, duration, description)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    postId,
                    service_type || null,
                    price ? Number(price) : null,
                    duration || null,
                    serviceDescription || null
                ]
            );
        }

        if (req.files?.length) {
            for (const file of req.files) {
                await conn.query(
                    `INSERT INTO post_images (post_id, image_url)
                     VALUES (?, ?)`,
                    [postId, `/uploads/${file.filename}`]
                );
            }
        }

        await conn.commit();

        return res.status(201).json({
            message: 'Post created successfully',
            post_id: postId
        });

    } catch (err) {
        await conn.rollback();

        return res.status(500).json({
            error: err.sqlMessage || 'Failed to create post'
        });
    } finally {
        conn.release();
    }
};

exports.getPosts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { type, search, location } = req.query;

    try {
        let where = [];
        let params = [];

        if (type) {
            where.push('p.type = ?');
            params.push(type);
        }

        if (search) {
            where.push('(p.title LIKE ? OR p.description LIKE ?)');
            params.push(`%${search}%`, `%${search}%`);
        }

        if (location) {
            where.push('p.location LIKE ?');
            params.push(`%${location}%`);
        }

        const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

        // total posts (bukan views)
        const [countRows] = await db.query(
            `SELECT COUNT(*) AS total FROM posts p ${whereClause}`,
            params
        );

        // data posts + views
        const [rows] = await db.query(
            `
            SELECT
                p.id,
                p.type,
                p.title,
                p.description,
                p.location,
                p.created_at,
                u.name AS user_name,
                (
                    SELECT image_url
                    FROM post_images
                    WHERE post_id = p.id
                    LIMIT 1
                ) AS image,
                COUNT(pv.id) AS views
            FROM posts p
            JOIN users u ON u.id = p.user_id
            LEFT JOIN post_views pv ON pv.post_id = p.id
            ${whereClause}
            GROUP BY p.id, p.type, p.title, p.description, p.location, p.created_at, u.name
            ORDER BY p.created_at DESC
            LIMIT ? OFFSET ?
            `,
            [...params, limit, offset]
        );

        res.json({
            page,
            limit,
            total: countRows[0].total,
            data: rows
        });

    } catch (err) {
        console.error('SEARCH POSTS ERROR:', err.message);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
};


exports.getPostById = async (req, res) => {
    const postId = req.params.id;

    try {
        // 1. ambil post utama
        const [posts] = await db.query(
            `
            SELECT
                p.id,
                p.type,
                p.title,
                p.description,
                p.location,
                p.created_at,
                u.id AS user_id,
                u.name AS user_name,
                u.phone,
                u.avatar_url
            FROM posts p
            JOIN users u ON u.id = p.user_id
            WHERE p.id = ?
            `,
            [postId]
        );

        if (posts.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const post = posts[0];

        // 2. detail berdasarkan type
        let detail = null;

        if (post.type === 'pet') {
            const [rows] = await db.query(
                `SELECT * FROM pet_details WHERE post_id = ?`,
                [postId]
            );
            detail = rows[0] || null;
        }

        if (post.type === 'service') {
            const [rows] = await db.query(
                `SELECT * FROM service_details WHERE post_id = ?`,
                [postId]
            );
            detail = rows[0] || null;
        }

        // 3. images
        const [images] = await db.query(
            `SELECT image_url FROM post_images WHERE post_id = ?`,
            [postId]
        );

        res.json({
            ...post,
            detail,
            images
        });

    } catch (err) {
        console.error('GET POST DETAIL ERROR:', err.message);
        res.status(500).json({
            error: 'Failed to fetch post detail'
        });
    }
};

// src/controllers/post.controllers.js

exports.getMyPosts = async (req, res) => {
    const userId = req.user.id; // dari middleware auth
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        // hitung total
        const [countRows] = await db.query(
            `SELECT COUNT(*) AS total FROM posts WHERE user_id = ?`,
            [userId]
        );

        // ambil data posts user
        const [rows] = await db.query(
            `
      SELECT
        p.id,
        p.type,
        p.title,
        p.description,
        p.location,
        p.created_at,
        (SELECT image_url FROM post_images WHERE post_id = p.id LIMIT 1) AS image,
        COUNT(pv.id) AS views
      FROM posts p
      LEFT JOIN post_views pv ON pv.post_id = p.id
      WHERE p.user_id = ?
      GROUP BY p.id, p.type, p.title, p.description, p.location, p.created_at
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
      `,
            [userId, limit, offset]
        );

        res.json({
            page,
            limit,
            total: countRows[0].total,
            data: rows,
        });
    } catch (err) {
        console.error("GET MY POSTS ERROR:", err.message);
        res.status(500).json({ error: "Failed to fetch my posts" });
    }
};