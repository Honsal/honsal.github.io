/* eslint-disable no-undef */
$(document).ready(function () {
    $('a[href^=http],a[href^=\\/\\/]').each(function() {
        if (this.href.indexOf(location.hostname) === -1) {

            let _this = $(this);

            _this.attr({
                target: '_blank'
            });

            let anchorExternal = $('<a class="external" href="' + this.href + '" target="_blank"></a>');

            _this.after(anchorExternal);

            _this.mouseover(function() {
                if (!anchorExternal.hasClass('enter'))
                    anchorExternal.addClass('enter');
            });

            _this.mouseleave(function() {
                if (anchorExternal.hasClass('enter'))
                    anchorExternal.removeClass('enter');
            });

            $(anchorExternal).mouseover(function() {
                if (!_this.hasClass('enter'))
                    _this.addClass('enter');
                if (!anchorExternal.hasClass('enter'))
                    anchorExternal.addClass('enter');
            });

            $(anchorExternal).mouseleave(function() {
                if (_this.hasClass('enter'))
                    _this.removeClass('enter');

                if (anchorExternal.hasClass('enter'))
                    anchorExternal.removeClass('enter');
            });
        }
    });
});
