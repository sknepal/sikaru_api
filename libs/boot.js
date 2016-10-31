module.exports = app => {
	app.db.sequelize.sync().done(() => {
		app.listen(app.get("port"), () => {
			console.log(`PStuff API - Port ${app.get("port")}`);
		});
	});
};
