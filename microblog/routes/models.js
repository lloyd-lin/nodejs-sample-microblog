
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	userid: String,
	name: String,
	password: String
	});

var PostSchema = new Schema ({
	userid: String,
	content: String,
	time: Date
	});
	
	exports.User= mongoose.model('User',UserSchema);
	exports.Post= mongoose.model('Post',PostSchema);