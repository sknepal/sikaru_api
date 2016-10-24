module.exports = app => {
   const Issues = app.db.models.Issues;
  
   app.route("/issues")
   	   //.all(app.auth.authenticate())
       .get((req, res) => {
		   //console.log(req.user.id);
		   var criteria = { };
		   if (req.query.q){
 			   var expr = '%' + req.query.q + '%'
 			    criteria.$or = [
 			    	{title: {$like: expr}},
 					{description: {$like: expr}},
 					{address: {$like: expr}}
 			    ]
 		   }

		   if (req.query.cat){
			   criteria.category_id = parseInt(req.query.cat)
		   }
		   
		   // if (req.query.sortBy){
  //
  // 		   }
  
  console.log(criteria);
  //user_id: req.user.id
          Issues.findAll({
			  include:[{ model: app.db.models.Users, where: criteria }]
          })
		   .then(result => res.json(result))
		   .catch(error => {
			   res.status(412).json({msg: error.message});
		   });
       })
	   .post(app.auth.authenticate(), (req, res) => {
		   req.body.user_id = req.user.id;
		   Issues.create(req.body)
		    .then(result => res.json(result))
		    .catch(error => {
		    	res.status(412).json({msg: error.message});
		    });
   	   });
	   
   app.route("/issues/:id")
	   //.all(app.auth.authenticate())
	   .get((req,res) => {
		   Issues.findOne({
			   include:[{ model: app.db.models.Users, where: {id: req.params.id} }]
		   })
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
	   .put(app.auth.authenticate(), (req, res) => {
	   	   Issues.update(req.body, {where: {
			   id: req.params.id,
			   user_id: req.user.id
		   }})
		    .then(result => res.sendStatus(204))
		    .catch(error => {
		    	res.status(412).json({msg: error.message});
		    });
	   })
	   .delete(app.auth.authenticate(), (req, res) => { // check role
	   	   Issues.destroy({where: {
			   id: req.params.id,
			   user_id: req.user.id
		   }})
		    .then(result => res.sendStatus(204))
		    .catch(error => {
		    	res.status(412).json({msg: error.message});
		    });
	   });
	   
	   
	   
   app.route("/issues/:id/user")
	   //.all(app.auth.authenticate())
	   .get((req,res) => {
		   //Users.findOne({ include: [ model: Author, where: { 'lastName': 'Testerson' } ] });
		   Issues.findOne({
			   include:[{ model: app.db.models.Users, where: {id: req.params.id} }]
		   })
		    .then(result => {
		    	if(result){
		    		res.json(result['User']);
		    	}else{
		    		res.sendStatus(404);
		    	}
		    })
			.catch(error => {
				res.status(412).json({msg: error.message});
			});
	   });   
};
