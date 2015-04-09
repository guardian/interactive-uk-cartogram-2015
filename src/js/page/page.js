define([
    'common/utilities'
], function(
    util
) {
    'use strict';
    
    function render(data) {
        /* data */
        var dataMap = data.filter(function(d) {
            return util.isPattern(d.component, "map-");
        }).map(function(d) {
            // add html ids to data
            d.id = "js" + util.capitalizeFirstLetter(util.removePattern(d.component, "map-"));
            return d;
        });
        //console.log(dataMap);
        
        /* view */
        var doc = document;
        dataMap.forEach(function(d) { 
            if (doc.querySelector("#" + d.id) !== null) {
                doc.querySelector("#" + d.id + " .js-title").textContent = d.title;
                doc.querySelector("#" + d.id + " .js-gloss").textContent = d.gloss;
            }
        });
    }

    return {
        render: render
    };
});
