var mongoose = require('mongoose');

module.exports = {

    init: function(){
        mongoose.connect('mongodb://127.0.0.1'+(process.env.MONGO_PORT ? ':'+process.env.MONGO_PORT : '')+'/form-and-function');
        this._Tweet = mongoose.model('Tweet', {
            details: Object
        });
    },

    getTweets: function(callback, options){
        options = options || {};

        var contructQuery = function(queryObj){
            var q = this._Tweet.find(queryObj);

            if(options.limit){
                q = q.limit(options.limit);
            }

            if(options.skip){
                q = q.skip(options.skip);
            }

            q = q.sort({ 'details.created_at': -1 });

            return q;
        }.bind(this);

        var result = {},
            q = contructQuery({ 'details.user.screen_name': 'kvendrik' });

        q.exec(function(err, tweets) {
            result.kvendrik = tweets;

            q = contructQuery({ 'details.user.screen_name': 'krijnenbeebie' });
            q.exec(function(err, tweets) {
                result.krijnenbeebie = tweets;
                callback(err, result);
            });
        });
    },

    saveTweet: function(details, callback){
        var Tweet = this._Tweet;

        Tweet.count({ 'details.id': details.id }, function(err, count){
            //check if tweet doesn't already exist in db
            if(count > 0){
                //tweet already exists in db
                callback({
                    message: 'tweet already exists in db'
                });
            } else {
                var tweet = new Tweet({
                    details: details
                });
                tweet.save(callback);
            }
        });
    },

    removeTweet: function(details, callback){
        var Tweet = this._Tweet;

        Tweet.count({ 'details.id': details.id }, function(err, count){
            //check if tweet exist in db
            if(count > 0){
                //tweet exists in db
                Tweet.remove({ 'details.id': details.id }, callback);
            } else {
                callback({
                    message: 'tweet doesn\'t exists in db'
                });
            }
        });
    }

};