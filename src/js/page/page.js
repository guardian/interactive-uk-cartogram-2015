define([
    'common/utilities'
], function(
    util
) {
    'use strict';
    
    function render(dataNow, dataGloss) {
        /* data */
        var dataText = dataGloss.filter(function(d) {
            return util.isPattern(d.component, "map-");
        }).map(function(d) {
            // add html ids to data
            d.id = "js" + util.capitalizeFirstLetter(util.removePattern(d.component, "map-"));
            return d;
        });
        //console.log(dataMap);
        
        /* view */
        var doc = document;

        // last update
        var cur = new Date(dataNow.currentdate + " " + dataNow.currenttime),
            str = cur.toString(),
            txt = "Last update on " + str.slice(0, 21) + " " + str.slice(-4, -1);
        
        //TODO: check time format
        doc.querySelector("#jsLastUpdate").textContent = txt;

        // text
        dataText.forEach(function(d) { 
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
