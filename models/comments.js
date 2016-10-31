/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
	const Comments = sequelize.define('Comments', {
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
		},
		comment: {
			type: DataTypes.TEXT,
			allowNull: false
		}
	}, {
		classMethods: {
			associate: (models) => {
				Comments.belongsTo(models.Issues);
				Comments.belongsTo(models.Users);
			}
		}
	});
	return Comments;
};
