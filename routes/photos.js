import multer from 'multer';
import fs from 'fs';

// function validatePhoto(req, res, next) {
//   // The file does not exist, something bad happened
  // if (!req.files.photo) {
  //   res.statusCode = 400;
  //   return res.json({
  //     msg: 'File failed to upload'
  //   });
  // }
//   // The file was determined to be too large
  // if (req.files.photo.truncated) {
  //   res.statusCode = 400;
  //   return res.json({
  //     msg: 'File too large'
  //   });
  // }
// }

module.exports = app => {
	const Issues = app.db.models.Issues;
	const Photos = app.db.models.Photos;
	// function fileFilter (req, file, cb){
// 	  var type = file.mimetype;
// 	  var typeArray = type.split("/");
// 	  if (typeArray[0] == "video" || typeArray[0] == "image") {
// 	    cb(null, true);
// 	  }else {
// 	    cb(null, false);
// 	  }
// 	}
	
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
		// ,
		// fileFilter: function (req, file, cb) {
// 			console.log(file.mimetype);
		    // if (file.mimetype !== 'image/png') {
// 		        req.fileValidationError = 'goes wrong on the mimetype';
// 				return cb(null, false, new Error('goes wrong on the mimetype'));
// 		    }
// 			cb(null, true);
		  // }
		  ,
		  limits: {
		      files: 2,
		      fileSize: 2 * 1024 * 1024 // 2mb, in bytes
		    }
	});
	
	
	var upload = multer({storage: mult}).fields([{
		name:'image1', maxCount:1
	},{
		name:'image2', maxCount:1
	}]);
	  
app.route("/issues/:id/photos")
	/**
	 * @api {post} /issues/:id/vote Vote on an issue
	 * @apiGroup Vote
	 * @apiPermission user
	 * @apiHeader {String} Authorization Token of authenticated user
	 * @apiHeaderExample {json} Header
	 * 		{"Authorization": "JWT abc.xyz.123.gfh"}
	 * @apiParam {id} id Issue Id
	 * @apiSuccess {String=created,deleted} status Vote status: created or deleted
	 * @apiSuccessExample {json} Success on creating vote
	 * 		HTTP/1.1 200 OK
	 *		  {
	 *		      "status": "created"
	 *		  }
	 * @apiSuccessExample {json} Success on deleting vote
	 * 		HTTP/1.1 200 OK
	 *		  {
	 *		      "status": "deleted"
	 *		  }
	 * @apiErrorExample {json} Vote error
	 * 		HTTP/1.1 412 Precondition Failed
	 * @apiErrorExample {json} Authentication error
	 * 		HTTP/1.1 401 Unauthorized
	 */
	.post(app.auth.authenticate(), (req, res) => {
		//req.body.user_id = req.user.id;
		//Check if the logged in user's ID is equal to the ID of the user that created the issue, otherwise permission denied.
		//if (req.user.id == )
	    // if (!req.file.image) {
   //   	      res.statusCode = 400;
   //   	      return res.json({
   //   	        msg: 'File failed to upload'
   //   	      });
   //   	    }
   //   	    if (req.file.image.truncated) {
   //   	      res.statusCode = 400;
   //   	      return res.json({
   //   	        msg: 'File too large'
   //   	      });
   //   	    }
  //
   // if (err){
//    	console.log('Error')
//    }

upload(req, res, function (err) {
	console.log(req.files);
	var status = ""
	
	
	
	// req.files.forEach(function(item){
	
		if ('image1' in req.files){
  	 	 if (req.files.image1[0].mimetype !== 'image/png'){
	   		fs.unlinkSync(req.files.image1[0].path);
			status = "Some of the files were not uploaded.";
	    		//res.status(412).json({msg: "Not png file." })
	   	}
	}
	if ('image2' in req.files){
 	 	if (req.files.image2[0].mimetype !== 'image/png'){
   		fs.unlinkSync(req.files.image2[0].path);
		status = "Some of the files were not uploaded.";
    		//res.status(412).json({msg: "Not png file." })
   	}
}
	 // });
	
	//
	 req.body.issue_id = parseInt(req.params.id);
	 console.log(req.body.issue_id);
	 console.log(req.body);
	 var request;
	 app.db.sequelize.Promise.all([
		 //1 is default image
		 req.body.photo = 'image1' in req.files ? req.files.image1[0].path: 1,
		 Photos.create(req.body)
		 	
		 ,
			 //2 is default image
		 req.body.photo = 'image2' in req.files ? req.files.image2[0].path: 2,
		 Photos.create(req.body)
		 
		 
		 ]).spread(function(result, count) {
			 if (status!=""){
	 			 	 return res.json({
	 					 msg: status
					 });
	 			 }else{
					 return res.json({
						 msg: "Upload successful." 
					 });
	 			 }
			
			 
		 }).catch(error => {
				res.status(412).json({
					msg: status ? status: error.message
				});
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
	
	// if(req.fileValidationError) {
// 	              return res.end(req.fileValidationError);
// 	        }
    // Everything went fine
  })
		//req.body.issue_id = req.params.id;
		//console.log(req.body);
		// console.log(req.file);
		// return res.json(req.body);
		
	
	
};