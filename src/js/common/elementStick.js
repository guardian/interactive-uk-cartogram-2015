define([
    "common/utilities"
], function(
    util
) {
    'use strict';

    function getOffsetTop (el) {
        //TODO: if more than one parent had offsetTop
        return  el.offsetParent.offsetTop + el.offsetTop;
    }

    function stickElementOnScroll() {
        var el = document.querySelector("#jsSticky"),
            offset = getOffsetTop(el);

        function stickIfNeeded() {
            var cn = el.className,
                cnSticky = "sticky";
            if (offset <= window.pageYOffset) {
                cn  = cn + (util.isPattern(cn, cnSticky) ? "" : " " + cnSticky);
            } else {
                cn = util.removePattern(cn, cnSticky);
            }
            el.className = cn.trim();
        }

        function getOffsetAndStickIfNeeded() {
            offset = getOffsetTop(el);
            stickIfNeeded();
        }

        //addEventListener
        window.addEventListener("scroll", util.throttle(stickIfNeeded, 300));
        window.addEventListener("resize", util.throttle(getOffsetAndStickIfNeeded, 300));
        //window.onscroll = util.throttle(stickIfNeeded, 300);
        //window.onresize = util.throttle(getOffsetAndStickIfNeeded, 300);
    }

    return {
        render: stickElementOnScroll
    };
});
