/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Issues = sequelize.define('Issues', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    category_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    posted_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    solved: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    visibility: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    anon: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
	  classMethods:{
		  associate: (models) => {
			  Issues.belongsTo(models.Users);
			  Issues.belongsTo(models.Categories);
			  Issues.hasMany(models.Comments);
			  Issues.belongsToMany(models.Users, {as: 'Vote', through:models.Votes});
			 // Issues.belongsToMany(models.Users, {through: models.Votes});// , foreignKey: 'issue_id'});
		  }
	  }
	  ,
 	  instanceMethods: {
 	    toJSON: function () {
 	      var values = this.get();
		 // for (var k in values){
			//  console.log(values.Vote);
			 
			//if (this.Vote)
			
			  if (this.Vote){
				  if (this.Vote[0]){
	  			  	values.votes = this.Vote[0].dataValues.count;
	  				  console.log(this.Vote[0].dataValues.count);
	  			  }else{
	  				  values.votes = 0;
	  			  }
	  			 delete values.Vote;
			 }
			 
			//  if (values[k].Vote[0]){
			  //	console.log(values[k].Vote[0].count);
			
		 // }
 	      // if (this.Vote) {
// 			  values.votes = this.Vote.count;
// 			  delete values.Vote;
//  	     //   values.icon = this.Menu.icon;
//  	      }
//delete values.Vote;
//console.log(values);
 	      return values;
 	    }
 	  }
  });
  return Issues;
};
