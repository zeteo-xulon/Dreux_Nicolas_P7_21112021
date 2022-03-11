/** fs = FileSystem, already inside Express to manipulate the file object */
const fs = require('fs');
/** The models used in the query with the DataBase */
const db = require("../models");
const Comment = db.comment;
const User = db.user;

/**
 * CREATE A NEW COMMENT
 * Create a new comment using the text from the body, the user id from the token, and put it in the selected post using the id in the params, and throught Sequelize, it will write it on the Database
 * @param {Object} req - The request contain the data coming from the request
 * @param {Object} res - The response from the server
 * @param {Function} next - The next function is used to continue unto the next step of the code
 */
exports.createComment = (req, res, next) => {
  Comment.create({ 
    text: req.body.text,
    userId: req.token,
    postId: req.params.id
  }, { where: { postId: req.params.id } })
  .then(() => res.status(201).json({ message: "commentaire créé avec succès." }))
  .catch(err => res.status(400).json(err))
}

/** 
 * READ COMMENTS
 * Return all the comments in the response, including the user for each comment.
 * @param {Object} req - The request contain the data coming from the request
 * @param {Object} res - The response from the server
 * @param {Function} next - The next function is used to continue unto the next step of the code
 */
exports.readComment = (req, res, next) => {
  Comment.findAll( { where: { postId: req.params.id }, include: [ User ] })
  .then((event) => { res.status(200).json(event) })
  .catch((err) => res.status(400).json(err))
}

/** 
 * UPDATE COMMENT
 * First the server find the comment with the id passed in the parameter
 * Then it verify if the user have the privilege to update it throught the id or the role returned by auth middleware.
 * And then update the comment with the data received from the front
 * @param {Object} req - The request contain the data coming from the request
 * @param {Object} res - The response from the server
 * @param {Function} next - The next function is used to continue unto the next step of the code
 */
exports.updateComment = (req, res, next) => {
  Comment.findOne({ where: { id: req.params.id } })
  .then((comment) => {
    if( req.token === comment.dataValues.userId || req.role === 2 ){
      Comment.update({ text: req.body.text }, { where: { id: req.params.id } })
      .then(() => res.status(200).json({ message: "Le commentaire à été modifié avec succès."}))
      .catch(err => res.status(400).json(err))
    } else { res.status(400).json({ message:"Vous ne disposez pas des privilèges requis pour modifier ce commentaire." }) }
  })
  .catch(err => res.status(400).json(err))
}

/** 
 * DELETE COMMENT
 * First the server find the comment with the id passed in the parameter
 * Then it verify if the user have the privilege to delete it throught the id or the role returned by auth middleware.
 * Finally it delete the comment
 * @param {Object} req - The request contain the data coming from the request
 * @param {Object} res - The response from the server
 * @param {Function} next - The next function is used to continue unto the next step of the code
 */
exports.deleteComment = (req, res, next) => {
  Comment.findOne({ where: { id: req.params.id} })
  .then((comment) => {
    if(req.token === comment.dataValues.userId || req.role === 2){
      Comment.destroy({ where: { id: req.params.id } })
      .then(() => res.status(200).json({ message: "Le commentaire à été supprimé avec succès."}))
      .catch(err => res.status(400).json(err))
    } else { res.status(400).json({ message:"Vous ne disposez pas des privilèges requis pour modifier ce commentaire." })}
  })
  .catch(err => res.status(400).json(err))
}