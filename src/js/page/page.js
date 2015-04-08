define([
], function(
) {
    'use strict';
    
    function render(data) {
        /* date */
        var dataMap = data.filter(function(d) {
            return isPattern(d.component, "map-");
        }).map(function(d) {
            // add html ids to data
            d.id = "js" + capitalizeFirstLetter(removePattern(d.component, "map-"));
            return d;
        });
        //console.log(dataMap);
        
        /* view */
        dataMap.forEach(function(d) { 
            if (document.querySelector("#" + d.id) !== null) {
                document.querySelector("#" + d.id + " .js-title").textContent = d.title;
                document.querySelector("#" + d.id + " .js-gloss").textContent = d.gloss;
            }
        });
    }

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
        render: render
    };
});
