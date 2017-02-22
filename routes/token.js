import jwt from "jwt-simple";

module.exports = app => {
	const cfg = app.libs.config;
	const Users = app.db.models.Users;
	/**
	 * @api {post} /token Authentication Token
	 * @apiGroup Credentials
	 * @apiPermission none
	 * @apiParam (Body Parameter) {String} email User email
	 * @apiParam (Body Parameter) {String} password User password
	 * @apiParamExample {json} Input
	 *		{
	 *			"email": "john@doe.com",
	 *			"password": "1234"
	 *		}
	 * @apiSuccess {String} token Token of authenticated user
	 * @apiSuccessExample {json} Success
	 * 		HTTP/1.1 200 OK
	 *		{"token": "abc.xyz.123.gfh"}
	 * @apiErrorExample {json} Authentication error
	 * 		HTTP/1.1 401 Unauthorized
	 */
	app.post("/token", (req, res) => {
		if (req.body.email && req.body.password) {
			const email = req.body.email;
			const password = req.body.password;
			Users.findOne({
					where: {
						email: email
					}
				})
				.then(user => {
					if (Users.isPassword(user.password, password)) {
						const payload = {
							id: user.id
						};
						res.json({
							token: jwt.encode(payload, cfg.jwtSecret),
							id: user.id,
							email: user.email,
							firstName: user.firstName,
							lastName: user.lastName
						});
					} else {
						res.sendStatus(401);
					}
				})
				.catch(error => res.sendStatus(401));
		} else {
			res.sendStatus(401);
		}
	});
};
