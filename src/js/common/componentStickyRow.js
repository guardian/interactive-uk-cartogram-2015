define([
], function(
) {
    'use strict';

    // _.throttle from underscore.js
    // https://github.com/lodash/lodash/blob/e914b83a1b97345fbd8cb68197caf7380bea331d/vendor/underscore/underscore.js
    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time. Normally, the throttled function will run
    // as much as it can, without ever going more than once per `wait` duration;
    // but if you'd like to disable the execution on the leading edge, pass
    // `{leading: false}`. To disable execution on the trailing edge, ditto.
    // A (possibly faster) way to get the current timestamp as an integer.
    var now = Date.now || function() {
        return new Date().getTime();
        };

    var throttle = function(func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (!options) { options = {}; }
        var later = function() {
            previous = options.leading === false ? 0 : now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) { context = args = null; }
        };
        return function() {
            var now = now();
            if (!previous && options.leading === false) { previous = now; }
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) { context = args = null; }
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    };


    function stickElementOnScroll() {
        var el = document.querySelector("#stickyRow"),
            offset = el.offsetTop;

        window.onscroll = throttle(stickIfNeeded, 100);

        function stickIfNeeded() {
            if (offset <= window.pageYOffset) {
                d3.select(el).classed("l-stick", true);
            } else {
                d3.select(el).classed("l-stick", false);
            }
        }
    }
    return {
        render: stickElementOnScroll
    };
});
