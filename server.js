// TODO:
//1. open stream
//2. on new tweet save to mongo
//3. on req to endpoint, get tweets from mongo

var Twitter = require('twitter'),
	express = require('express'),
	app = express();


app.post('/', function(req, res){
	console.log(req.body);
  	res.json({
  		success: true,
  		message: ''
  	});
});

app.listen(1337);


var client = new Twitter({
  	consumer_key: 'KqKBQ8Ub85i9AyhDzos1WtAur',
  	consumer_secret: 'iThxY0G4rlvvFygv4JHqfW109MtaBmofVGyRyGhfrr0X98sOon',
  	access_token_key: '583739599-0RO9b6YmEbWNlNbio9YCTr89Ah7ifGg6pUbw7hFd',
  	access_token_secret: 'zx756CBUzdTcoTvi6l3qQlD1oaigsb59g3olLfXVT2imW'
});

client.get('search/tweets', { q: 'from:kvendrik', count: 9 }, function(error, tweets, response){
   	console.log(tweets.statuses.length);
});


//@kvendrik: 583739599
//@krijnenbeebie: 225063281
// client.stream('statuses/filter', { follow: '583739599, 225063281' }, function(stream) {
//   	stream.on('data', function(tweet) {
//     	console.log(tweet);
//   	});

//   	stream.on('error', function(error) {
//     	throw error;
//   	});
// });