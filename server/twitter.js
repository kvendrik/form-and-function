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
	  				id: tweetDetails.id,
	  				msg: err.message
	  			}));
	  		} else {
	  			logger.success('Saved tweet');
	  			logger.log(JSON.stringify({
	  				id: tweetDetails.id
	  			}));
	  		}
	  	});
	},

	_initStream: function(){
		var self = this;

		//@kvendrik: 583739599
		//@krijnenbeebie: 225063281
		client.stream('statuses/filter', { follow: '583739599, 225063281', track: '#formandfunction' }, function(stream) {
		  	stream.on('data', function(tweetDetails) {
		  		logger.log('Stream new tweet');
		  		logger.warn(JSON.stringify({
		  			id: tweetDetails.id
		  		}));
		    	self._saveTweet(tweetDetails);
		  	});

		  	stream.on('error', function(error) {
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

		client.get('search/tweets', { q: 'from:kvendrik+#formandfunction', count: count }, callback);
		client.get('search/tweets', { q: 'from:krijnenbeebie+#formandfunction', count: count }, callback);
	},
	
};