/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
	const Roles = sequelize.define('Roles', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		classMethods: {
			associate: (models) => {
				Roles.hasOne(models.Users);
			}
		}
	});
	return Roles;
};
