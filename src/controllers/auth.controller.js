const User = require('../models/user.model');
const response = require('../utils/response');
const {
    generateAccessToken,
    generateRefreshToken
} = require('../utils/jwt');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return response.error(res, 'User not found', 404);
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return response.error(res, 'Invalid credentials', 401);
        }

        const payload = { id: user.id };

        return response.success(res, {
            accessToken: generateAccessToken(payload),
            refreshToken: generateRefreshToken(payload),
            expiresIn: 3600,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        }, 'Login success');
    } catch (err) {
        return response.error(res, err.message, 500);
    }
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const exists = await User.findOne({ where: { email } });
        if (exists) {
            return response.error(res, 'Email already registered', 400);
        }

        const user = await User.create({
            name,
            email,
            password_hash: password,
            phone
        });

        return response.success(res, {
            id: user.id,
            email: user.email
        }, 'Register success', 201);
    } catch (err) {
        return response.error(res, err.message, 500);
    }
};
