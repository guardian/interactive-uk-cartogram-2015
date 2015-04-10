define([
], function(
) {
    'use strict';

    // utilities: string 
    function isPattern(string, pattern) {
        return string.indexOf(pattern) > -1;
    }
    function removePattern(string, pattern) {
        return string.replace(pattern, "");
    }
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
     
    return {
        isPattern: isPattern,
        removePattern: removePattern,
        capitalizeFirstLetter: capitalizeFirstLetter
    };
});
