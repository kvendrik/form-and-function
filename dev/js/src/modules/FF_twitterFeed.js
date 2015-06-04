(function($, FF, undefined) {
    'use strict';

    FF.twitterFeed = {
        init: function(){
            this._bindEvents();
        },

        _bindEvents: function(){
            this._msgTemplate = $('#message-template').html();
            this._getTweets();
        },

        _getTweets: function(){
            var self = this;

            $('[data-feed]').each(function(){
                var $this = $(this);

                $.ajax({
                    type: 'POST',
                    url: '../php/twitter-api/getjson.php',
                    dataType: 'json',
                    data: {
                        query: 'from:kvendrik',
                        limit: 20//+%23wistjedat
                    },
                    success: function(res){
                        console.log(res);
                        self._handleTweet.call(self, res.statuses, $this[0]);
                    }
                });
            });
        },

        _parseEntities: function(entitiesArray, template, options){
            for(var key in entitiesArray){
                if(entitiesArray.hasOwnProperty(key)){

                    var details = entitiesArray[key];
                    template = template.replace(options.prefix+details[options.contentKey], '<a href="http://twitter.com/'+options.prefix+details[options.contentKey]+'">'+options.prefix+details[options.contentKey]+'</a>');

                }
            }

            return template;
        },

        _parseMentions: function(mentionsArray, template){
            return template = this._parseEntities(mentionsArray, template, {
                contentKey: 'screen_name',
                prefix: '@'
            });
        },

        _handleTweet: function(statuses, wrapper){
            var frag = document.createDocumentFragment();

            for(var i = 0, statusesL = statuses.length; i < statusesL; i++){
                var obj = statuses[i],
                    template = this._msgTemplate;

                for(var key in obj){
                    if(obj.hasOwnProperty(key)){
                        template = template.replace('{{'+key+'}}', obj[key]);
                    }
                }

                template = this._parseMentions(obj.entities.user_mentions, template);

                frag.appendChild($(template)[0]);
            }

            wrapper.appendChild(frag);
        }
    };

    FF.twitterFeed.init();

}(jQuery, window.FF = window.FF || {}));
