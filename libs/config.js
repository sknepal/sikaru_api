import logger from "./logger.js"
module.exports = {
	database: "d3lq2ne64fa8uf",
	username: "kefuxprmscbhcj",
	password: "86f0e0bb594e5a46648e4ee47220eec32231977b2f01d628c3a2949c5f2b087a",
	params: {
		host: "ec2-184-72-216-69.compute-1.amazonaws.com",
		port: 5432,
		dialect: "postgres",
		// pool: {
	// 	    max: 5,
	// 	    min: 0,
	// 	    idle: 10000
	// 	  },
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
