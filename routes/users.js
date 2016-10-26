module.exports = app=>{
	const Users = app.db.models.Users;
	
	app.route("/users")
	//.all(app.auth.authenticate())
	.get((req, res) => {
	   var criteria = { };
	   if (req.query.q){
		   var expr = '%' + req.query.q + '%'
		    criteria.$or = [
		    	{firstName: {$like: expr}},
				{lastName: {$like: expr}},
				{address: {$like: expr}},
				{profession: {$like: expr}},
				{email: {$like: expr}}
		    ]
	   }
	   
	   var sortBy = req.query.sortBy ? req.query.sortBy : "created_date";
	   if (req.query.date){
	   			   var date = req.query.date;
	   	   		}

	   if (sortBy == "created_date"){
	   			   if (date){
	   				   criteria.created_at = {
	   					   $lt: date
	   				   }
	   			   }
	   }
	   
	   Users.findAll({
		   where:criteria,
		   attributes: ["id", "firstName", "lastName", "email"],
		   limit: 10
	   })
	   .then(result => res.json(result))
	   .catch(error => {
		   res.status(412).json({msg: error.message});
	   });
	})
	.delete(app.auth.authenticate(),(req, res) => {
		Users.destroy({where: {id: req.user.id} })
		   .then(result => res.sendStatus(204))
		   .catch(error => {
		   	   res.status(412).json({msg: error.message});
		   });
	})
	
	.post((req, res) => {
		Users.create(req.body)
		   .then(result => res.json(result))
		   .catch(error => {
		   	   res.status(412).json({ msg: error.message});
		   });
	});
	
	
	app.route("/users/:id")
	.get((req, res)=>{
		//var attributes_filter = [];
		//if (req.user.id){
			//console.log(req.params.id);
			//console.log(req.user.id);
	//	if (req.params.id != req.user.id){
	//		attributes_filter.push("id", "firstName", "lastName", "email")
	//	}
	//	console.log(attributes_filter)
 		   Users.findOne({
 			   where: {id: req.params.id},
			   attributes: ["id", "firstName", "lastName", "email"]
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
 	   });
	   
   	app.route("/users/:id/issues")
   	.get((req, res)=>{
		var criteria = {
			
		}
		
 	   var sortBy = req.query.sortBy ? req.query.sortBy : "created_date";
	   
 	   if (req.query.date){
 	   			   var date = req.query.date;
 	   	   		}

 	   if (sortBy == "created_date"){
 	   			   if (date){
 	   				   criteria.created_at = {
 	   					   $lt: date
 	   				   }
 	   			   }
 	   		}
	   
			console.log(criteria);
    		   Users.findAll({
				   include:[{ model: app.db.models.Issues, where: criteria, limit: 10}],
				   attributes: { exclude: ['password', 'dob', 'phonenumber', 'sex', 'profession', 'address'] },
				   where: {id: req.params.id}
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
    	   });
		   
	app.route("/users/:id/comments")
		   .get((req,res)=>{
			   var date = "";
			   if (req.query.date){
				   date = req.query.date;
			   }
			   
			   var criteria = {
				   user_id: parseInt(req.params.id),
				   created_at:{
 					   $lt: date
 				   }
			   }
			   console.log(criteria);
		Users.findAll({
			include: [{model: app.db.models.Comments, where: criteria, limit: 10}],
			where: {id: parseInt(req.params.id)},
			attributes: {exclude: ['password', 'dob', 'phonenumber', 'sex', 'profession', 'address']}
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
			
		   });
	   
	   
	   
   	app.route("/user")
   	.get(app.auth.authenticate(),(req, res)=>{
    		   Users.findOne({
    			   where: {id: req.user.id}
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
	 .put(app.auth.authenticate(),(req, res)=>{
   	   Users.update(req.body, {where: {
		   id: req.user.id
	   }})
	    .then(result => res.sendStatus(204))
	    .catch(error => {
	    	res.status(412).json({msg: error.message});
	    });
	       		
	       	   });
	   
};