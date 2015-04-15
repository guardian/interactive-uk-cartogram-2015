define([
    "common/utilities"
], function(
    util
) {
    'use strict';

    function getOffsetTop (el) {
        //TODO: if more than one parent has offsetTop
        var f = document.querySelector("#header"),
            p = el.parentNode,
            top  = el.offsetTop;
        if (f !== null) { top += 179; } //remove fix number: ad + nav g! 
        if (p !== null) { top += 79; }  //remove fix number: nav tabs
        /*
        console.log(el);
        console.log(el.offsetTop);
        console.log(el.offsetParent);
        console.log(el.offsetParent.offsetTop);
        console.log(top);
        */
        return top;
    }

    function stickElementOnScroll() {
        var el = document.querySelector("#jsSticky"),
            offset = getOffsetTop(el);
        
        function stickIfNeeded() {
            var cn = el.className,
                cnSticky = "sticky",
                pageOffset = (document.documentElement && document.documentElement.scrollTop) || 
                              document.body.scrollTop; //window.pageYOffset
            if (offset <= pageOffset) {
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
    }

    return {
        render: stickElementOnScroll
    };
});
