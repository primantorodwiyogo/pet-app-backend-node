const sequelize = require('../config/database');

const { Post, User, PetDetail, ServiceDetail } = require('../models');
const response = require('../utils/response');

exports.getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const { type } = req.query;

        const where = {};
        if (type) where.type = type;

        const { count, rows } = await Post.findAndCountAll({
            where,
            limit,
            offset,
            order: [['created_at', 'DESC']],
            include: [
                { model: User, attributes: ['id', 'name'] },
                { model: PetDetail },
                { model: ServiceDetail }
            ]
        });

        return response.success(res, rows, 'OK', 200, {
            page,
            limit,
            total: count
        });
    } catch (err) {
        console.error(err);
        return response.error(res, 'Failed to fetch posts');
    }
};

exports.createPost = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { type, title, description, location, pet_detail, service_detail } = req.body;

        if (!type || !title) {
            await t.rollback();
            return response.error(res, 'Type and title are required', 400);
        }

        if (!['pet', 'service'].includes(type)) {
            await t.rollback();
            return response.error(res, 'Invalid post type', 400);
        }

        const post = await Post.create(
            {
                user_id: req.user.id,
                type,
                title,
                description,
                location
            },
            { transaction: t }
        );

        if (type === 'pet' && pet_detail) {
            await PetDetail.create(
                {
                    post_id: post.id,
                    ...pet_detail
                },
                { transaction: t }
            );
        }

        if (type === 'service' && service_detail) {
            await ServiceDetail.create(
                {
                    post_id: post.id,
                    ...service_detail
                },
                { transaction: t }
            );
        }

        await t.commit();
        return response.success(res, post, 'Post created', 201);
    } catch (err) {
        await t.rollback();
        console.error(err);
        return response.error(res, 'Failed to create post');
    }
};