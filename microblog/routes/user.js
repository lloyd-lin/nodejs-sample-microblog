
/*
 * GET users listing.
 */
module.exports = function(app) {
	app.get('/test', function (req,res) {
		res.render('list',{title:'UserList' , item:[1,'lin','wang']});
	});
};