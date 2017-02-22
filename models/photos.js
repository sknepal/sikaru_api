/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
	const Photos = sequelize.define('Photos', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		issue_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'Issues',
				key: 'id'
			}
		},
		photo: {
			type: DataTypes.STRING,
			allowNull: true
		}
	},{
		classMethods: {
			associate: (models) => {
				Photos.belongsTo(models.Issues);
			}
		}
	});
	return Photos;
};
