import logger from "./logger.js"
module.exports = {
	database: "heroku_736b203e2aca3eb",
	username: "bd3ef237df9495",
	password: "2bdf3c35",
	params: {
		host: "us-cdbr-iron-east-04.cleardb.net",
		port: process.env.PORT || 3000,
		dialect: "mysql",
		logging: (sql) => {
			logger.info(`[${new Date()}] ${sql}`);
		},
		define: {
			underscored: true
		}
	},
	jwtSecret: "wed832ds$23",
	jwtSession: {
		session: false
	}
};
