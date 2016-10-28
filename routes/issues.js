module.exports = app => {
	//exports.sequelize = sequelize;
   const Issues = app.db.models.Issues;
   const Votes = app.db.models.Votes;
  // const Votes  = app.db.models.Votes;
   app.route("/issues")
   	   //.all(app.auth.authenticate())
       .get(app.auth.authenticate(),(req, res) => {
		   //console.log(req.user.id);
		   var criteria = {};
		  
		   
		   if (req.query.q){
 			   var expr = '%' + req.query.q + '%';
 			    criteria.$or = [
 			    	{title: {$like: expr}},
 					{description: {$like: expr}},
 					{address: {$like: expr}}
 			    ];
 		   }
		   
		   if (req.query.cat){
			   criteria.category_id = parseInt(req.query.cat);
		   }
		   //  console.log(criteria);
		   		   //
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

		   
		   // if (req.query.sortBy){
  //
  // 		   }
  //console.log(date);
  // User.findAll({
  //   include: [{
  //     model: Project,
  //       through: {
  //         attributes: ['createdAt', 'startedAt', 'finishedAt']
  //           where: {completed: true}
  //       }
  //    }]
  //  });
   
  var Votes = app.db.models.Votes;
  console.log(criteria);
  //user_id: req.user.id
          Issues.findAll({
			  include:[ {model: app.db.models.Users, attributes: ["firstName", "lastName","user_photo"]}, 
			  			{model: app.db.models.Categories, attributes:[ 'title']},
			  { model: app.db.models.Users, as: 'Vote', attributes: [[app.db.sequelize.fn('COUNT', 'id'), 'count']], through: {attributes: []}
			  			
		   }],
			  			where: criteria,
		   attributes: { exclude: ['address'] },
			    		limit: 10
							// through: {
// 						 } }]//,
			  // through: {Votes}
			 // {
//   				  model: votings//,
				  //through: { where:{ issue_id: 1} }//,
  				  // include: [{ app.db.models.Votes, as:'votings'}]
      			  // }]
				 
				  //, //,
				  // through: { models.Votes }
			 // , // app.db.models.Users, include: [app.db.models.Votes] }],
			  // where: criteria,
 // 			  limit: 10
          })
		  .then(function(result){
			  //var response = res.json(result);
			  //console.log(response);
			  // var found = false;
  // 			  loop1:
  // 			  for (var i in result.rows){
  // 				  loop2:
  // 				  for (var j in result.rows[i].Votings){
  // 					  loop3:
  // 					  if (result.rows[i].Votings[j].Votes.user_id == req.user.id){
  // 						  found = true;
  // 						  console.log(result.rows[i].Votings);
  // 						  break loop2;
  //
  // 				    }
  // 				  }
  // 			  }
			  
			 
			  
			  //var entry = result[0];
			  //console.log(entry);
			  return res.json(result);
			  // result => res.json(result))
			  
		  })
		   .catch(error => {
			   res.status(412).json({msg: error.message});
		   });
       })
	   
   	// .post((req, res) => {
//    		Users.create(req.body)
//    		   .then(result => res.json(result))
//    		   .catch(error => {
//    		   	   res.status(412).json({ msg: error.message});
//    		   });
		   
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
			   include:[{ model: app.db.models.Users}],
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
	   
	   
   //
   // app.route("/issues/:id/user")
   // 	   //.all(app.auth.authenticate())
   // 	   .get((req,res) => {
   // 		   //Users.findOne({ include: [ model: Author, where: { 'lastName': 'Testerson' } ] });
   // 		   Issues.findOne({
   // 			   include:[{ model: app.db.models.Users, where: {id: req.params.id} }]
   // 		   })
   // 		    .then(result => {
   // 		    	if(result){
   // 		    		res.json(result['User']);
   // 		    	}else{
   // 		    		res.sendStatus(404);
   // 		    	}
   // 		    })
   // 			.catch(error => {
   // 				res.status(412).json({msg: error.message});
   // 			});
   // 	   });
	   
   // .post(app.auth.authenticate(), (req, res) => {
// 	   req.body.user_id = req.user.id;
// 	   Issues.create(req.body)
// 	    .then(result => res.json(result))
// 	    .catch(error => {
// 	    	res.status(412).json({msg: error.message});
// 	    });
//    });
   
   
	   app.route("/issues/:id/vote")
	   .post(app.auth.authenticate(), (req, res) =>{
		   req.body.user_id = req.user.id;
			   req.body.issue_id = req.params.id;
			   Votes.create(req.body)
			    .then(result => res.json(result))
			    .catch(error => {
			    	res.status(412).json({msg: error.message});
			    });
	   })
	   .delete(app.auth.authenticate(), (req, res) => { // check role
	   	   Votes.destroy({where: {
			   id: req.params.id,
			   user_id: req.user.id
		   }})
		    .then(result => res.sendStatus(204))
		    .catch(error => {
		    	res.status(412).json({msg: error.message});
		    });
	   });
	   
};
