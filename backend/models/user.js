const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Post = require("./post");
const Comment = require("./comment");
const PostLike = require("./post_like");
const auth = require("../middlewares/auth");

const User = sequelize.define('user', {
    id: { type: DataTypes.MEDIUMINT.UNSIGNED, allowNull: false, autoIncrement: true, primaryKey:true },
    first_name: { type: DataTypes.STRING(40), allowNull: false },
    last_name: { type: DataTypes.STRING(40), allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    is_admin: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 0},
    picture_url: { type: DataTypes.STRING, allowNull: true },
}, 
{
    tableName: 'user', timestamps: false, underscored: true, 
},
);

User.updatePictureUrl = (req, res) => {  
    const userId = auth.getUserIdFromToken(req)
    User.update(
        { picture_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`}, 
        { where: { id: userId }}
    )
        .then(() => res.status(201).json({ message: 'Votre photo de profil à été mise à jour avec succès!' }))
        .catch(error => res.status(500).json(error));

};

// Définition des associations entre les tables 
User.hasMany(Comment, {foreignKey: 'user_id', sourceKey: 'id'});
User.hasMany(Post, {foreignKey: 'user_id', sourceKey: 'id'});
User.hasMany(PostLike, {foreignKey: 'user_id', sourceKey: 'id'});
Post.hasMany(Comment, {foreignKey: 'post_id', sourceKey: 'id'});
Post.hasMany(PostLike, {foreignKey: 'post_id', sourceKey: 'id'});
Post.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id'});
Comment.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id'});
Comment.belongsTo(Post, {foreignKey: 'post_id', targetKey: 'id'});
PostLike.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id'});
PostLike.belongsTo(Post, {foreignKey: 'post_id', targetKey: 'id'});

module.exports = User;