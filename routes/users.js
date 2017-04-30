module.exports = app => {
	const Users = app.db.models.Users;
	const Issues = app.db.models.Issues;
	const Categories = app.db.models.Categories;
	const Comments = app.db.models.Comments;
	app.route("/users")
		/**
		@apiDefine none No permission needed.
		This method is accessible even if the user is not logged in.
		*/
		/**
		@apiDefine admin Administrator access only
		This method is only accessible to users with admin access.
		*/
		/**
		@apiDefine user User needs to be logged in.
		This method is accessible to only the logged in users.
		*/
		/**
		 * @api {get} /users List the registered users
		 * @apiGroup User
		 * @apiPermission none
		 * @apiExample Example usage:
		 *     Endpoint: /users
		 *
		 *     Query Parameters: q=john&sortBy=created_date&date=
		 *
		 *     Example Request: /users?q=john&sortBy=created_date&date=2016-10-30T15:17:01.000Z
		 * @apiParam (Query Parameter) {String} [q] Search text
		 * @apiParam (Query Parameter){String=created_date} [sortBy=created_date] Sort Results By
		 * @apiParam (Query Parameter) {Date} [date] Upper date limit. Users created before this date are listed. This is also a pagination offset.
		 * @apiSuccess {Object[]} users User's list
		 * @apiSuccess {Number} id User id
		 * @apiSuccess {String} firstName User first name
		 * @apiSuccess {String} lastName User last name
		 * @apiSuccess {String} email	User email
		 * @apiSuccessExample {json} Success
		 * HTTP/1.1 200 OK
		 *	[
		 *		{
		 *		"id": 1,
		 *		"firstName": "John",
		 *		"lastName": "Doe",
		 *		"email": "john@doe.com"
		 *		}
		 *	]
		 * @apiErrorExample {json} List Error
		 * 		HTTP/1.1 412 Precondition Failed
		 */
		.get((req, res) => {
			var criteria = {};
			if (req.query.q) {
				var expr = '%' + req.query.q + '%'
				criteria.$or = [{
					firstName: {
						$like: expr
					}
				}, {
					lastName: {
						$like: expr
					}
				}, {
					address: {
						$like: expr
					}
				}, {
					profession: {
						$like: expr
					}
				}, {
					email: {
						$like: expr
					}
				}]
			}

			var sortBy = req.query.sortBy ? req.query.sortBy : "created_date";
			if (req.query.date) {
				var date = req.query.date;
			}

			if (sortBy == "created_date") {
				if (date) {
					criteria.created_at = {
						$lt: date
					}
				}
			}

			Users.findAll({
					where: criteria,
					attributes: ["id", "firstName", "lastName", "email"],
					limit: 10,
					order: [['updated_at', 'DESC']]
				})
				.then(result => res.json(result))
				.catch(error => {
					res.status(412).json({
						msg: error.message
					});
				});
		})
		/**
		 * @api {post} /users Register a new user
		 * @apiGroup User
		 * @apiPermission none
		 * @apiParam (Body Parameter) {String} firstName User first name
		 * @apiParam (Body Parameter) {String} lastName User last name
		 * @apiParam (Body Parameter) {String} email User's unique email
		 * @apiParam (Body Parameter) {String} password User password
		 * @apiParam (Body Parameter) {String} [dob] User date of birth
		 * @apiParam (Body Parameter) {String} phonenumber User's unique phone number
		 * @apiParam (Body Parameter) {String} [sex] User sex
		 * @apiParam (Body Parameter) {String} [profession] User profession
		 * @apiParam (Body Parameter) {String} [address] User address
		 * @apiParam (Body Parameter) {String} [user_photo] User photo
		 * @apiParamExample {json} Input
		 *		{
		 *		  "firstName": "John",
		 *		  "lastName": "Doe",
		 *		  "email": "john@doe.com",
		 *        "password": "verystrongpassword123",
		 *		  "phonenumber": "9849123453"
		 *		}
		 * @apiSuccess {Number} id User id
		 * @apiSuccess {String} firstName User first name
		 * @apiSuccess {String} lastName User last name
		 * @apiSuccess {String} email User's unique email
		 * @apiSuccess {String} phonenumber User's unique phone number
		 * @apiSuccess {Number} role_id Role id
		 * @apiSuccess {Date} updated_at Update's date
		 * @apiSuccess {Date} created_at Register's date
		 * @apiSuccessExample {json} Success
		 * 		HTTP/1.1 200 OK
		 *		{
		 *		  "id": 1,
		 *		  "firstName": "John",
		 *		  "lastName": "Doe",
		 *		  "email": "john@doe.com",
		 *		  "phonenumber": "9849123453",
		 *		  "role_id": 1,
		 *		  "updated_at": "2016-10-30T15:17:01.000Z",
		 *		  "created_at": "2016-10-27T07:23:56.000Z"
		 *		}
		 * @apiErrorExample {json} Register error
		 * 		HTTP/1.1 412 Precondition Failed
		 * @apiErrorExample {json} Validation error
		 * 		HTTP/1.1 412 Precondition Failed
		 *		{
		 *			"msg": "Validation error"
		 *		}
		 */
		.post((req, res) => {
			Users.create(req.body)
				.then(result => {
					result = result.toJSON();
					delete result.password;
					res.json(result);
				})
				.catch(error => {
					res.status(412).json({
						msg: error.message
					});
				});
		});


	app.route("/users/:id")
		/**
		 * @api {get} /users/:id Get a user
		 * @apiGroup User
		 * @apiPermission none
		 * @apiParam {id} id User id
		 * @apiSuccess {Number} id User id
		 * @apiSuccess {String} firstName User first name
		 * @apiSuccess {String} lastName User last name
		 * @apiSuccess {String} email	User email
		 * @apiSuccessExample {json} Success
		 * 		HTTP/1.1 200 OK
		 *		{
		 *		"id": 1,
		 *		"firstName": "John",
		 *		"lastName": "Doe",
		 *		"email": "john@doe.com"
		 *		}
		 * @apiErrorExample {json} User not found error
		 * 		HTTP/1.1 404 Not Found
		 * @apiErrorExample {json} Find error
		 * 		HTTP/1.1 412 Precondition Failed
		 */
		.get((req, res) => {

			Users.findOne({
					where: {
						id: req.params.id
					},
					attributes: ["id", "firstName", "lastName", "email"]
				})
				.then(result => {
					if (result) {
						res.json(result);
					} else {
						res.sendStatus(404);
					}
				})
				.catch(error => {
					res.status(412).json({
						msg: error.message
					});
				});
		})
		/**
		 * @api {delete} /users/:id Delete a user
		 * @apiGroup User
		 * @apiPermission admin
		 * @apiHeader {String} Authorization Token of an authenticated admin
		 * @apiHeaderExample {json} Header
		 * 		{"Authorization": "JWT abc.xyz.123.gfh"}
		 * @apiParam {id} id User Id
		 * @apiSuccessExample {json} Success
		 * 		HTTP/1.1 204 No Content
		 * @apiErrorExample {json} Delete error
		 *		HTTP/1.1 412 Precondition Failed
		 * @apiErrorExample {json} Authentication error
		 * 		HTTP/1.1 401 Unauthorized
		 */
		.delete(app.auth.authenticate(), (req, res) => {
			if (req.user.role == 2) {
				Users.destroy({
						where: {
							id: req.params.id
						}
					})
					.then(result => {
						if (result == 1) {
							res.sendStatus(204)
						} else {
							res.sendStatus(412);
						}
					})
					.catch(error => {
						res.status(412).json({
							msg: error.message
						});
					});
			} else {
				res.sendStatus(401);
			}
		});

	app.route("/users/:id/issues")
		/**
		 * @api {get} /users/:id/issues List the issues created by a user
		 * @apiGroup Issue
		 * @apiPermission none
		 * @apiParam {id} id User id
		 * @apiParam (Query Parameter) {String=created_date} [sortBy=created_date] Sort Results By
		 * @apiParam (Query Parameter) {Date} [date] Upper date limit. Issues created before this date are listed. This is also a pagination offset.
		 * @apiSuccess {Object[]} issues Issue's list
		 * @apiSuccess {Number} id Issue id
		 * @apiSuccess {Number} category_id Issue category Id
		 * @apiSuccess {Number} user_id User Id of issue creator
		 * @apiSuccess {String} title Issue title
		 * @apiSuccess {String} description Issue description
		 * @apiSuccess {String} address Issue address
		 * @apiSuccess {Boolean} solved Issue status
		 * @apiSuccess {Boolean} visibility Issue visibility
		 * @apiSuccess {Boolean} anon Issue creator's anonymity
		 * @apiSuccess {Date} created_at Issue created date
		 * @apiSuccess {Date} updated_at Issue updated date
		 * @apiSuccess {Object} User Issue creator
		 * @apiSuccess {String} User.firstName User first name
		 * @apiSuccess {String} User.lastName User last name
		 * @apiSuccess {String} User.user_photo User photo
		 * @apiSuccess {Object} Category Issue category
		 * @apiSuccess {String} Category.title Issue category title
		 * @apiSuccess {Number} votes Issue vote count
		 * @apiSuccessExample {json} Success
		 * 		HTTP/1.1 200 OK
		 *		[
		 *		  {
		 *		    "id": 1,
		 *		    "category_id": 1,
		 *		    "user_id": 1,
		 *		    "title": "manholes",
		 *		    "description": "manholes in the road that are left uncovered.",
		 *		    "address": "Kathmandu",
		 *		    "solved": false,
		 *		    "visibility": false,
		 *		    "anon": false,
		 *		    "created_at": "2016-10-27T07:02:31.000Z",
		 *		    "updated_at": "2016-10-27T07:02:31.000Z",
		 *		    "User": {
		 *		      "firstName": "John",
		 *		      "lastName": "Doe",
		 *		      "user_photo": null
		 *		    },
		 *		    "Category": {
		 *		      "title": "Road"
		 *		    },
		 *		    "votes": 1
		 *		  }
		 *		]
		 * @apiErrorExample {json} Issue not found error
		 * 		HTTP/1.1 404 Not Found
		 * @apiErrorExample {json} List error
		 * 		HTTP/1.1 412 Precondition Failed
		 * @apiErrorExample {json} Authentication error
		 * 		HTTP/1.1 401 Unauthorized
		 */
		.get(app.auth.authenticate(),(req, res) => {
			var criteria = {}

			var sortBy = req.query.sortBy ? req.query.sortBy : "created_date";

			if (req.query.date) {
				var date = req.query.date;
			}

			if (sortBy == "created_date") {
				if (date) {
					criteria.created_at = {
						$lt: date
					}
				}
			}

			Issues.findAll({

					group: ['Issues.id'],

					include: [{
							model: Users,
							as: 'Vote',
							attributes: [
								[app.db.sequelize.fn('COUNT', app.db.sequelize.col('Vote.id')), 'count']
							],
							through: {
								attributes: []
							},
							duplicating: false
						}, {
							model: Users,
							attributes: ["firstName", "lastName", "user_photo"],
							duplicating: false,
							where: {
								id: req.params.id
							}
						}, {
							model: Categories,
							attributes: ['title'],
							duplicating: false
						},

					],
					where: criteria,
					order: [['updated_at', 'DESC']],
					limit: 10

				})
				.then(result => {
					
					
					if (result.length >= 1) {
						var jsonString = JSON.stringify(result);

						var obj = JSON.parse(jsonString);
						var final_result = [];
						obj.map(function(item) {
							if  (item.anon == true && item.user_id==req.user.id || item.anon==false){
									final_result.push(item);
								}
						});

						return res.json(final_result);
						
						
					} else {
						res.sendStatus(404);
					}
				})
				.catch(error => {
					res.status(412).json({
						msg: error.message
					});
				});
		});

	app.route("/users/:id/comments")
		/**
		 * @api {get} /users/:id/comments List the comments created by a user
		 * @apiGroup Comment
		 * @apiPermission none
		 * @apiParam {id} id User id
		 * @apiParam (Query Parameter) {Date} [date] Upper date limit. Issues created before this date are listed. This is also a pagination offset.
		 * @apiSuccess {Object[]} comments Comment's list
		 * @apiSuccess {Number} id Comment id
		 * @apiSuccess {Number} user_id User Id of commentor
		 * @apiSuccess {Number} issue_id Issue Id to which comment belongs
		 * @apiSuccess {String} comment Comment content
		 * @apiSuccess {Date} created_at Comment created date
		 * @apiSuccess {Date} updated_at Comment updated date
		 * @apiSuccessExample {json} Success
		 * 		HTTP/1.1 200 OK
		 *		[
		 *		  {
		 *		    "id": 1,
		 *		    "user_id": 1,
		 *		    "issue_id": 1,
		 *		    "comment": "The manhole should be covered.",
		 *		    "created_at": "2016-10-30T18:49:42.000Z",
		 *		    "updated_at": "2016-10-30T18:49:42.000Z"
		 *		  }
		 *		]
		 * @apiErrorExample {json} Comment not found error
		 * 		HTTP/1.1 404 Not Found
		 * @apiErrorExample {json} List error
		 * 		HTTP/1.1 412 Precondition Failed
		 */
		.get((req, res) => {
			var date = "";
			if (req.query.date) {
				date = req.query.date;
			}

			var criteria = {
				user_id: parseInt(req.params.id),
				created_at: {
					$lt: date
				}
			}
			Comments.findAll({
					where: criteria,
					limit: 10,
					order: [['updated_at', 'DESC']],
				})
				.then(result => {
					if (result.length >= 1) {
						res.json(result);
					} else {
						res.sendStatus(404);
					}
				})
				.catch(error => {
					res.status(412).json({
						msg: error.message
					});
				});

		});



	app.route("/user")

	/**
	 * @api {get} /user Return the authenticated user's data
	 * @apiGroup User
	 * @apiPermission user
	 * @apiHeader {String} Authorization Token of authenticated user
	 * @apiHeaderExample {json} Header
	 * 		{"Authorization": "JWT abc.xyz.123.gfh"}
	 * @apiSuccess {Number} id User id
	 * @apiSuccess {String} firstName User first name
	 * @apiSuccess {String} lastName User last name
	 * @apiSuccess {String} email User email
	 * @apiSuccess {String} dob User date of birth
	 * @apiSuccess {String} phonenumber User phone number
	 * @apiSuccess {String} sex User sex
	 * @apiSuccess {String} profession User profession
	 * @apiSuccess {String} address User address
	 * @apiSuccess {String} user_photo User photo
	 * @apiSuccess {Number} role_id User role
	 * @apiSuccess {Date} created_at User created date
	 * @apiSuccessExample {json} Success
	 * 		HTTP/1.1 200 OK
	 *		{
	 *		  "id": 1,
	 *		  "firstName": "John",
	 *		  "lastName": "Doe",
	 *		  "email": "john@doe.com",
	 *		  "dob": "1994-02-03",
	 *		  "phonenumber": "9849123453",
	 *		  "sex": "male",
	 *		  "profession": "Student",
	 *		  "address": "Kathmandu",
	 *		  "user_photo": null,
	 *		  "role_id": 1,
	 *		  "created_at": "2016-10-27T07:23:56.000Z"
	 *		}
	 * @apiErrorExample {json} Authentication error
	 * 		HTTP/1.1 401 Unauthorized
	 */
	.get(app.auth.authenticate(), (req, res) => {
			Users.findOne({
					where: {
						id: req.user.id
					},
					attributes: {
						exclude: ["password", "updated_at"]
					}
				})
				.then(result => {
					if (result) {
						res.json(result);
					} else {
						res.sendStatus(404);
					}
				})
				.catch(error => {
					res.status(412).json({
						msg: error.message
					});
				});
		})
		/**
		 * @api {put} /user Update the authenticated user's data
		 * @apiGroup User
		 * @apiPermission user
		 * @apiHeader {String} Authorization Token of authenticated user
		 * @apiHeaderExample {json} Header
		 * 		{"Authorization": "JWT abc.xyz.123.gfh"}
		 * 
		 * @apiParam (Body Parameter) {String} firstName User first name
		 * @apiParam (Body Parameter) {String} lastName User last name
		 * @apiParam (Body Parameter) {String} email User email
		 * @apiParam (Body Parameter) {String} password Plaintext password
		 * @apiParam (Body Parameter) {Date} dob User date of birth
		 * @apiParam (Body Parameter) {String} phonenumber User phone number
		 * @apiParam (Body Parameter) {String} sex User sex
		 * @apiParam (Body Parameter) {String} profession User profession
		 * @apiParam (Body Parameter) {String} address User address
		 * @apiParam (Body Parameter) {String} user_photo User photo
		 * @apiParamExample {json} Input
		 * 		HTTP/1.1 200 OK
		 *		{
		 *		  "id": 1,
		 *		  "firstName": "John",
		 *		  "lastName": "Doe",
		 *		  "email": "john@doe.com",
		 *        "password": "verystrongpassword123",
		 *		  "dob": "1994-02-03",
		 *		  "phonenumber": "9849123453",
		 *		  "sex": "male",
		 *		  "profession": "Student",
		 *		  "address": "Kathmandu",
		 *		  "user_photo": null
		 *		}
		 * @apiSuccessExample {json} Success
		 *		HTTP/1.1 204 No Content
		 * @apiErrorExample {json} Authentication error
		 * 		HTTP/1.1 401 Unauthorized
		 */
		.put(app.auth.authenticate(), (req, res) => {
			delete req.body.role_id;
			delete req.body.created_at;


			Users.update(req.body, {
					where: {
						id: req.user.id
					}
				})
				.then(result => res.json({result: result}))
				.catch(error => {
					res.status(412).json({
						msg: error.message
					});
				});

		});
		
		app.route("/users/forgot")
			
		.post((req, res) => {
			Users.findOne({
					where: {
						phonenumber: req.body.phonenumber
					},
					attributes: ["id", "phonenumber", "email"]
				})
				// .spread(function(user) {
					.then(result => {
						if (result){
							delete req.body.id;
							delete req.body.phonenumber;
							
							var tomorrow = new Date();
							var forgot_token = require('crypto').randomBytes(32).toString('hex');
							tomorrow.setDate(tomorrow.getDate() + 1);
							tomorrow.toISOString().slice(0, 19).replace('T', ' ');
							
							req.body.forgot_token = forgot_token
							req.body.forgot_expiry = tomorrow;
							
							Users.update(req.body, {
								where:{
									id: result.id
								}
							})
							return (res.json({
								id: result.id,
								phonenumber: result.phonenumber,
								forgot_token: forgot_token
							}));
							//console.log(result.id);
						}	else{
							res.sendStatus(404);
							
						}
				
					
				//	console.log(voted);
					// if (result) {
	// 					delete req.body
	// 					req.body.
	// 					var forgot_token = require('crypto').randomBytes(32).toString('hex');
	// 					Users.update()
	// 					res.json(result);
	//
	// 				} else {
	// 					res.sendStatus(404);
	// 				}
				})
				.catch(error => {
					res.status(412).json({
						msg: error.message
					});
				});
			
		})
		
		.put((req, res) => {
			// Users.findOne({
// 					where: {
// 						id: req.body.id
// 						phonenumber: req.body.phonenumber
// 						forgot_token: req.body.forgot_token
// 					}
// 				})
// 				.then(result =>
					// if (result){
						var currentDate = new Date();
						currentDate.toISOString().slice(0, 19).replace('T', ' ');
						
						//console.log(req.body);
						//console.log(currentDate);
						
						Users.update(req.body, {
								where: {
									phonenumber: req.body.phonenumber,
									forgot_token: req.body.forgot_token,
									forgot_expiry:{
										gt: currentDate
									}
									
								}
							}).then(result => {
								if (result[0]==0){
									return (res.status(412).json({
										msg: "The token may have expired or the phonenumber does not exist in the system."
									}));
								}else{
									return (res.json({
										msg: "Successfully reset the password. You can now login with the new password."
									}));
								}
							})
					// }
				.catch(error => {
					res.status(412).json({
						msg: error.message
					});
				});

		});
		
		

};
