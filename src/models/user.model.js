const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        avatar_url: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: 'users',
        timestamps: false
    }
);

/// 🔐 PASSWORD HELPER
User.prototype.comparePassword = function (password) {
    return bcrypt.compare(password, this.password_hash);
};

/// 🔐 HASH PASSWORD SEBELUM CREATE
User.beforeCreate(async (user) => {
    user.password_hash = await bcrypt.hash(user.password_hash, 10);
});

module.exports = User;
