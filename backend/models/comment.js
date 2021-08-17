const { Sequelize, DataTypes, DATE } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");
const Post = require("./post");

const Comment = sequelize.define('comment', {
    id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, autoIncrement: true, primaryKey:true },
    publication_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    content: { type: DataTypes.TEXT, allowNull: false },
    user_id: { type: DataTypes.MEDIUMINT.UNSIGNED, allowNull: false,  }, 
    post_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
}, 
{
    tableName: 'comment', timestamps: false, underscored: true 
}
);

module.exports = Comment;