const TIMEOUT_SHOW_FN = 180;
const DURATION_FADE = 45;
const DURATION_FADEOUT = 120;

let latestFootnoteTimeoutID = -1;

let dialogFootnote = null;

/* eslint-disable no-undef */
$(document).ready(function() {
    let footnotes = $('a[href^=\\#fn\\:]');

    footnotes.each(function() {
        let id = /#fn:(\d+)$/ig.exec(this.href)[1];

        let liPair = $('#fn\\:' + id + ' > p');

        let fn = $(this);

        fn.mouseover(function() {
            latestFootnoteTimeoutID = setTimeout(() => {
                let offset = fn.offset();
                
                dialogFootnote = $('<div>');

                dialogFootnote.addClass('fn');

                let liText = liPair.html();

                dialogFootnote.html(liText);

                $(dialogFootnote).find('a.reversefootnote').remove();

                $('body').append(dialogFootnote);

                let right = offset.left + dialogFootnote.outerWidth();

                let viewportWidth = document.documentElement.clientWidth || window.innerWidth;

                if (right > viewportWidth)
                    offset.left = Math.max(0, offset.left - (offset.left + dialogFootnote.outerWidth() - viewportWidth));

                dialogFootnote.offset({left: offset.left, top: offset.top + fn.height()});

                dialogFootnote.fadeIn(DURATION_FADE);

            }, TIMEOUT_SHOW_FN);
        });

        fn.mouseout(function() {
            clearTimeout(latestFootnoteTimeoutID);

            if (!dialogFootnote)
                return;

            let int = -1;

            int = setInterval(() => {     
                if ($('div.fn:hover').length > 0)
                    return;

                try {
                    dialogFootnote.fadeOut({
                        duration: DURATION_FADEOUT,
                        complete: () => {
                            dialogFootnote.remove();
                            dialogFootnote = null;
                        }
                    }, () => clearInterval(int));
                } catch (e) {
                    clearInterval(int);
                }
            }, 100);
        });
    });
});