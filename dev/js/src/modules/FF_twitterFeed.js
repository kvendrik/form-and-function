(function($, FF, undefined) {
    'use strict';

    var $window = $(window),
        windowHeight = $window.height(),
        documentHeight = $(document).height();

    FF.twitterFeed = {
        init: function(){
            this._$el = {
                $tweetsButton: $('.js-load-tweets'),
                $tweetsLoader: $('.js-tweets-loader')
            };

            var currTweetsOptions = this._currTweetsOptions = {
                limit: 25,
                skip: 0
            };

            this._getTweets(currTweetsOptions);
            this._bindEvents();
        },

        _bindEvents: function(){
            $window.scroll(this._checkAtBottom.bind(this));

            $('.js-load-tweets').click(function(e){
                e.preventDefault();
                this._getNextTweets();
            }.bind(this));
        },

        _checkAtBottom: function(){
            if($window.scrollTop() + windowHeight == documentHeight) {
                this._getNextTweets();
            }
        },

        _getNextTweets: function(){
            this._currTweetsOptions.skip += this._currTweetsOptions.limit;
            this._getTweets(this._currTweetsOptions);
        },

        _getTweets: function(options){
            var self = this;

            this._$el.$tweetsButton.addClass('button--hidden');
            this._$el.$tweetsLoader.removeClass('loader--hidden');

            $.ajax({
                type: 'GET',
                url: 'http://api.foafu.com/tweets',
                dataType: 'json',
                data: options,
                success: function(res){
                    if(res.count === 0){
                        self._$el.$tweetsLoader.addClass('loader--hidden');
                        return;
                    }

                    $('[data-feed]').each(function(){
                        var $this = $(this),
                            userTweets = res.data[$this.data('feed-screen-name')];

                        if(res.success){
                            self._handleTweets.apply(self, [
                                userTweets,
                                $this[0],
                                $($this.data('feed-template')).html()
                            ]);
                        } else {
                            throw new Error('an error occured while getting tweets from server');
                        }
                    });
                }
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

        _handleTweets: function(statuses, wrapper, msgTemplate){

            for(var i = 0, statusesL = statuses.length; i < statusesL; i++){
                var obj = statuses[i].details,
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

            this._$el.$tweetsButton.removeClass('button--hidden');
            this._$el.$tweetsLoader.addClass('loader--hidden');

        }
    };

    FF.twitterFeed.init();

}(jQuery, window.FF = window.FF || {}));
