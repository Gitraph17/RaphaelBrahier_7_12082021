// MODELE SEQUELIZE DE LIKE

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PostLike = sequelize.define('post_like', {
    id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, autoIncrement: true, primaryKey:true },
    is_like: { type: DataTypes.BOOLEAN, allowNull: false},
    user_id: { type: DataTypes.MEDIUMINT.UNSIGNED, allowNull: false, }, 
    post_id: { type: DataTypes.MEDIUMINT.UNSIGNED, allowNull: false, }, 
}, 
{
    tableName: 'post_like', timestamps: false, underscored: true 
}
);

module.exports = PostLike;