module.exports = app => {
   const Comments = app.db.models.Comments;
   
app.route("/comments")
   
   .post(app.auth.authenticate(), (req, res) => {
	   req.body.user_id = req.user.id;
	   Comments.create(req.body)
	    .then(result => res.json(result))
	    .catch(error => {
	    	res.status(412).json({msg: error.message});
	    });
   });
   
   app.route("/comments/:id")
   .put(app.auth.authenticate(), (req, res) => {
   	   Comments.update(req.body, {where: {
		   id: req.params.id,
		   user_id: req.user.id
	   }})
	    .then(result => res.sendStatus(204))
	    .catch(error => {
	    	res.status(412).json({msg: error.message});
	    });
   })
   .delete(app.auth.authenticate(), (req, res) => { // check role
   	   Comments.destroy({where: {
		   id: req.params.id,
		   user_id: req.user.id
	   }})
	    .then(result => res.sendStatus(204))
	    .catch(error => {
	    	res.status(412).json({msg: error.message});
	    });
	});
  
};
   