(function($, FF, undefined) {
    'use strict';

    FF.init = {
        init: function(){
            this._initDirectives();
        },

        _initDirectives: function() {
            var $body = $('body');

            $('[data-toggle-class]').click(function(e){
                e.preventDefault();

                var $this = $(this),
                    $target = $($this.data('toggle-class-target'));

                $target.toggleClass($this.data('toggle-class'));
            });

            $body.on('click', '.message__img', function(e){
                e.preventDefault();
                $(this).toggleClass('message__img--expanded');
            });
        }
    };

    FF.init.init();

}(jQuery, window.FF = window.FF || {}));
