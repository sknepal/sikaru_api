/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Votes = sequelize.define('Votes', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    issue_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'Issues',
        key: 'id'
      }
  	}
}
  , {
  	classMethods: {
		associate: (models) => {
		    // Votes.belongsTo(models.Issues);
// 		    Votes.belongsTo(models.Users);
		}
	}
  });
  return Votes;
};
