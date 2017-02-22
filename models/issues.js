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
		address: {
			type: DataTypes.STRING,
			allowNull: false
		},
		solved: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		visibility: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
		anon: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	}, {
		classMethods: {
			associate: (models) => {
				Issues.belongsTo(models.Users);
				Issues.belongsTo(models.Categories);
				Issues.hasMany(models.Comments);
				Issues.hasMany(models.Photos);
				Issues.belongsToMany(models.Users, {
					as: 'Vote',
					through: models.Votes
				});
			}
		},
		instanceMethods: {
			toJSON: function() {
				var values = this.get();

				if (this.Vote) {
					if (this.Vote[0]) {
						values.votes = this.Vote[0].dataValues.count;
					} else {
						values.votes = 0;
					}
					delete values.Vote;
				}
				return values;
			}
		}
	});
	return Issues;
};
