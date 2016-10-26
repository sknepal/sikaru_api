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
      allowNull: false// ,
      // references: {
//         model: 'category',
//         key: 'id'
//       }
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false// ,
      // references: {
 //        model: 'user',
 //        key: 'id'
 //      }
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
			  Issues.hasMany(models.Comments);
		  }
	  }
  });
  return Issues;
};
