const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PetDetail = sequelize.define(
    'PetDetail',
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
        species: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        breed: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        gender: {
            type: DataTypes.ENUM('male', 'female'),
            allowNull: true
        },
        is_vaccinated: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        tableName: 'pet_details',
        timestamps: false
    }
);

module.exports = PetDetail;
