const fs = require('fs');
const db = require("../models");
const Comment = db.comment;
const User = db.user;

/* CREATE A NEW COMMENT
*  @ req contain the data from the request (coming from the front of the website)
*  @ res the response from the server
*  @ next to continue unto the following of the code
*  Create a new comment using the text from the body, the user id from the token, and put it in the selected post using the id in the params
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

/* READ COMMENTS
*  @ req contain the data from the request (coming from the front of the website)
*  @ res the response from the server
*  @ next to continue unto the following of the code
*  Throw all the comments in the response
*/
exports.readComment = (req, res, next) => {
  Comment.findAll( { where: { postId: req.params.id }, include: [ User ] })
  .then((event) => { res.status(200).json(event) })
  .catch((err) => res.status(400).json(err))
}

/* UPDATE COMMENT
*  @ req contain the data from the request (coming from the front of the website)
*  @ res the response from the server
*  @ next to continue unto the following of the code
*  First the server find the comment with the id passed in the parameter
*  then it verify if the user have the privilege to update it
*  And then update the comment with the data received from the front
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

/* DELETE COMMENT
*  @ req contain the data from the request (coming from the front of the website)
*  @ res the response from the server
*  @ next to continue unto the following of the code
*  First the server find the comment with the id passed in the parameter
*  then it verify if the user have the privilege to delete it
*  And then it delete the comment
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