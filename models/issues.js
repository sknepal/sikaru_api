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
  });
  return Issues;
};
