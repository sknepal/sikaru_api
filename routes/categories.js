module.exports = app => {
	const Categories = app.db.models.Categories;

	app.route("/categories")
		/**
		 * @api {get} /categories List the categories
		 * @apiGroup Category
		 * @apiPermission none
		 * @apiSuccess {Object[]} categories Categories list
		 * @apiSuccess {Number} id Category id
		 * @apiSuccess {String} title Category title
		 * @apiSuccess {String} description Category description
		 * @apiSuccess {Date} created_at Category created date
		 * @apiSuccess {Date} updated_at Category updated date
		 * @apiSuccessExample {json} Success
		 * 		HTTP/1.1 200 OK
		 *		[
		 *		  {
		 *		    "id": 1,
		 *		    "title": "Road",
		 *		    "description": "Road problems",
		 *		    "created_at": "2016-10-27T07:02:31.000Z",
		 *		    "updated_at": "2016-10-27T07:02:31.000Z"
		 *		  }
		 *		]
		 * @apiErrorExample {json} Categories not found error
		 * 		HTTP/1.1 404 Not Found
		 * @apiErrorExample {json} List error
		 * 		HTTP/1.1 412 Precondition Failed
		 */
		.get((req, res) => {
			Categories.findAll()
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
		});
};
