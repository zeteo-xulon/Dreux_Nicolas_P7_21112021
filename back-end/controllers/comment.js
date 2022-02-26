const fs = require('fs');
const db = require("../models");
const Comment = db.comment;
const User = db.user;

exports.createComment = (req, res, next) => {
  Comment.create({ 
    text: req.body.text,
    userId: req.token,
    postId: req.params.id
  }, { where: { postId: req.params.id } })
  .then(() => res.status(201).json({ message: "commentaire créé avec succès." }))
  .catch(err => res.status(400).json(err))
}

exports.readComment = (req, res, next) => {
  Comment.findAll( { where: { postId: req.params.id }, include: [ User ] })
  .then((event) => {
    res.status(200).json(event)
  })
  .catch((err) => res.status(400).json(err))
}

exports.updateComment = (req, res, next) => {
  Comment.findAll({ where: { id: req.params.id } })
  .then((event) => {
    let comment = { ...event[0].dataValues }
      if(req.token === comment.userId || req.role === 2){
        Comment.update({ text: req.body.text }, { where: { id: req.params.id } })
        .then(() => res.status(200).json({ message: "Le commentaire à été modifié avec succès."}))
        .catch(err => res.status(400).json(err))
      }else{
        res.status(400).json({ message:"Vous ne disposez pas des privilèges requis pour modifier ce commentaire." })
    }})
  .catch(err => res.status(400).json(err))
}

exports.deleteComment = (req, res, next) => {
  Comment.findAll({ where: { post_id: req.body.post_id } })
  .then((event) => {
    let comment = { ...event[0].dataValues }
      if(req.token === comment.creator_id || req.role === 2){
        Comment.destroy({ where: { id: req.body.comment_id } })
        .then(() => res.status(200).json({ message: "Le commentaire à été supprimé avec succès."}))
        .catch(err => res.status(400).json(err))
      }else{
        res.status(400).json({ message:"Vous ne disposez pas des privilèges requis pour modifier ce commentaire." })
    }})
  .catch(err => res.status(400).json(err))
}