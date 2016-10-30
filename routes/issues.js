module.exports = app => {
	//exports.sequelize = sequelize;
   const Issues = app.db.models.Issues;
   const Votes = app.db.models.Votes;
   const Users = app.db.models.Users;
   const Categories = app.db.models.Categories;
  // const Votes  = app.db.models.Votes;
   app.route("/issues")
   	   //.all(app.auth.authenticate())
       .get((req, res) => {
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
   
  //var Votes = app.db.models.Votes;
  console.log(criteria);
  //user_id: req.user.id
  //exclude: ['address'],
          Issues.findAll({
			//  attributes: {include:[[app.db.sequelize.fn('COUNT', app.db.sequelize.col('Vote.id')), 'Count']]},
			//  attributes: {include: [[app.db.sequelize.fn('COUNT', app.db.sequelize.col('Vote.id')), 'Votes_Count']]},
			//  group: [app.db.sequelize.col('id')],
			  group: ['Issues.id'],
			 // attributes:[[app.db.sequelize.fn('COUNT', app.db.sequelize.col('issue_id')), 'count']]
			 //  attributes: {include:[[app.db.sequelize.fn('COUNT', app.db.sequelize.col('id')), 'count']] },
			  
			  
			  //attributes: [[app.db.sequelize.fn('COUNT', app.db.sequelize.col('Vote.id')), 'count']],
			  include:[ 
				  {model: Users, as: 'Vote', attributes: [[app.db.sequelize.fn('COUNT', app.db.sequelize.col('Vote.id')), 'count']], through: { attributes:[] }, duplicating:false  },
				  {model: Users, attributes: ["firstName", "lastName","user_photo"], duplicating: false}, 
				  {model: Categories, attributes:[ 'title'], duplicating: false},
				//  duplicating: false
			  //, attributes: {include: [[app.db.sequelize.fn('COUNT', 'issue_id'), 'count']]}, through: {attributes:[] }
		 ],
		   
		 //attributes: {include: ['*']},
		 //attributes:[[app.db.sequelize.fn('COUNT', app.db.sequelize.col('user_id')), 'count']],
		// attributes:  [[app.db.sequelize.fn('COUNT', app.db.sequelize.col('Votes.user_id')), 'count']],
			  			where: criteria,
		// required:true
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
			  
			  // var result = result.toJSON();
  // 			//  console.log(result.Vote);
  // 			  // console.log(result.Vote[0].count);
  // 			  if (result.Vote[0]){
  // 			  	result.votes = result.Vote[0].count;
  // 			  	delete result.Vote;
  // 			}
			  
			 
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
	   .get(app.auth.authenticate(),(req,res) => {
		  // voted = 0;
		app.db.sequelize.Promise.all([
		   Issues.findOne({
			   include:[  
				  {model: Users, as: 'Vote', attributes: [[app.db.sequelize.fn('COUNT', app.db.sequelize.col('Vote.id')), 'count']], through: {attributes:[]}, duplicating:false },
				  {model: Users, attributes: ["firstName", "lastName","user_photo"], duplicating: false}, 
				  {model: Categories, attributes:[ 'title'], duplicating: false}],
			   where: {id: req.params.id} 
		   }),
	//	   .then(function(result){
			   //var result = result.toJSON();
			   //console.log(results);
			         //do something with results
			         //you can also take the results to make another query and return the promise.
			   
			Votes.count({ where: {issue_id: req.params.id, user_id: req.user.id} }),
			  ]).spread(function(result, count){
				  console.log(result);
				//  console.log(count);
				  var result = result.toJSON();
//
// 				  if (result.Vote[0]){
// 				  	result.votes = result.Vote[0].count;
// 				  	delete result.Vote;
// 				}
//
 				  result.user_vote = count;
				  return res.json(result);
			  })         
			  //   }).then(function(results) {
			         //do something else
					 //result["Voted"] = results;
					 //res.json(result);
				//	 console.log(result);
				//	 return results;
			 //    })
	//	console.log("Outside" + voted);
	// 					result = result.toJSON();
				//	result.voted = 1;
	// 					//result["Voted"] = c;
	// 					//result.dataValues.voted = c;
	// 					//console.log(values);
	// 					//delete values.User;
	// 					//result.voted = {voted: 'true'};
	// 				  console.log("There are " + c + " projects with an id greater than 25.")
 				//});
				//console.log(voted);
	 	    	//	res.json(result);
		    //	}
				
		//	})
		//})
				// Issues.findOne({
// 	 			   include:[
// 	 				  {model: Users, as: 'Vote', attributes: {include: [[app.db.sequelize.fn('COUNT', app.db.sequelize.col('Vote.id')), 'count']] }, through: { where: {Votes.user_id==}}, duplicating:false  },
// 	 				  {model: Users, attributes: ["firstName", "lastName","user_photo"], duplicating: false},
// 	 				  {model: Categories, attributes:[ 'title'], duplicating: false}],
// 	 			   where: {id: req.params.id}
// 				})

		    
		  //  })
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
			   Votes.findOrCreate({where: {user_id: req.body.user_id, issue_id: req.body.issue_id}})
			   // .spread(function(user, created) {
  //       		   console.log(user.get({
  //         			 	plain: true
  //       		   }))
  //       		   console.log(created);
  // 				   res.json(user);
  // 			   }
 // .then(result=> res.json({voted: result[1]}))
  .spread(function(user, voted) {
	  if (voted){
		  return (res.json({status: 'created'}));
	  }else{
   	   		Votes.destroy({where: {
		   	 	issue_id: req.params.id,
		   	 	user_id: req.user.id
	   	 	}});
		  return (res.json({status: 'deleted'}));
	  }
   })
			  //  .then(result => res.json(result))
			    .catch(error => {
			    	res.status(412).json({msg: error.message});
			    });
	   })
	   
	   .delete(app.auth.authenticate(), (req, res) => { // check role
	   	   Votes.destroy({where: {
			   issue_id: req.params.id,
			   user_id: req.user.id
		   }})
		    .then(result => res.sendStatus(204))
		    .catch(error => {
		    	res.status(412).json({msg: error.message});
		    });
	   });
	   
};
