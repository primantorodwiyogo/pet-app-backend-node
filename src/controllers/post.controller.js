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
