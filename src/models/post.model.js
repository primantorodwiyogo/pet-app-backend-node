const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Post = sequelize.define(
    'Post',
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('pet', 'service'),
            allowNull: false
        },
        title: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        location: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: 'posts',
        timestamps: false
    }
);

module.exports = Post;
