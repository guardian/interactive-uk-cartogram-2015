define([
], function(
) {
    'use strict';

    /* variables */
    var termMapping = {
        "Con":      "Conservatives",
        "Lab":      "Labour",
        "LibDem":   "Lib Dem",
        "SF":       "Sinn Féin",
        //"DUP":      "DUP",
        //"Green":    "Green",
        //"Others":   "Others",
        //"PC":       "PC",
        //"SNP":      "SNP",
        "UKIP":     "Ukip",
        "National": "national",
        "Const":    "constituency and national",
        "NI":       "Northern Ireland",
        "Wales":    "Wales",
        "Scotland": "Scotland-wide"
    };

    function mapTerm(key) {
        return termMapping[key];
    }

    /* utilities: string */ 
    function isPattern(string, pattern) {
        return string.indexOf(pattern) > -1;
    }
    function removePattern(string, pattern) {
        return string.replace(pattern, "");
    }
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    /* utilities: underscore */
    // https://github.com/lodash/lodash/blob/e914b83a1b97345fbd8cb68197caf7380bea331d/vendor/underscore/underscore.js

    var now = Date.now || function() {
        return new Date().getTime();
    };

    // _.throttle
    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time. Normally, the throttled function will run
    // as much as it can, without ever going more than once per `wait` duration;
    // but if you'd like to disable the execution on the leading edge, pass
    // `{leading: false}`. To disable execution on the trailing edge, ditto.
    // A (possibly faster) way to get the current timestamp as an integer.
    var throttle = function(func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (!options) { options = {}; }
        var later = function() {
            previous = options.leading === false ? 0 : now;
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) { context = args = null; }
        };
        return function() {
            var now = now;
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


    /* componet: radio btns */
    var selectRadioBtn = function(btnParentID, btnID, defaultClass, addClass) {
        var preS = "#" + btnParentID + " ." + addClass,
            curS = "#" + btnID;
        document.querySelector(preS).className = defaultClass; 
        document.querySelector(curS).className = defaultClass + " " + addClass;
    };


    return {
        mapTerm: mapTerm,
        isPattern: isPattern,
        removePattern: removePattern,
        capitalizeFirstLetter: capitalizeFirstLetter,
        throttle: throttle,
        selectRadioBtn: selectRadioBtn
    };
});
