const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");
const Comment = require("./comment");
const PostLike = require("./post_like");

const Post = sequelize.define('post', {
    id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, autoIncrement: true, primaryKey:true },
    publication_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    user_id: { type: DataTypes.MEDIUMINT.UNSIGNED, allowNull: false, }, 
    image_url: { type: DataTypes.STRING, allowNull: true, }, 
    content: { type: DataTypes.TEXT, allowNull: true },
}, 
{
    tableName: 'post', timestamps: false, underscored: true 
}
);

module.exports = Post;