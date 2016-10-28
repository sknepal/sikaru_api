module.exports = app => {
   const Categories = app.db.models.Categories;
   
app.route("/categories")
   .get((req,res) => {
	   Categories.findAll()
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

  
app.route("/categories/:id")
   .get((req,res) => {
	   Categories.findOne({ where: {id: req.params.id} })
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
};
   