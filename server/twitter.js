var Twitter = require('twitter'),
	db = require('./db');

var client = new Twitter({
  	consumer_key: 'KqKBQ8Ub85i9AyhDzos1WtAur',
  	consumer_secret: 'iThxY0G4rlvvFygv4JHqfW109MtaBmofVGyRyGhfrr0X98sOon',
  	access_token_key: '583739599-0RO9b6YmEbWNlNbio9YCTr89Ah7ifGg6pUbw7hFd',
  	access_token_secret: 'zx756CBUzdTcoTvi6l3qQlD1oaigsb59g3olLfXVT2imW'
});

module.exports = {

	init: function(){
		this._getRecentTweets();
		this._initStream();
	},

	_saveTweet: function(tweetDetails){
		db.saveTweet(tweetDetails, function(err){
	  		if(err){
	  			console.log('Error while saving tweet id: '+tweetDetails.id);
		  		throw err;
	  		} else {
	  			console.log('Saved tweet id: '+tweetDetails.id);
	  		}
	  	});
	},

	_initStream: function(){
		var self = this;

		//@kvendrik: 583739599
		//@krijnenbeebie: 225063281
		client.stream('statuses/filter', { follow: '583739599, 225063281', track: '#formandfunction' }, function(stream) {
		  	stream.on('data', function(tweetDetails) {
		  		console.log('Stream new tweet id: '+tweetDetails.id);
		    	self._saveTweet(tweetDetails);
		  	});

		  	stream.on('error', function(error) {
		    	throw error;
		  	});
		});
	},

	_getRecentTweets: function(){
		var self = this;

		var callback = function(error, tweets, response){
		   	tweets.statuses.forEach(function(tweetDetails, idx){
		   		self._saveTweet(tweetDetails);
		   	});
		};

		client.get('search/tweets', { q: 'from:kvendrik+#formandfunction', count: 50 }, callback);
		client.get('search/tweets', { q: 'from:krijnenbeebie+#formandfunction', count: 50 }, callback);
	},
	
};