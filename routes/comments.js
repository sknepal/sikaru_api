module.exports = app => {
	const Comments = app.db.models.Comments;

	app.route("/comments")


	/**
	 * @api {post} /comments Comment on an issue
	 * @apiGroup Comment
	 * @apiPermission user
	 * @apiHeader {String} Authorization Token of authenticated user
	 * @apiHeaderExample {json} Header
	 * 		{"Authorization": "JWT abc.xyz.123.gfh"}
	 * @apiParam (Body Parameter) {id} issue_id Issue Id
	 * @apiParam (Body Parameter) {String} comment Comment contents
	 * @apiParamExample {json} Input
	 * 		HTTP/1.1 200 OK
	 *		{
	 *		  "issue_id": 1,
	 *		  "comment": "Manholes should be covered"
	 *		}
	 * @apiSuccess {Number} id Comment Id
	 * @apiSuccess {Number} user_id Commentor's Id
	 * @apiSuccess {Number} issue_id Issue Id
	 * @apiSuccess {String} comment Comment contents
	 * @apiSuccess {Date} updated_at Comment update date
	 * @apiSuccess {Date} created_at Comment created date
	 * @apiSuccessExample {json} Success
	 * 		HTTP/1.1 200 OK
	 *		{
	 *		  "id": 1,
	 *		  "user_id": 1,
	 *		  "issue_id": 1,
	 *		  "comment": "Manholes should be covered",
	 *		  "updated_at": "2016-10-30T18:49:42.000Z",
	 *		  "created_at": "2016-10-30T18:49:42.000Z"
	 *		}
	 * @apiErrorExample {json} Comment error
	 * 		HTTP/1.1 412 Precondition Failed
	 * @apiErrorExample {json} Authentication error
	 * 		HTTP/1.1 401 Unauthorized
	 */
	.post(app.auth.authenticate(), (req, res) => {
		req.body.user_id = req.user.id;
		Comments.create(req.body)
			.then(result => res.json(result))
			.catch(error => {
				res.status(412).json({
					msg: error.message
				});
			});
	});

	app.route("/comments/:id")
		/**
		 * @api {put} /comments/:id Update a comment by the authenticated user
		 * @apiGroup Comment
		 * @apiPermission user
		 * @apiHeader {String} Authorization Token of authenticated user
		 * @apiHeaderExample {json} Header
		 * 		{"Authorization": "JWT abc.xyz.123.gfh"}
		 * @apiParam {id} id Comment Id
		 * @apiParam (Body Parameter) {String} comment Comment contents
		 * @apiParamExample {json} Input
		 * 		HTTP/1.1 200 OK
		 *		{
		 *		  "comment": "Manholes should be covered"
		 *		}
		 * @apiSuccessExample {json} Success
		 *		HTTP/1.1 204 No Content
		 * @apiErrorExample {json} Comment error
		 * 		HTTP/1.1 412 Precondition Failed
		 * @apiErrorExample {json} Authentication error
		 * 		HTTP/1.1 401 Unauthorized
		 */
		.put(app.auth.authenticate(), (req, res) => {
			delete req.body.issue_id;
			Comments.update(req.body, {
					where: {
						id: req.params.id,
						user_id: req.user.id
					}
				})
				.then(result => {
					if (result >= 1) {
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
		 * @api {delete} /comments/:id Delete a comment by the authenticated user
		 * @apiGroup Comment
		 * @apiPermission user
		 * @apiHeader {String} Authorization Token of authenticated user
		 * @apiHeaderExample {json} Header
		 * 		{"Authorization": "JWT abc.xyz.123.gfh"}
		 * @apiParam {id} id Comment Id
		 * @apiSuccessExample {json} Success
		 *		HTTP/1.1 204 No Content
		 * @apiErrorExample {json} Delete error
		 * 		HTTP/1.1 412 Precondition Failed
		 * @apiErrorExample {json} Authentication error
		 * 		HTTP/1.1 401 Unauthorized
		 */
		.delete(app.auth.authenticate(), (req, res) => {
			Comments.destroy({
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

};
