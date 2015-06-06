// TODO:
//1. open stream
//2. on new tweet save to mongo
//3. on req to endpoint, get tweets from mongo

var twitter = require('./server/twitter'),
	server = require('./server/server'),
    db = require('./server/db');

db.init();
server.init();
twitter.init();