/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
	const Categories = sequelize.define('Categories', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true
		}
	}, {
		classMethods: {
			associate: (models) => {
				Categories.hasMany(models.Issues);
			}
		}
	});
	return Categories;
};
