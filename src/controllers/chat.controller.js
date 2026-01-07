const db = require('../config/database');

// Create or get chat
exports.createChat = async (req, res) => {
    const userId = req.user.id;
    const { other_user_id } = req.body;

    if (!other_user_id) {
        return res.status(400).json({ error: 'other_user_id is required' });
    }

    const user1 = Math.min(userId, other_user_id);
    const user2 = Math.max(userId, other_user_id);

    try {
        const [existing] = await db.query(
            `SELECT * FROM chats WHERE user1_id = ? AND user2_id = ?`,
            [user1, user2]
        );

        if (existing.length) {
            return res.json(existing[0]);
        }

        const [result] = await db.query(
            `INSERT INTO chats (user1_id, user2_id) VALUES (?, ?)`,
            [user1, user2]
        );

        res.status(201).json({
            id: result.insertId,
            user1_id: user1,
            user2_id: user2
        });

    } catch (err) {
        console.error('CREATE CHAT ERROR:', err.message);
        res.status(500).json({ error: 'Failed to create chat' });
    }
};

// List chats
exports.getChats = async (req, res) => {
    const userId = req.user.id;

    try {
        const [rows] = await db.query(
            `
            SELECT
                c.id,
                u.id AS other_user_id,
                u.name AS other_user_name,
                (
                    SELECT message
                    FROM messages
                    WHERE chat_id = c.id
                    ORDER BY created_at DESC
                    LIMIT 1
                ) AS last_message
            FROM chats c
            JOIN users u
              ON u.id = IF(c.user1_id = ?, c.user2_id, c.user1_id)
            WHERE c.user1_id = ? OR c.user2_id = ?
            ORDER BY c.created_at DESC
            `,
            [userId, userId, userId]
        );

        res.json(rows);
    } catch (err) {
        console.error('GET CHATS ERROR:', err.message);
        res.status(500).json({ error: 'Failed to fetch chats' });
    }
};
