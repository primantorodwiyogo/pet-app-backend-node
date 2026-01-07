const db = require('../config/database');

exports.addPostView = async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.postId;

    try {
        await db.query(
            `
            INSERT IGNORE INTO post_views (post_id, user_id)
            VALUES (?, ?)
            `,
            [postId, userId]
        );

        res.json({ message: 'View recorded' });
    } catch (err) {
        console.error('ADD POST VIEW ERROR:', err.message);
        res.status(500).json({ error: 'Failed to record view' });
    }
};
