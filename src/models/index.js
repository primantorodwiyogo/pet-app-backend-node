const User = require('./user.model');
const Post = require('./post.model');
const PetDetail = require('./petDetail.model');
const ServiceDetail = require('./serviceDetail.model');

// User -> Post
User.hasMany(Post, { foreignKey: 'user_id' });
Post.belongsTo(User, { foreignKey: 'user_id' });

// Post -> PetDetail
Post.hasOne(PetDetail, { foreignKey: 'post_id' });
PetDetail.belongsTo(Post, { foreignKey: 'post_id' });

// Post -> ServiceDetail
Post.hasOne(ServiceDetail, { foreignKey: 'post_id' });
ServiceDetail.belongsTo(Post, { foreignKey: 'post_id' });

module.exports = {
    User,
    Post,
    PetDetail,
    ServiceDetail
};
