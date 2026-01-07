const sequelize = require('../config/database');

const { Post, User, PetDetail, ServiceDetail } = require('../models');
const response = require('../utils/response');

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            order: [['created_at', 'DESC']],
            include: [
                {
                    model: User,
                    attributes: ['id', 'name']
                },
                {
                    model: PetDetail,
                    attributes: ['species', 'breed', 'age', 'gender', 'is_vaccinated']
                },
                {
                    model: ServiceDetail,
                    attributes: ['service_type', 'price', 'duration', 'description']
                }
            ]
        });

        return response.success(res, posts);
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