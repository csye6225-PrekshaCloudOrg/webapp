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
            type: DataTypes.STRING,
            validate: {
                isAlpha: true,
            }
        },
        last_name:{
            type:DataTypes.STRING,
            validate: {
                isAlpha: true,
            }
        },
        username:{
            type:DataTypes.STRING,
            validate: {
            isEmail: true
            }
        },
        password:{
            type:DataTypes.STRING
        },
        account_created:{
            type:DataTypes.DATE
        },
        account_updated:{
            type:DataTypes.DATE
        },
        token:{
            type:DataTypes.STRING,
            unique: true
        },
        verified:{
            type:DataTypes.BOOLEAN,
        }
    },
    {
        timestamps: false,
    });
    return User;
}