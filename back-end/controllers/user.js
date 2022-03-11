/*----------------------------------------------------------------
													REQUIRE
----------------------------------------------------------------*/
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const passwordSchema = require("../middlewares/password");
/** fs = FileSystem, already inside Express to manipulate the file object */
const fs = require('fs');
/** The models used in the query with the DataBase */
const db = require("../models");
const User = db.user;

/*----------------------------------------------------------------
													CONTROLLER
----------------------------------------------------------------*/

/** 
 * CREATE A NEW USER
 * Create a new user, with fullfilling requirement : firstname, lastname, email, password.
 * First the passwordValidator will verify if the schema is fullfilled
 * Then bcrypt will encrypt the password  
 * Finally throught Sequelize, it will write the user inside the Database
 * @param {Object} req - The request contain the data coming from the request
 * @param {Object} res - The response from the server
 * @param {Function} next - The next function is used to continue unto the next step of the code
 */
exports.signup = (req, res, next) => {
	let passwordIsClear = passwordSchema.validate(req.body.password);
	if(!passwordIsClear){ return res.status(400).json({ error: "The password must be minimum 8 character, 1 uppercase, 1 lowercase, have 2 digits and no space."})};

	if(passwordIsClear){
		bcrypt.hash(req.body.password, 10)
			.then((hash) => {
				User.create({ ...req.body, password: hash })
					.then(() => res.status(201).json({ message: "Utilisateur Créé." }))
					.catch((error) => res.status(400).json({ error }));
			})
			.catch((error) => res.status(500).json({ error }));
		}
};

/** 
 * VERIFY USER ID AND ROLE
 * Return the ID {Number} and the ROLE {Number} the middleware auth found.
 * @param {Object} req - The request contain the data coming from the request
 * @param {Object} res - The response from the server
 * @param {Function} next - The next function is used to continue unto the next step of the code
 */
exports.verify = (req, res, next) => {
	let user = {id: req.token, role: req.role};
	res.status(200).json({user});
};

/** 
 * VERIFY USER ID AND ROLE
 * Find the user in database throught the email passed in the request.
 * Compare the password using bcrypt.
 * Return the token using JsonWebToken sign function.
 * @param {Object} req - The request contain the data coming from the request
 * @param {Object} res - The response from the server
 * @param {Function} next - The next function is used to continue unto the next step of the code
 */
exports.login = (req, res, next) => {
	User.findOne({ where: { email: req.body.email }})
		.then((user) => {	
			if (!user) { return res.status(401).json({ error: "User not found !" })};
			bcrypt.compare(req.body.password, user.password)
				.then((valid) => {
					if (!valid) { return res.status(401).json({ error: "Mot de passe incorrect !" }) };
					res.status(200).json({ id: user.id, token: jwt.sign({	userId: user.id }, process.env.TOKEN, { expiresIn: '24h' })	});
				})
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};

/** 
 * READ USER
 * Return the user in the response
 * @param {Object} req - The request contain the data coming from the request
 * @param {Object} res - The response from the server
 * @param {Function} next - The next function is used to continue unto the next step of the code
 */
exports.read = (req, res, next) => {
	User.findOne({ where: { id: req.params.id }})
	.then((user) => {
		res.status(200).json({...user});
	})
	.catch(err => res.status(404).json({ error: "L'utilisateur n'as pas pu être trouvé."}, { err }));
};

/** 
 * UPDATE USER
 * First it verify if there is a file or a password in the request, in case of true, the function return a WRONG REQUEST.
 * Find the user with the id passed in the parameter
 * Verify if the user have the privilege to update it throught the id or the role returned by auth middleware.
 * Update the user with the data received from the front, it must be anything from title, text, first or lastname, job or bio.
 * @param {Object} req - The request contain the data coming from the request
 * @param {Object} res - The response from the server
 * @param {Function} next - The next function is used to continue unto the next step of the code
 */
exports.update = (req, res, next) => {
	if(req.file || req.body.password) { return res.status(403).json({ message: 'WRONG REQUEST.' }) };
	User.findOne({ where: { id: req.params.id } })
	.then((user) => {
		if( user.dataValues.id != req.token && req.role != 2 ) { return res.status(400).json({ message: "L'utilisateur n'as pas les droit requis." })}
		User.update(req.body, { where: { id: req.params.id }})
			.then(() =>  res.status(201).json({ message: "Utilisateur modifié."}))
			.catch(err => res.status(403).json({ message: "L'erreur suivante est survenue : ", error: err }))
	})
	.catch((err) => res.status(400).json(err))
};

/** 
 * UPDATE USER PASSWORD
 * First it verify if there is anything else than passwords in the request, in case of true, the function return a WRONG REQUEST.
 * Verify if the password match
 * Make it passe the passwordValidator
 * Find the user with the id passed in the parameter
 * Verify if the user have the privilege to update it throught the id or the role returned by auth middleware.
 * Update the user password
 * @param {Object} req - The request contain the data coming from the request
 * @param {Object} res - The response from the server
 * @param {Function} next - The next function is used to continue unto the next step of the code
 */
exports.updatePassword = (req, res, next) => {
	if(req.file || req.body.title || req.body.text || req.body.firstname || req.body.lastname || req.body.job || req.body.bio) { return res.status(403).json({ message: 'WRONG REQUEST.' }) };
	if(req.body.newPasswordFirstValue !== req.body.newPasswordSecondValue) { return res.status(400).json({ error: "Les mots de passe ne sont pas identique." }) };
	let passwordIsClear = passwordSchema.validate(req.body.newPasswordSecondValue);
	if(!passwordIsClear) { return res.status(400).json({ error: "Le mot de passe est incorrect, il doit contenir au moins 8 caractère, au moins 1 majuscule, 1 minuscule et 2 chiffres." })};
	User.findOne({ where: { id: req.params.id }})
	.then((e) => {
		let foundUser = e.dataValues;
		if( req.params.id != req.token && req.role !== 2 ) { return res.status(400).json({ message: "L'utilisateur n'as pas les droit requis." })}
		bcrypt.compare(req.body.originalPasswordRetype, foundUser.password)
		.then((valid) => {
			if(!valid) { return res.status(401).json({ error: "L'ancien mot de passe ne correspond pas." }) };
				bcrypt.hash(req.body.newPasswordSecondValue, 10)
				.then((hash) => {
					User.update({ password: hash }, { where: { id: req.params.id }})
						.then(() => res.status(201).json({ message: "Utilisateur modifié."}))
						.catch(err => res.status(403).json({ error: "Le mot de passe utilisateur n'as pas peu être modifié", error: err }));
				})
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }))	
	.catch((err) => res.status(403).json({ error: "L'ancien mot de passe n'est pas correct" }))
	})
};

/** 
 * UPDATE USER AVATAR
 * First it verify if there is anything else than the file in the request, in case of true, the function return a WRONG REQUEST.
 * Find the user with the id passed in the parameter
 * Verify if the user have the privilege to update it throught the id or the role returned by auth middleware.
 * Update the user avatar by calling the updateUser function.
 * @param {Object} req - The request contain the data coming from the request
 * @param {Object} res - The response from the server
 * @param {Function} next - The next function is used to continue unto the next step of the code
 */
exports.updateProfileImage = (req, res, next) => {
	if( req.body.title || req.body.text || req.body.firstname || req.body.lastname || req.body.job || req.body.bio || req.body.password ) { return res.status(403).json({ message: 'WRONG REQUEST.' }) };
	let profile = req.params.id;
	User.findOne({ where: { id: profile }})
	.then((e) => {
		let user = e.dataValues;
		if(req.token !== user.id && req.role !== 2 ){ return res.status(401).json({ message: "Vous n'avez pas les droits requis pour modifier l'avatar de cet utilisateur(rice)." }) }
		const avatar = `${req.protocol}://${req.get("host")}/images/${ req.file.filename }`;
		if(user.avatar !== "http://localhost:3000/images/default-avatar.jpg"){
			const imageName = user.avatar.split("/images/")[1];
			fs.unlink(`images/${imageName}`, () =>{
				updateUser(req, res, profile, avatar)
			})
		} else { updateUser(req, res, profile, avatar) }
	})
	.catch(err => res.status(401).json({ err }));
};

/** 
 * DELETE USER
 * First it verify if there is anything else than the file in the request, in case of true, the function return a WRONG REQUEST.
 * Find the user with the id passed in the parameter.
 * Verify if the user have the privilege to update it throught the id or the role returned by auth middleware.
 * 2 options:
 * 		- moderator: The password checked to delete the profile will be the one of the moderator
 * 		- User:	The password checked to delete the profile will be the one of the user.
 * Verify the pasword.
 * Verify the user avatar.
 * Unlink / delete any personnal avatar, but not the default one provided.
 * Delete the user profile
 * @param {Object} req - The request contain the data coming from the request
 * @param {Object} res - The response from the server
 * @param {Function} next - The next function is used to continue unto the next step of the code
 */
exports.delete = (req, res, next) => {
	let profile = req.params.id;
	User.findOne({ where: { id: profile}})
		.then((user) => {
			const imageName = user.avatar.split("/images/")[1];
			// Verify the permissions
			if( profile != req.token ){
				if(req.role  !== 2) { return res.status(403).json({ message: "L'utilisateur n'as pas les droits requis." }) }
				// For the moderator, We verify the moderator's password, not the user one (obviously)
				return User.findOne({ where: { id: req.token } })
					.then((e) => {
						let moderator = e.dataValues;
						bcrypt.compare(req.body.password, moderator.password)
						.then((valid) => {
							if(!valid) { return res.status(401).json({ error: "Mot de passe incorrect !" }) };
							if(valid) {
								// Verify the image before delete the profile
								if( user.avatar !== "http://localhost:3000/images/default-avatar.jpg" ) {
									fs.unlink(`images/${imageName}`, () => {
										deleteUser(req, res, profile)
									})
								} else {
									deleteUser(req, res, profile)
								}						
				}})})
			};
			// For current User of the profile
			let foundUser = user.dataValues ;
				bcrypt.compare(req.body.password, foundUser.password)
				.then((valid) => {
					if(!valid) { console.log('here it is'); return res.status(401).json({ message: "Mot de passe incorrect !" }) };
					if(valid) {
						// Verify the image before delete the profile
						if( user.avatar !== "http://localhost:3000/images/default-avatar.jpg" ) {
							fs.unlink(`images/${imageName}`, () => {
								deleteUser(req, res, profile)
							})
						} else {
							deleteUser(req, res, profile)
						}	
				}})
		.catch(err => res.status(400).json({error: "Mot de passe incorrect" }, { err }));
		})
	.catch(err => res.status(400).json({ error: "Utilisateur non trouvé." }))
};

/** 
 * Delete the user profile using the id, from the database.
 * @param {Object} req - The request contain the data coming from the request
 * @param {Object} res - The response from the server
 * @param {Number} id - The id must be a number
 */
function deleteUser(req, res, id){
	User.destroy({ where: { id: id }})
		.then(() => res.status(200).json({ message: "Utilisateur supprimé! "}))
		.catch(err => res.status(400).json({ error: " Suppression échoué.", err }))
}

/** 
 * update the user profile using the id, inside the database.
 * @param {Object} req - The request contain the data coming from the request
 * @param {Object} res - The response from the server
 * @param {Number} id - The id must be a number
 * @param {Object} avatar - The avatar is the media file used as avatar
 */
function updateUser(req, res, id, avatar) {
	User.update({ avatar: avatar }, { where: { id: id }})
	.then(() => res.status(201).json({ message: "Avatar modifié." }))
	.catch((err) => res.status(400).json({ err, message: "L'Avatar n'as pas pu être modifié." }))	
}