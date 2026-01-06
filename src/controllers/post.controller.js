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
