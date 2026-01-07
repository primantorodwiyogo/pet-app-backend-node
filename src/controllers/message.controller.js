const db = require('../config/database');

exports.getMessages = async (req, res) => {
    const userId = req.user.id;
    const chatId = req.params.chatId;

    try {
        const [messages] = await db.query(
            `
            SELECT
                m.id,
                m.sender_id,
                m.message,
                m.created_at
            FROM messages m
            JOIN chats c ON c.id = m.chat_id
            WHERE m.chat_id = ?
              AND (c.user1_id = ? OR c.user2_id = ?)
            ORDER BY m.created_at ASC
            `,
            [chatId, userId, userId]
        );

        res.json(messages);
    } catch (err) {
        console.error('GET MESSAGES ERROR:', err.message);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

exports.sendMessage = async (req, res) => {
    const userId = req.user.id;
    const chatId = req.params.chatId;
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'message is required' });
    }

    try {
        await db.query(
            `INSERT INTO messages (chat_id, sender_id, message)
             VALUES (?, ?, ?)`,
            [chatId, userId, message]
        );

        res.status(201).json({ message: 'Message sent' });
    } catch (err) {
        console.error('SEND MESSAGE ERROR:', err.message);
        res.status(500).json({ error: 'Failed to send message' });
    }
};
