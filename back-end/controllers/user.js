/*----------------------------------------------------------------
													REQUIRE
----------------------------------------------------------------*/
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const passwordSchema = require("../middlewares/password");
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

// Find the user in database, compare the password using bcrypt
exports.login = (req, res, next) => {
	User.findOne({ where: { 
		email: req.body.email 
		}})
		.then((user) => {	
			if (!user) { return res.status(401).json({ error: "User not found !" })}
			bcrypt.compare(req.body.password, user.password)
				.then((valid) => {
					if (!valid) { return res.status(401).json({ error: "Mot de passe incorrect !" }) };
					res.status(200).json({ 
						id: user.id, 
						token: jwt.sign({ 
							userId: user._id }, 
							process.env.TOKEN, 
							{ expiresIn: '24h' }
						)	
					});
				})
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};


// UPDATE user
exports.update = (req, res, next) => {
	if(!req.body.token) { return res.status(400).json({ error: "Vous n'êtes pas authentifié" }, { err })};
	if(req.body.token) {
		let verified = jwt.verify(req.body.token, process.env.TOKEN);
		console.log(verified);
		if(!verified) { return res.status(400).json({ error: "TOKEN invalid" }, { err })
	} else {
		if(req.body.password){
			let passwordIsClear = passwordSchema.validate(req.body.password);
			if(!passwordIsClear) { return res.status(400).json({ error: "Le mot de passe est incorrect" }, { err })};
			if(passwordIsClear){
			User.findOne({ where: { id: req.body.id }})
			.then((user) => {
				bcrypt.compare(req.body.password, user.password)
				.then((valid) => {
					if(!valid) { return res.status(401).json({ error: "Mot de passe incorrect !" }) };
						bcrypt.hash(req.body.password, 10)
						.then((hash) => {
							User.update({ password: hash }, { where: { id: req.body.id }})
							.then(() => res.status(201).json({ message: "Utilisateur modifié."}))
							.catch(err => res.status(403).json({ error: "L'utilisateur n'as pas peu être modifié"}, { err }));
						})
						.catch((error) => res.status(500).json({ error }));
				})
			.catch((error) => res.status(500).json({ error }));
			})}
	} else {
			User.update({ ...req.body }, { where: { id: req.body.id }})
			.then(() => res.status(201).json({ message: "Utilisateur modifié."}))
			.catch(err => res.status(403).json({ error: "L'utilisateur n'as pas peu être modifié"}, { err }));
		}
}}};


// DELETE user
exports.delete = (req, res, next) => {
	if(!req.body.token) { return res.status(400).json({ error: "Vous n'êtes pas authentifié" }, { err })};

	if(req.body.token) {
		let verifiedToken = jwt.verify(req.body.token, process.env.TOKEN);
		if(!verifiedToken) { return res.status(400).json({ error: "TOKEN invalid" }, { err })}

		if(verifiedToken) {
			User.findOne({ where: { id: req.body.id}})
				.then((user) => {
					bcrypt.compare(req.body.password, user.password)
					.then((valid) => {
						if(!valid) { return res.status(401).json({ error: "Mot de passe incorrect !" }) };

						if(valid) {
							User.destroy({ where: { email: req.body.email }})
							.then(say => res.status(200).json({ message: "Utilisateur supprimé! "}))
							.catch(err => res.status(400).json({ error: " Suppression échoué." }))
						}
					})
				.catch(err => res.status(400).json({error: "Mot de passe incorrect" }, { err }));
				})
			.catch(err => res.status(400).json({ error: "Utilisateur non trouvé." }))
		}
	}
};
