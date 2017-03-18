module.exports = app => {
	const Issues = app.db.models.Issues;
	const Votes = app.db.models.Votes;
	const Users = app.db.models.Users;
	const Categories = app.db.models.Categories;
	const Comments = app.db.models.Comments;
	const Photos = app.db.models.Photos;
	app.route("/issues")
		/**
		 * @api {get} /issues List the issues 
		 * @apiGroup Issue
		 * @apiPermission none
		 * @apiExample Example usage:
		 *     Endpoint: /issues
		 *
		 *     Query Parameters: q=road&sortBy=created_date&cat=1&date=
		 *
		 *     Example Request: /issues?q=road&sortBy=created_date&date=2016-10-30T15:17:01.000Z&cat=1
		 * @apiParam (Query Parameter) {String} [q] Search text
		 * @apiParam (Query Parameter) {String} [cat] Category Id which makes it possible to search only a specific category.
		 * @apiParam (Query Parameter) {String=created_date} [sortBy=created_date] Sort Results By
		 * @apiParam (Query Parameter) {Date} [date] Upper date limit. Issues created before this date are listed. This is also a pagination offset.
		 * @apiSuccess {Object[]} issues Issue's list
		 * @apiSuccess {Number} id Issue id
		 * @apiSuccess {Number} category_id Issue category Id
		 * @apiSuccess {Number} user_id User Id of issue creator
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
		 */

	.get((req, res) => {

		var criteria = {};


		if (req.query.q) {
			var expr = '%' + req.query.q + '%';
			criteria.$or = [{
				title: {
					$like: expr
				}
			}, {
				description: {
					$like: expr
				}
			}, {
				address: {
					$like: expr
				}
			}];
		}

		if (req.query.cat) {
			criteria.category_id = parseInt(req.query.cat);
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


		Issues.findAll({

				group: ['Issues.id', 'Vote.id', 'Photos.id'],

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
						duplicating: false
					}, {
						model: Categories,
						attributes: ['title'],
						duplicating: false
					}, {
						model: Photos,
						attributes: ['photo'],
						duplicating: false
					}

				],


				where: criteria,
				order: [
					['updated_at', 'DESC']
				],
				limit: 10

			})
			.then(function(result) {



				if (result.length >= 1) {
					var jsonString = JSON.stringify(result);

					var obj = JSON.parse(jsonString);

					obj.map(function(item) {
						if (item.anon == true) {
							item.User.firstName = "John";
							item.User.lastName = "Doe";
							item.User.user_photo = null;
							item.user_id = 0;
						}
					});

					return res.json(obj);
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
	 * @api {post} /issues Add a new issue
	 * @apiGroup Issue
	 * @apiPermission user
	 * @apiHeader {String} Authorization Token of authenticated user
	 * @apiHeaderExample {json} Header
	 * 		{"Authorization": "JWT abc.xyz.123.gfh"}
	 * @apiParam (Body Parameter) {String} title Issue title
	 * @apiParam (Body Parameter) {Number} category_id Issue category Id
	 * @apiParam (Body Parameter) {String} description Issue description
	 * @apiParam (Body Parameter) {String} address Issue address
	 * @apiParam (Body Parameter) {Boolean} [solved] Issue status
	 * @apiParam (Body Parameter) {Boolean} [visibility] Issue visibility
	 * @apiParam (Body Parameter) {Boolean} [anon] Issue creator's anonymity
	 * @apiParamExample {json} Input
	 * 		HTTP/1.1 200 OK
	 *		  {
	 *		    "title": "manholes",
	 *			"category_id": 1,
	 *		    "description": "manholes in the road that are left uncovered.",
	 *		    "address": "Kathmandu"
	 *		  }
	 * @apiSuccessExample {json} Success
	 * 		HTTP/1.1 200 OK
	 *		  {
	 *		    "id": 1,
	 *		    "title": "manholes",
	 *		    "category_id": 1,
	 *		    "user_id": 1,
	 *		    "description": "manholes in the road that are left uncovered.",
	 *		    "address": "Kathmandu",
	 *		    "solved": false,
	 *		    "visibility": false,
	 *		    "anon": false,
	 *		    "created_at": "2016-10-30T18:49:42.000Z",
	 *		    "updated_at": "2016-10-30T18:49:42.000Z"
	 *		  }
	 * @apiErrorExample {json} Add error
	 * 		HTTP/1.1 412 Precondition Failed
	 * @apiErrorExample {json} Authentication error
	 * 		HTTP/1.1 401 Unauthorized
	 */
	.post(app.auth.authenticate(), (req, res) => {
		req.body.user_id = req.user.id;
		Issues.create(req.body)
			.then(result => res.json(result))
			.catch(error => {
				res.status(412).json({
					msg: error.message
				});
			});
	});

	app.route("/issues/:id")
		/**
		 * @api {get} /issues/:id Get an issue
		 * @apiGroup Issue
		 * @apiPermission user
		 * @apiHeader {String} Authorization Token of authenticated user
		 * @apiHeaderExample {json} Header
		 * 		{"Authorization": "JWT abc.xyz.123.gfh"}
		 * @apiParam {id} id Issue Id
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
		 * @apiSuccess {Boolean} user_vote User's vote on the issue
		 * @apiSuccessExample {json} Success
		 * 		HTTP/1.1 200 OK
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
		 *		    "votes": 1,
		 *	     	"user_vote": true
		 *		  }
		 * @apiErrorExample {json} Issue not found error
		 * 		HTTP/1.1 404 Not Found
		 * @apiErrorExample {json} Find error
		 * 		HTTP/1.1 412 Precondition Failed
		 * @apiErrorExample {json} Authentication error
		 * 		HTTP/1.1 401 Unauthorized
		 */
		.get(app.auth.authenticate(), (req, res) => {

			app.db.sequelize.Promise.all([
				Issues.findOne({
					group: ['Photos.id'],
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
						duplicating: false
					}, {
						model: Categories,
						attributes: ['title'],
						duplicating: false
					}, {
						model: Photos,
						attributes: ['photo'],
						duplicating: false
					}],
					where: {
						id: req.params.id
					}
				}),


				Votes.count({
					where: {
						issue_id: req.params.id,
						user_id: req.user.id
					}
				}),
			]).spread(function(result, count) {
				if (result.id != null) {
					var result = result.toJSON();
					if (count == 1) {
						var user_vote = true;
					} else {
						var user_vote = false;
					}
					result.user_vote = user_vote;
					
					
						var jsonString = JSON.stringify(result);

						var item = JSON.parse(jsonString);

						console.log(item);
							if (item.anon == true && item.user_id!=req.user.id) {
								item.User.firstName = "John";
								item.User.lastName = "Doe";
								item.User.user_photo = null;
								item.user_id = 0;
							}

						return res.json(item);
				
					
					//return res.json(result);
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
		 * @api {put} /issues/:id Update an authenticated user's issue
		 * @apiGroup Issue
		 * @apiPermission user
		 * @apiHeader {String} Authorization Token of authenticated user
		 * @apiHeaderExample {json} Header
		 * 		{"Authorization": "JWT abc.xyz.123.gfh"}
		 * @apiParam {id} id Issue Id
		 * @apiParam (Body Parameter) {String} title Issue title
		 * @apiParam (Body Parameter) {Number} category_id Issue category Id
		 * @apiParam (Body Parameter) {String} description Issue description
		 * @apiParam (Body Parameter) {String} address Issue address
		 * @apiParam (Body Parameter) {Boolean} solved Issue status
		 * @apiParam (Body Parameter) {Boolean} visibility Issue visibility
		 * @apiParam (Body Parameter) {Boolean} anon Issue creator's anonymity
		 * @apiParamExample {json} Input
		 * 		HTTP/1.1 200 OK
		 *		  {
		 *		    "title": "manholes",
		 *			"category_id": 1,
		 *		    "description": "manholes in the road that are left uncovered.",
		 *		    "address": "Kathmandu",
		 *		    "solved": false,
		 *		    "visibility": false,
		 *		    "anon": false
		 *		  }
		 * @apiSuccessExample {json} Success
		 *		HTTP/1.1 204 No Content
		 * @apiErrorExample {json} Update error
		 * 		HTTP/1.1 412 Precondition Failed
		 * @apiErrorExample {json} Authentication error
		 *		HTTP/1.1 401 Unauthorized
		 */
		.put(app.auth.authenticate(), (req, res) => {
			Issues.update(req.body, {
					where: {
						id: req.params.id,
						user_id: req.user.id
					}
				})
				.then(result => {
					if (result == 1) {
						res.sendStatus(204);
					} else {
						res.sendStatus(412);
					}
				})
				.catch(error => {
					res.status(412).json({
						msg: error.message
					});
				});
		})
		/**
		 * @api {delete} /issues/:id Delete an issue of an authenticated user
		 * @apiGroup Issue
		 * @apiPermission user
		 * @apiHeader {String} Authorization Token of authenticated user
		 * @apiHeaderExample {json} Header
		 * 		{"Authorization": "JWT abc.xyz.123.gfh"}
		 * @apiParam {id} id Issue Id
		 * @apiSuccessExample {json} Success
		 * 		HTTP/1.1 204 No Content
		 * @apiErrorExample {json} Delete error
		 *		HTTP/1.1 412 Precondition Failed
		 * @apiErrorExample {json} Authentication error
		 * 		HTTP/1.1 401 Unauthorized
		 */
		.delete(app.auth.authenticate(), (req, res) => { // check role
			Issues.destroy({
					where: {
						id: req.params.id,
						user_id: req.user.id
					}
				})
				.then(result => {
					if (result == 1) {
						res.sendStatus(204);
					} else {
						return res.sendStatus(412);
					}
				})
				.catch(error => {
					res.status(412).json({
						msg: error.message
					});
				});
		});




	app.route("/issues/:id/vote")
		/**
		 * @api {post} /issues/:id/vote Vote on an issue
		 * @apiGroup Vote
		 * @apiPermission user
		 * @apiHeader {String} Authorization Token of authenticated user
		 * @apiHeaderExample {json} Header
		 * 		{"Authorization": "JWT abc.xyz.123.gfh"}
		 * @apiParam {id} id Issue Id
		 * @apiSuccess {String=created,deleted} status Vote status: created or deleted
		 * @apiSuccessExample {json} Success on creating vote
		 * 		HTTP/1.1 200 OK
		 *		  {
		 *		      "status": "created"
		 *		  }
		 * @apiSuccessExample {json} Success on deleting vote
		 * 		HTTP/1.1 200 OK
		 *		  {
		 *		      "status": "deleted"
		 *		  }
		 * @apiErrorExample {json} Vote error
		 * 		HTTP/1.1 412 Precondition Failed
		 * @apiErrorExample {json} Authentication error
		 * 		HTTP/1.1 401 Unauthorized
		 */
		.post(app.auth.authenticate(), (req, res) => {
			req.body.user_id = req.user.id;
			req.body.issue_id = req.params.id;
			Votes.findOrCreate({
				where: {
					user_id: req.body.user_id,
					issue_id: req.body.issue_id
				}
			})

			.spread(function(user, voted) {
				if (voted) {
					return (res.json({
						status: 'created'
					}));
				} else {
					Votes.destroy({
						where: {
							issue_id: req.params.id,
							user_id: req.user.id
						}
					});
					return (res.json({
						status: 'deleted'
					}));
				}
			})

			.catch(error => {
				res.status(412).json({
					msg: error.message
				});
			});
		});


	app.route("/issues/:id/comments")
		/**
		 * @api {get} /issues/:id/comments List the comments on an issue
		 * @apiGroup Comment
		 * @apiPermission user
		 * @apiHeader {String} Authorization Token of authenticated user
		 * @apiHeaderExample {json} Header
		 * 		{"Authorization": "JWT abc.xyz.123.gfh"}
		 * @apiParam {id} id Issue Id
		 * @apiSuccess {Number} id Comment Id
		 * @apiSuccess {Number} user_id Commentor's Id
		 * @apiSuccess {Number} issue_id Issue Id
		 * @apiSuccess {String} comment Comment contents
		 * @apiSuccess {Date} updated_at Comment update date
		 * @apiSuccess {Date} created_at Comment created date
		 * @apiSuccessExample {json} Success
		 * 		HTTP/1.1 200 OK
		 *		[
		 *			{
		 *		  		"id": 1,
		 *		  		"user_id": 1,
		 *		  		"issue_id": 1,
		 *		  		"comment": "Manholes should be covered",
		 *		  		"updated_at": "2016-10-30T18:49:42.000Z",
		 *		  		"created_at": "2016-10-30T18:49:42.000Z"
		 *			}
		 *		]
		 * @apiErrorExample {json} List error
		 * 		HTTP/1.1 412 Precondition Failed
		 * @apiErrorExample {json} Authentication error
		 * 		HTTP/1.1 401 Unauthorized
		 * @apiErrorExample {json} Comments not found error
		 * 		HTTP/1.1 404 Not Found
		 */
		.get(app.auth.authenticate(), (req, res) => {
			req.body.issue_id = req.params.id;
			Comments.findAll({
					where: {
						issue_id: req.body.issue_id
					},
					order: [
						['updated_at', 'DESC']
					]
				})
				.then(function(result) {
					if (result.length >= 1) {
						return res.json(result);
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


};
