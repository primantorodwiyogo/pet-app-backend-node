exports.healthCheck = (req, res) => {
    res.json({
        status: 'OK',
        service: 'pet-app-backend-node',
        timestamp: new Date(),
    });
};