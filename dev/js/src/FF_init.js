(function($, FF, undefined) {
    'use strict';

    FF.init = {
        init: function(){
            this.initDirectives();
        },
        initDirectives: function() {

            $('[data-toggle-class]').click(function(e){
                e.preventDefault();

                var $this = $(this),
                    $target = $($this.data('toggle-class-target'));

                $target.toggleClass($this.data('toggle-class'));
            });

        }
    };

    FF.init.init();

}(jQuery, window.FF = window.FF || {}));
