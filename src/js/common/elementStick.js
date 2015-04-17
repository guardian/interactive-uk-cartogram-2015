define([
    "common/utilities"
], function(
    util
) {
    'use strict';

    function isTab () {
        var d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            w = window.innerWidth || e.clientWidth || g.clientWidth;
        return w > 660;
    }

    function getOffsetTop (el, isTab) {
        //TODO: if more than one parent has offsetTop
        var h = document.querySelector("#header"),
            f = document.querySelector("figure"),
            a = document.querySelector("#jsStickyAnchor"),
            top  = a.offsetTop;

        if (h !== null) { top += f.offsetTop/*179*/; } //remove magic number: ad + nav g! 
        //top += isTab ? 79 : 30;         //remove magic number: nav tabs
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
        var el = document.querySelector("#jsSticky"),
            offset = getOffsetTop(el, isTab());

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

        function setOffsetTop() {
            offset = getOffsetTop(el, isTab());
        }

        //addEventListener
        window.addEventListener("scroll", util.throttle(stickIfNeeded, 300));
        window.addEventListener("resize", util.throttle(setOffsetTop, 300));
    }

    return {
        render: stickElementOnScroll
    };
});
