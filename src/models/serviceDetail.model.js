const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ServiceDetail = sequelize.define(
    'ServiceDetail',
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        post_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        service_type: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        duration: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        tableName: 'service_details',
        timestamps: false
    }
);

module.exports = ServiceDetail;
