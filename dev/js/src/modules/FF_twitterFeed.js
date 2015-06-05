(function($, FF, undefined) {
    'use strict';

    FF.twitterFeed = {
        init: function(){
            this._bindEvents();
        },

        _bindEvents: function(){
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
                        query: $this.data('feed-query'),
                        limit: 20//+%23wistjedat
                    },
                    success: function(res){
                        console.log(res);
                        self._handleTweet.call(self, res.statuses, $this[0], $($this.data('feed-template')).html());
                    }
                });
            });
        },

        _parseEntityLinks: function(entitiesArray, template, options){
            for(var key in entitiesArray){
                if(entitiesArray.hasOwnProperty(key)){

                    var details = entitiesArray[key];
                    template = template.replace(options.prefix+details[options.contentKey], '<a href="http://twitter.com/'+options.prefix+details[options.contentKey]+'">'+options.prefix+details[options.contentKey]+'</a>');

                }
            }

            return template;
        },

        _parseMentions: function(mentionsArray, template){
            return template = this._parseEntityLinks(mentionsArray, template, {
                contentKey: 'screen_name',
                prefix: '@'
            });
        },

        _parseHashtags: function(hashtagsArray, template){
            return template = this._parseEntityLinks(hashtagsArray, template, {
                contentKey: 'text',
                prefix: '#'
            });
        },

        _parseUrls: function(urlsArray, template){
            var footerContents = '';

            for(var key in urlsArray){
                if(urlsArray.hasOwnProperty(key)){

                    var details = urlsArray[key];
                    template = template.replace(details.url, '');
                    footerContents += '<a href="'+details.url+'">'+details.display_url+'</a>, ';

                }
            }

            footerContents = footerContents.replace(/\,\s$/, '');

            if(footerContents !== ''){
                template = template.replace('{{footer}}', '<footer class="message__footer">'+footerContents+'</footer>');
            } else {
                template = template.replace('{{footer}}', '');
            }

            return template;
        },

        _parseMedia: function(mediaArray, template){
            if(!mediaArray){
                template = template.replace('{{media}}', '');
                return template;
            }

            var mediaContents = '';

            for(var key in mediaArray){
                if(mediaArray.hasOwnProperty(key)){

                    var details = mediaArray[key];
                    template = template.replace(details.url, '');
                    mediaContents += '<div class="message__img"><img src="'+details.media_url+'" /></div>';

                }
            }

            if(mediaContents !== ''){
                template = template.replace('{{media}}', mediaContents);
            } else {
                template = template.replace('{{media}}', '');
            }

            return template;
        },

        _handleTweet: function(statuses, wrapper, msgTemplate){

            for(var i = 0, statusesL = statuses.length; i < statusesL; i++){
                var obj = statuses[i],
                    template = msgTemplate;

                for(var key in obj){
                    if(obj.hasOwnProperty(key)){
                        template = template.replace('{{'+key+'}}', obj[key]);
                    }
                }

                template = this._parseMentions(obj.entities.user_mentions, template);
                template = this._parseHashtags(obj.entities.hashtags, template);
                template = this._parseUrls(obj.entities.urls, template);
                template = this._parseMedia(obj.entities.media, template);

                var $el = $(template);
                wrapper.appendChild($el[0]);
                setTimeout(function(){
                    this.addClass('message--visible');
                }.bind($el), 200);
            }

        }
    };

    FF.twitterFeed.init();

}(jQuery, window.FF = window.FF || {}));
