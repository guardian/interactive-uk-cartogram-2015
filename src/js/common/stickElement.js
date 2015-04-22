define([
    "common/utilities"
], function(
    util
) {
    'use strict';
    var d = document;

    /*function isTab () {
        var e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            w = window.innerWidth || e.clientWidth || g.clientWidth;
        return w > 660;
    }*/

    function getOffsetTop () {
        //TODO: if more than one parent has offsetTop
        var h = d.querySelector("#header"),
            f = d.querySelector("figure"),
            a = d.querySelector("#jsStickyAnchor"),
            top  = a.offsetTop; // parent

        if (h !== null) { top += f.offsetTop; } // ad 
        /*
           console.log(el.offsetTop, "[legend]");
           console.log(a.offsetTop);
           console.log(a.parentNode.offsetTop);
           console.log(f.offsetTop);
           console.log(top);
        */
        return top;
    }

    function stickElementOnScroll() {
        var el = d.querySelector("#jsSticky"),
            bg = d.querySelector("#jsStickyBackground"),
            offset = getOffsetTop();

        function stickIfNeeded() {
            var cn = el.className,
                cnSticky = "sticky",
                pageOffset = (d.documentElement && d.documentElement.scrollTop) || 
                d.body.scrollTop; //window.pageYOffset
            
            // stick or not
            if (offset <= pageOffset) {
                cn = cn + (util.isPattern(cn, cnSticky) ? "" : " " + cnSticky);
                bg.className = "sticky-bg";
            } else {
                cn = util.removePattern(cn, cnSticky);
                bg.className = "";
            }
            el.className = cn.trim();
        }

        function setOffsetTop() {
            offset = getOffsetTop();
        }

        //addEventListener
        window.addEventListener("scroll", util.throttle(stickIfNeeded, 300));
        window.addEventListener("resize", util.throttle(setOffsetTop, 300));
    }

    return stickElementOnScroll;
});
