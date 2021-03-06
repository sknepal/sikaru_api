/* jshint indent: 2 */

import bcrypt from "bcrypt";

module.exports = function(sequelize, DataTypes) {
	const Users = sequelize.define('Users', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate:{
                isEmail : true
            }
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		dob: {
			type: DataTypes.STRING,
			allowNull: true
		},
		phonenumber: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		sex: {
			type: DataTypes.STRING,
			allowNull: true
		},
		profession: {
			type: DataTypes.STRING,
			allowNull: true
		},
		address: {
			type: DataTypes.STRING,
			allowNull: true
		},
		user_photo: {
			type: DataTypes.STRING,
			allowNull: true
		},
		role_id: {
			type: DataTypes.INTEGER(11),
			defaultValue: 1,
			allowNull: false,
			references: {
				model: 'Roles',
				key: 'id'
			}
		},
			forgot_token: {
				type: DataTypes.STRING,
				allowNull: true
			},
			forgot_expiry:{
				type: DataTypes.DATE,
				allowNull: true
			}		
	}, {
		hooks: {
			beforeCreate: user => {
				const salt = bcrypt.genSaltSync();
				user.password = bcrypt.hashSync(user.password, salt);

			},
			beforeBulkUpdate: user =>{ 
				const salt = bcrypt.genSaltSync();
                if (user.attributes.password) {
					user.attributes.password = bcrypt.hashSync(user.attributes.password, salt);
				}
			}
		},
		classMethods: {
			associate: (models) => {
				Users.hasMany(models.Issues);
				Users.hasMany(models.Comments);
				Users.belongsToMany(models.Issues, {
					as: 'Vote',
					through: models.Votes
				});

			},
			isPassword: (encodedPassword, password) => {
				return bcrypt.compareSync(password, encodedPassword);
			}
		}
	});
	return Users;
};
