var express = require('express'),
	bodyParser = require('body-parser'),
	db = require('./db'),
	app = express();

module.exports = {

	init: function(){
		this._setMiddleware();
		this._setEndpoints();
		app.listen(1337);
	},

	_setMiddleware: function(){
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({
		  	extended: true
		}));
	},

	_setEndpoints: function(){
		app.get('/tweets', function(req, res){
			db.getAllTweets(function(err, tweets){
				if(err){
					res.json({
				        success: false,
				        data: null,
				  		message: 'an error occured'
				  	});
				} else {
					res.json({
				        success: true,
				  		data: tweets,
				  		message: null
				  	});
				  	throw err;
				}
			});
		});

		app.post('/tweets', function(req, res){
		  	db.saveTweet(req.body, function(err){
		  		if(err){
		  			res.json({
			        	success: false,
			  			message: 'an error occured'
			  		});
			  		throw err;	
		  		} else {
			  		res.json({
				        success: true,
				  		message: 'tweet saved'
				  	});
			  	}
		  	});
		});
	}

};