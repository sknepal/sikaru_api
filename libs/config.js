module.exports = {
   database: "ps",
   username: "root",
   password: "root",
   params: {
      host: "127.0.0.1",
      port: 3306,
      dialect: "mysql",
      define: {
         underscored: true
     }
   },
   jwtSecret: "wed832ds$23",
   jwtSession: {session: false}
};
