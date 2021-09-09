 // CONTROLEURS DES ROUTES D'AJOUT ET DE SUPPRESSION DE COMMENTAIRES 

const Comment = require("../models/comment");
const User = require("../models/user");
const auth = require("../middlewares/auth");

exports.createComment = (req, res) => {
  const userId = auth.getUserIdFromToken(req, res);
  Comment.create({
      user_id: userId,
      post_id: req.body.data.postId,
      content: req.body.data.content
  })
  .then(() => res.status(201).json({ message: 'Post publié avec succès !' }))
  .catch(error => res.status(400).json(error));
}

exports.deleteComment = (req, res) => {
  const userId = auth.getUserIdFromToken(req, res);
  User.findOne({ where: { id: userId }})
  .then(userDeleting => {
      Comment.findOne({ where: { id: req.body.commentId }})
      .then(comment => {
          if (userId === comment.user_id || userDeleting.is_admin) {
              Comment.destroy({ where: { id: comment.id }})
              .then(() => res.status(200).json({ message: 'Votre commentaire à été supprimé avec succès.' }))
              .catch(error => res.status(400).json(error));
          }
      })
      .catch(error => res.status(400).json(error));
  })
  .catch(error => res.status(400).json(error));
}
