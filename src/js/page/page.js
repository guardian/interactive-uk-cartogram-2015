define([
    'd3',
    'common/utilities'
], function(
    d3,
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

        console.log("!!!!!",dataNow)

        var datetime_format=d3.time.format("%d/%m/%Y %H:%M:%S")

        var lastupdate_date=datetime_format.parse(dataNow.currentdate+" "+dataNow.currenttime);            

        // last update
        var cur = new Date(dataNow.currentdate + " " + dataNow.currenttime),
            str = cur.toString(),
            txt = "Last update on " + (d3.time.format("%b %d %Y %H:%M")(lastupdate_date)+" "+(!lastupdate_date.getTimezoneOffset()?"GMT":"BST"));
        
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
