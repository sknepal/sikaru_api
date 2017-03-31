import multer from 'multer';
import fs from 'fs';

	
	var allowed = true;
	var delete_allowed = true;
module.exports = app => {
	const Issues = app.db.models.Issues;
	const Users = app.db.models.Users;
	const Photos = app.db.models.Photos;
	
    var mult = multer.diskStorage({
		destination: './uploads/issues/',
		filename: function(req, file, cb) {
			var fileName = file.originalname;
    		fileName = fileName.replace(/\W+/g, '-').toLowerCase();
			//console.log(file);
			var newName = fileName+ '_' + Date.now();
			cb(null, newName);
    		//return filename + '_' + Date.now();
			
  		}
	});
	
	
	var upload = multer({
		storage: mult, 
		limits: {
		      files: 2,
		      fileSize: 2097152 // 2mb, in bytes
		    }
		}).fields([{
		name:'image1', maxCount:1
	},{
		name:'image2', maxCount:1
	}]);
	  
app.route("/issues/:id/photos")
	/**
	 * @api {post} /issues/:id/photos Upload photos to an issue
	 * @apiGroup Photo
	 * @apiPermission user
	 * @apiHeader {String} Authorization Token of authenticated user
	 * @apiHeaderExample {json} Header
	 * 		{"Authorization": "JWT abc.xyz.123.gfh"}
	 * @apiParam {id} id Issue Id
	 * @apiSuccess {String} msg Success Message
	 * @apiSuccessExample {json} Success on uploading photos
	 * 		HTTP/1.1 200 OK
	 *		  {
	 *		      "msg": "Upload successful."
	 *		  }
	 * @apiSuccessExample {json} Success on uploading
	 * 		HTTP/1.1 200 OK
	 *		  {
	 *		      "status": "deleted"
	 *		  }
	 * @apiErrorExample {json} Upload error
	 * 		HTTP/1.1 412 Precondition Failed
	 * @apiErrorExample {json} Authentication error
	 * 		HTTP/1.1 401 Unauthorized
	 * @apiErrorExample {json} File does not exist error
	 *		HTTP/1.1 400
	 *		  {
	 *		      "msg": "File failed to upload"
	 *		  }
	 * @apiErrorExample {json} File size exceed error
	 *		HTTP/1.1 400
	 *		  {
	 *		      "msg": "File too large"
	 *		  }
	 * @apiErrorExample {json} Some files ignored error
	 *		HTTP/1.1 400
	 *		  {
	 *		      "msg": "Some of the files were not uploaded as the file format is not supported."
	 *		  }
	 */
	
	.post(app.auth.authenticate(), (req, res) => {
		
		Issues.findOne({
			include: [{
				model: Users,
				attributes: ["id"],
				duplicating: false
			}],
			where: {
				id: req.params.id
			}
		}).then(
			
			function(result) {
				var user_id = result ? result.user_id : null;
				console.log("Issue's User ID: " + user_id);
				
				if (user_id == req.user.id){
					allowed = true;
					console.log("Yep");
					console.log(allowed);
				}else{
					allowed = false;
					console.log(allowed);
		   		   	// return res.write(result);
				}
			 }
			 
		)
			// result =>
// 			user_id = result.user_id
// 			check_permission(user_id) )
		  .catch(error => {
			  return res.end(error);
			});
		
			// console.log(user_id);
	// 			if (user_id == req.user.id){
	// 				console.log('Alright');
	// 			}else{
	// 				console.log('Not alright');
	// 			}
		
		//req.body.user_id = req.user.id;
		//Check if the logged in user's ID is equal to the ID of the user that created the issue, otherwise permission denied.
		//if (req.user.id == )
		console.log("User ID: " + req.user.id);
		
		
		if (allowed==true){
   upload(req, res, function (err) {
	 //console.log(req.files);
	var status1 = "";
	var status2 = "";
   

	
	
   if (err){
	  
				   if (err.code == "LIMIT_FILE_SIZE"){
			  					//    	return res.end.json({
			// 	msg: "File size of " + err.field + "is large."
			// });
			return res.end(JSON.stringify({msg: "File size of " + err.field + " is large."}));

			('image1' in req.files)?fs.unlinkSync(req.files.image1[0].path):null;
			('image2' in req.files)?fs.unlinkSync(req.files.image2[0].path):null;
		
				   }else{

				   	('image1' in req.files)?fs.unlinkSync(req.files.image1[0].path):null;
				   	('image2' in req.files)?fs.unlinkSync(req.files.image2[0].path):null;
   		   	return res.status(412).json({
					msg: err.code
				});
			}
   }
	var valid_image_file = [true, true];
	// req.files.forEach(function(item){
	
		if ('image1' in req.files){
		  
	
	 	 	if (!(
				(req.files.image1[0].mimetype=='image/png')||
				(req.files.image1[0].mimetype=='image/jpg')||
				(req.files.image1[0].mimetype=='image/gif')||
				(req.files.image1[0].mimetype=='image/bmp')||
				(req.files.image1[0].mimetype=='image/tiff')||
				(req.files.image1[0].mimetype=='image/jpeg')
			   ))
			   {			 
	   		fs.unlinkSync(req.files.image1[0].path);
			status1 = "The file format of image1 is not supported.";
			valid_image_file[0] = false;
	    		//res.status(412).json({msg: "Not png file." })
	   	}
	}
	if ('image2' in req.files){
	
 	 	if (!(
			(req.files.image2[0].mimetype=='image/png')||
			(req.files.image2[0].mimetype=='image/jpg')||
			(req.files.image2[0].mimetype=='image/gif')||
			(req.files.image2[0].mimetype=='image/bmp')||
			(req.files.image2[0].mimetype=='image/tiff')||
			(req.files.image2[0].mimetype=='image/jpeg')
		   ))
		{
   		fs.unlinkSync(req.files.image2[0].path);
		status2 = "The file format of image2 is not supported.";
		valid_image_file[1] = false;
    		//res.status(412).json({msg: "Not png file." })
   	}
}
	 // });
	
	//
	 req.body.issue_id = parseInt(req.params.id);
	 // console.log(req.body.issue_id);
 // 	 console.log(req.body);
	 var operation;
	 app.db.sequelize.Promise.all([
		 //1 is default image
		 
		 req.body.photo = ('image1' in req.files && valid_image_file[0]) ? req.files.image1[0].path: 1,
		 (req.body.photo!=2 && req.body.photo!=1 && req.body.photo!=null)? Photos.create(req.body): null
		 ,
			 //2 is default image
		 req.body.photo = ('image2' in req.files && valid_image_file[1]) ? req.files.image2[0].path: 2,
		 (req.body.photo!=1 && req.body.photo!=null && req.body.photo!=2)? Photos.create(req.body): null,
		
		 
		 
		 ]).spread(function(result, count) {
			 console.log(result);
			 console.log(count);
			 if (status1!="" || status2!=""){
				 
				 if (status1!="" && status2!=""){
	 			 	 return res.json({
	 					 msg: "The file format of both images is not supported."
					 });
				 }else{
				 	return res.json({
				 		msg: status1 + status2
				 	});
				 }
	 			 }else{
					 return res.json({
						 msg: "Upload successful." 
					 });
	 			 }
			
			 
		 }).catch(error => {
			 // ('image1' in req.files) ? fs.unlinkSync(req.files.image1[0].path): null;
	 //  			 ('image2' in req.files) ? fs.unlinkSync(req.files.image2[0].path): null;
				// res.status(412).json({
	// 				msg: error.message
	// 			});
	('image1' in req.files)?fs.unlinkSync(req.files.image1[0].path):null;
	('image2' in req.files)?fs.unlinkSync(req.files.image2[0].path):null;
				
				return res.end(JSON.stringify({msg: "Error. Try again later."}));
			});
			
			
	// console.log(status);
// 	req.body.photo = req.files.image1[0];
// 	console.log(req.body);

	//  Photos.create(req.body)
	// .then(result => res.json(result))
	// .catch(error => {
	// 	fs.unlinkSync(req.file.path);
	// res.status(412).json({
	// 	msg: status
	// });
	//
	// })
	
// }
	
	
});
}	else{
	return res.end(JSON.stringify({msg: "Error. Try again later."}));
}
	// if(req.fileValidationError) {
// 	              return res.end(req.fileValidationError);
// 	        }
    // Everything went fine
  });
  
  app.route("/photos/:image")
  .get((req, res) => {
	//req.body.user_id = req.user.id;
	

	var image = req.params.image;
	//console.log(image);
	
    var options = {
		root: './',
      dotfiles: 'deny',
      headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
      }
    };
	
    res.sendFile(image, options, function (err) {
       if (err) {
		   var msg = (err.statusCode == 404)? "File does not exist" : err;
		    
         return  res.json({
						 msg: msg
					 });
					 
					 
       } else {
         console.log('Sent:', image);
       }
     });
	
	
	// Photos.findAll({
	// 	where: {
	// 			photo: image
	// 		},
	// 		limit: 1
	// 	 })
	// 	.then(result =>  res.sendFile('public/img/background.png'))
	// 	.catch(error => {
	// 		res.status(412).json({
	// 			msg: error.message
	// 		});
	// 	});
  });
  
  app.route("/photos")
  
.delete(app.auth.authenticate(), (req, res) => { // check role
	
	
	var issue_id = req.body.issue_id;
	var photo = req.body.image_name;
	
		Issues.findOne({
			where: {
				id: issue_id
			}
		}).then(
			
			function(result) {
				var user_id = result ? result.user_id : null;
				console.log("Issue's User ID: " + user_id);
				
				if (user_id == req.user.id){
					delete_allowed = true;
					console.log("Delete authorized.")
				
 //
					
					// allowed = true;
// 					console.log("Yep");
// 					console.log(allowed);
				}else{
					delete_allowed = false;
					//res.end("Delete unauthorized.")
					// allowed = false;
// 					console.log(allowed);
		   		   	// return res.write(result);
				}
			 }
			 
		)
		  .catch(error => {
			  return res.end(error);
			});
		
			if (delete_allowed ==  true){
					
			Photos.destroy({
				where:{
					issue_id: issue_id,
					photo: photo
				}
			}).then(result =>  {
					if (result == 1) {
						fs.unlinkSync('./' + photo);
						res.sendStatus(204);
					} else {
						return res.sendStatus(412);
					}
				}
			).catch(err=>{
				//err.code == 'ENOENT'
				// console.log(err.code);
// 				msg = (err.statusCode == 404) ? "File does not exist. It may have already been deleted." : err;
//
				res.status(412).json({
					msg: err
							});
			})
		}else{
			res.end(JSON.stringify({msg: "Error. You don't own the post."}));
		}
			
    
	// Photos.destroy({
// 			where: {
// 				photo: req.body.image_name,
// 				user_id: req.user.id
// 			}
// 		})
// 		.then(result => {
// 			if (result == 1) {
// 				res.sendStatus(204);
// 			} else {
// 				return res.sendStatus(412);
// 			}
// 		})
// 		.catch(error => {
// 			res.status(412).json({
// 				msg: error.message
// 			});
// 		});
});
  
		//req.body.issue_id = req.params.id;
		//console.log(req.body);
		// console.log(req.file);
		// return res.json(req.body);
		
	
	
};