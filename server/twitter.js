var Twitter = require('twitter'),
	db = require('./db'),
	logger = require('./logger');

var client = new Twitter({
  	consumer_key: 'KqKBQ8Ub85i9AyhDzos1WtAur',
  	consumer_secret: 'iThxY0G4rlvvFygv4JHqfW109MtaBmofVGyRyGhfrr0X98sOon',
  	access_token_key: '583739599-0RO9b6YmEbWNlNbio9YCTr89Ah7ifGg6pUbw7hFd',
  	access_token_secret: 'zx756CBUzdTcoTvi6l3qQlD1oaigsb59g3olLfXVT2imW'
});

module.exports = {

	init: function(){
		this._getRecentTweets(50);
		this._initStream();
	},

	_saveTweet: function(tweetDetails){
		db.saveTweet(tweetDetails, function(err){
	  		if(err){
	  			logger.error('Error while saving tweet');
	  			logger.warn(JSON.stringify({
	  				id_str: tweetDetails.id_str,
	  				msg: err.message
	  			}));
	  		} else {
	  			logger.success('Saved tweet');
	  			logger.warn(JSON.stringify({
	  				id_str: tweetDetails.id_str
	  			}));
	  		}
	  	});
	},

	_initStream: function(){
		var self = this;

		//@kvendrik: 583739599
		//@krijnenbeebie: 225063281
		client.stream('statuses/filter', { follow: '583739599, 225063281', track: '#foafu' }, function(stream) {
		  	stream.on('data', function(details) {

		  		//check if its a tweet
		  		if(details.text && details.text.indexOf('#foafu') !== -1){
			  		logger.log('Stream new tweet\n"'+details.text+'"');
			  		logger.warn(JSON.stringify({
			  			id_str: details.id_str
			  		}));
			    	self._saveTweet(details);
		    	}

		    	//check if its a deleted tweet
		    	if(details.delete){
		    		logger.log('Stream deleted tweet');
		    		details = details.delete.status;

			  		logger.warn(JSON.stringify({
			  			id_str: details.id_str
			  		}));

			    	db.removeTweet(details, function(err){
			    		if(err){
				  			logger.error('Error while removing tweet');
				  			logger.warn(JSON.stringify({
				  				id_str: details.id_str,
				  				msg: err.message
				  			}));
				  		} else {
				  			logger.success('Removed tweet');
				  			logger.warn(JSON.stringify({
				  				id_str: details.id_str
				  			}));
				  		}
			    	});
		    	}

		  	});

		  	stream.on('error', function(error){
		    	throw error;
		  	});
		});
	},

	_getRecentTweets: function(count){
		var self = this;

		var callback = function(err, tweets, res){
			if(err){
				throw err;
			} else {
			   	tweets.statuses.forEach(function(tweetDetails, idx){
			   		self._saveTweet(tweetDetails);
			   	});
		   	}
		};

		client.get('search/tweets', { q: 'from:kvendrik+#foafu', count: count }, callback);
		client.get('search/tweets', { q: 'from:krijnenbeebie+#foafu', count: count }, callback);
	},

};