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
	   
	   Users.findAll({
		   where:criteria,
		   attributes: ["id", "firstName", "lastName", "email"]
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
    		   Users.findAll({
					   include:[{ model: app.db.models.Issues, where: {id: req.params.id} }],
				   attributes: { exclude: ['password', 'dob', 'phonenumber', 'sex', 'profession', 'address'] }
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