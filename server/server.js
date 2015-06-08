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
		app.get('/', function(req, res){
			res.json({
		        success: true,
		        count: null,
		  		message: 'Welcome to the Form and Function API',
		  		data: {
                    endpoints: {
                        tweets: '/tweets'
                    }
                }
		  	});
		});

		app.get('/tweets', function(req, res){
			db.getTweets(function(err, tweets){
				if(err){
					res.json({
				        success: false,
				        count: 0,
				  		message: 'an error occured',
				  		data: null
				  	});
				  	throw err;
				} else {
					res.json({
				        success: true,
				        count: Object.keys(tweets).length,
				  		message: null,
				  		data: tweets
				  	});
				}
			}, req.query);
		});

		// app.post('/tweets', function(req, res){
		//   	db.saveTweet(req.body, function(err){
		//   		if(err){
		//   			res.json({
		// 	        	success: false,
		// 	  			message: 'an error occured'
		// 	  		});
		// 	  		throw err;	
		//   		} else {
		// 	  		res.json({
		// 		        success: true,
		// 		  		message: 'tweet saved'
		// 		  	});
		// 	  	}
		//   	});
		// });
	}

};