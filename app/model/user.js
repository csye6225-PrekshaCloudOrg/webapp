const {Sequelize, Model, DataTypes} = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('sequelize');

module.exports=(sequelize, DataTypes) => {
    const User = sequelize.define('User',{
        id:{
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        first_name:{
            type: DataTypes.STRING
        },
        last_name:{
            type:DataTypes.STRING
        },
        username:{
            type:DataTypes.STRING
        },
        password:{
            type:DataTypes.STRING
        },
        account_created:{
            type:DataTypes.STRING
        },
        account_updated:{
            type:DataTypes.STRING
        }
    },
    {
        timestamps: false,
    });
    return User;
}