var mongoose = require('mongoose');

module.exports = {

    init: function(){
        mongoose.connect('mongodb://localhost/form-and-function');
        this._Tweet = mongoose.model('Tweet', {
            details: Object
        });
    },

    getAllTweets: function(callback){
        var Tweet = this._Tweet;

        server.get('/tweets', function(req, res) {
            Tweet.find({}, function(err, tweets) {
                callback(err, tweets);
            });
        });
    },

    saveTweet: function(details, callback){
        var tweet = new this._Tweet({
            details: details
        });
        tweet.save(callback);
    }

};