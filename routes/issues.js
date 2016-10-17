module.exports = app => {
   const Issues = app.db.models.Issues;
  
   app.route("/issues")
   	   .all(app.auth.authenticate())
       .get((req, res) => {
          Issues.findAll({
			  where: {user_id: req.user.id}
          })
		   .then(result => res.json(result))
		   .catch(error => {
			   res.status(412).json({msg: error.message});
		   });
       })
	   .post((req, res) => {
		   req.body.user_id = req.user.id;
		   Issues.create(req.body)
		    .then(result => res.json(result))
		    .catch(error => {
		    	res.status(412).json({msg: error.message});
		    });
   	   });
	   
   app.route("/issues/:id")
	   .all(app.auth.authenticate())
	   .get((req,res) => {
		   Issues.findOne({where: {
			   id: req.params.id,
		       user_id: req.user.id
		   }})
		    .then(result => {
		    	if(result){
		    		res.json(result);
		    	}else{
		    		res.sendStatus(404);
		    	}
		    })
			.catch(error => {
				res.status(412).json({msg: error.message});
			});
	   })
	   .put((req, res) => {
	   	   Issues.update(req.body, {where: {
			   id: req.params.id,
			   user_id: req.user.id
		   }})
		    .then(result => res.sendStatus(204))
		    .catch(error => {
		    	res.status(412).json({msg: error.message});
		    });
	   })
	   .delete((req, res) => {
	   	   Issues.destroy({where: {
			   id: req.params.id,
			   user_id: req.user.id
		   }})
		    .then(result => res.sendStatus(204))
		    .catch(error => {
		    	res.status(412).json({msg: error.message});
		    });
	   });
};
