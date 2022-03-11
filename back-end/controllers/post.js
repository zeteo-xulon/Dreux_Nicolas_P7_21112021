/** fs = FileSystem, already inside Express to manipulate the file object */
const fs = require('fs');
/** The models used in the query with the DataBase */
const db = require("../models");
const Post = db.post;
const Comment = db.comment;
const User = db.user;

/** 
 * CREATE A NEW POST
 * Create a new post using the text from the body, the user id from the token, The file if there is one, and throught Sequelize, it will write it on the Database
 * A Post model require a Title, a Text, and optionnally a file with the description.
 * @param {Object} req - The request contain the data coming from the request
 * @param {Object} res - The response from the server
 * @param {Function} next - The next function is used to continue unto the next step of the code
 */
exports.createPost = (req, res, next) => {
  let media = "";
  let alt = "L'utilisateur n'a pas fourni de description à cette image."
  if(req.file){ 
    media = `${req.protocol}://${req.get("host")}/images/${ req.file.filename }`;
    if(req.file.mediaDescription){
    alt = req.file.mediaDescription;
    }
  }else {
    alt = "";
  }
  Post.create({ 
    title: req.body.title,
    text: req.body.text,
    media: media,
    media_description: alt,
    userId: req.token
    })
  .then(() => res.status(201).json({ message: "Post Créé." }))
  .catch((error) => res.status(400).json({ error }));
};

/** 
 * READ POSTS
 * Return all the posts in the response including :
 *  -the user for each post
 *  -the comment of each post
 *  -and the user for each comment
 * @param {Object} req - The request contain the data coming from the request
 * @param {Object} res - The response from the server
 * @param {Function} next - The next function is used to continue unto the next step of the code
 */
exports.readAllPost = (req, res, next) => {
  Post.findAll({ include: [{ model: User }, { model: Comment, include: { model: User } }]})
  .then((e) => { res.status(200).json(e) })
  .catch((error) => res.status(400).json({ error }));
}
 
/** 
 * READ ONE POST
 * Return one post in the response, used to reload an existing post after an UPDATE
 * @param {Object} req - The request contain the data coming from the request
 * @param {Object} res - The response from the server
 * @param {Function} next - The next function is used to continue unto the next step of the code
 */
exports.readOnePost = (req, res, next) => {
  Post.findAll({ where: { id: req.params.id}})
  .then((e) => { res.status(200).json(e) })
  .catch((error) => res.status(400).json({ error }));
}

/** 
 * UPDATE POST
 * First the server find the post with the id passed in the parameter
 * Then it verify if the user have the privilege to update it throught the id or the role returned by auth middleware.
 * Verify if there is a file
 * if there is one, fs - FileSystem unlink / delete the previous media file
 * And then update the post with the data received from the front
 * When the response have a status 200 the front should auto reload
 * @param {Object} req - The request contain the data coming from the request
 * @param {Object} res - The response from the server
 * @param {Function} next - The next function is used to continue unto the next step of the code
 */
exports.updatePost = (req, res, next) => {
  Post.findAll({ where: { id: req.params.id } })
  .then((e) => {
    let foundPost = { ...e[0].dataValues };
    console.log(`req.role is == ${req.role}`)
    if(req.token === foundPost.userId || req.role === 2 ){
        if(req.file){
          const newMedia = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
          const previousMedia = foundPost.media.split('/images/')[1];
          fs.unlink(`images/${previousMedia}`, () => {
            Post.update({ 
              title: req.body.title,
              text: req.body.text,
              media: newMedia,
              media_description: req.body.media_description
            }, { where: {id: req.params.id} })
            .then(() =>	{ res.status(200).json({ message: "Post updated successfully!" })})
            .catch((error) => res.status(400).json({ error }))
          })  
        }else {
          Post.update({
            title: req.body.title,
            text: req.body.text
          }, { where: {id: req.body.post_id } })
          .then(() =>	{ res.status(200).json({ message: "Post updated successfully!" })})
          .catch((error) => res.status(400).json({ error }))
        }
      }else{
        return res.status(400).json({ message: "Vous n'avez pas les privilèges requis pour modifier ce post." });
      }
  })
  .catch(err => res.status(400).json(err)) 
};

/**
 * DELETE POST
 * First the server find the post with the id passed in the parameter
 * Then it verify if the user have the privilege to delete it throught the id or the role returned by auth middleware.
 * Verify if there is a file in the post found
 * If there is one, fs - FileSystem unlink / delete the file
 * Finally it delete the post
 * @param {Object} req - The request contain the data coming from the request
 * @param {Object} res - The response from the server
 * @param {Function} next - The next function is used to continue unto the next step of the code
 */
exports.deletePost = (req, res, next) => {
  Post.findAll({ where: { id: req.params.id } })
  .then((event) => {
    let foundPost = { ...event[0].dataValues };
    //verif user privilege
    if(req.token === foundPost.userId || req.role === 2){
      // Delete the picture if there is one
      if(foundPost.media){
        const mediaToDelete = foundPost.media.split('/images/')[1];
        fs.unlink('images/' + mediaToDelete, () => {
          Post.destroy({ where: { id: req.params.id }})
          .then(() =>	{ res.status(200).json({ message: "Post deleted successfully!" }) })
          .catch((error) => res.status(400).json({ error })) 
        })} else {
        Post.destroy({ where: { id: req.params.id }})
        .then(() =>	{ res.status(200).json({ message: "Post deleted successfully!" }) })
        .catch((error) => res.status(400).json({ error })) 
        }
    }else{ res.status(400).json({ message: "Vous n'avez pas les privilèges requis pour suppriemr ce message."})}
  })
  .catch((err) => res.status(400).json({ err }));
}