/*----------------------------------------------------------------
													REQUIRE
----------------------------------------------------------------*/
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const passwordSchema = require("../middlewares/password");
const fs = require('fs');
const db = require("../models");
const User = db.user;
/*----------------------------------------------------------------
													CONTROLLER
----------------------------------------------------------------*/


//	(1) Check the password requirement, (2) crypt it, (3) and save the user.
exports.signup = (req, res, next) => {
	let passwordIsClear = passwordSchema.validate(req.body.password);
	if(!passwordIsClear){ return res.status(400).json({ error: "The password must be minimum 5 character, 1 uppercase, 1 lowercase, have 2 digits and no space."})};

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

exports.verify = (req, res, next) => {
	let user = {id: req.token, role: req.role};
	res.status(200).json({user});
};

// Find the user in database, compare the password using bcrypt
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

exports.read = (req, res, next) => {
	User.findOne({ where: { id: req.params.id }})
	.then((user) => {
		res.status(200).json({...user});
	})
	.catch(err => res.status(404).json({ error: "L'utilisateur n'as pas pu être trouvé."}, { err }));
};


// UPDATE user
exports.update = (req, res, next) => {
	console.log(req.body);
	if(req.file || req.body.password) { return res.status(403).json({ message: 'WRONG REQUEST.' }) };
	User.update(req.body, { where: { id: req.token }})
	.then(() =>  res.status(201).json({ message: "Utilisateur modifié."}))
	.catch(err => res.status(403).json({ message: "L'erreur suivante est survenue : ", error: err }))
};

exports.updatePassword = (req, res, next) => {

	// Verify the permissions
	if(req.body.profileId != req.token ){
		if(req.role  != 2) { return res.status(403).json({ message: "L'utilisateur n'as pas les droits requis." }) }};
	// Verify the passwords match
	if(req.body.newPasswordFirstValue !== req.body.newPasswordSecondValue) {
		{ return res.status(400).json({ error: "Les mots de passe ne sont pas identique." })};
	};
	// Verify if the password is valid
	let passwordIsClear = passwordSchema.validate(req.body.newPasswordSecondValue);
	if(!passwordIsClear) { return res.status(400).json({ error: "Le mot de passe est incorrect" })};

	User.findOne({ where: { id: req.body.profileId }})
	.then((e) => {
		let foundUser = { ...e };
		let foundUserPassword = foundUser.dataValues.password;

			bcrypt.compare(req.body.originalPasswordRetype, foundUserPassword)
			.then((valid) => {
				if(!valid) { return res.status(401).json({ error: "Les mots de passe ne correspondent pas." }) };
					bcrypt.hash(req.body.newPasswordSecondValue, 10)
					.then((hash) => {
						User.update({ password: hash }, { where: { id: req.body.profileId }})
							.then(() => res.status(201).json({ message: "Utilisateur modifié."}))
							.catch(err => res.status(403).json({ error: "Le mot de passe utilisateur n'as pas peu être modifié", error: err }));
					})
					.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }))	
	.catch(err => res.status(403).json({ error: "L'ancien mot de passe n'est pas correct" }))
	})
};

exports.updateProfileImage = (req, res, next) => {
	let profile = req.params.id;
	User.findOne({ where: { id: req.params.id }})
	.then((e) => {
		let user = e.dataValues;
		console.log(user);
		if(req.token !== user.id && req.role !== 2 ){ return res.status(401).json({ message: "Vous n'avez pas les droits requis pour modifier l'avatar de cet utilisateur(rice)." }) }
		const avatar = `${req.protocol}://${req.get("host")}/images/${ req.file.filename }`;
		if(e.avatar !== "http://localhost:3000/images/default-avatar.jpg"){
			const imageName = e.avatar.split("/images/")[1];
			fs.unlink(`images/${imageName}`, () =>{
				updateUser(req, res, profile, avatar)
			})
		} else { updateUser(req, res, profile, avatar) }
	})
	.catch(err => res.status(401).json({ err }));
};


// DELETE user
exports.delete = (req, res, next) => {
	let profile = req.body.profileId;
	User.findOne({ where: { id: profile}})
		.then((user) => {
			const imageName = user.avatar.split("/images/")[1];
			// Verify the permissions
			if(profile != req.token ){
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

function deleteUser(req, res, id){
	User.destroy({ where: { id: id }})
		.then(() => res.status(200).json({ message: "Utilisateur supprimé! "}))
		.catch(err => res.status(400).json({ error: " Suppression échoué.", err }))
}
function updateUser(req, res, id, avatar) {
	User.update({ avatar: avatar }, { where: { id: id }})
	.then(() => res.status(201).json({ message: "Avatar modifié." }))
	.catch((err) => res.status(400).json({ err, message: "L'Avatar n'as pas pu être modifié." }))	
}

