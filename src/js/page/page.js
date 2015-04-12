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
        //console.log(dataText);

        
        /* content */
        var doc = document;

        // add last update
        //TODO: check time format
        var cur = new Date(dataNow.currentdate + " " + dataNow.currenttime),
            str = cur.toString(),
            txt = "Last update on " + str.slice(0, 21) + " " + str.slice(-4, -1);

        doc.querySelector("#jsLastUpdate").textContent = txt;

        // add text
        dataText.forEach(function(d) { 
            if (doc.querySelector("#" + d.id) !== null) {
                doc.querySelector("#" + d.id + " .js-title").textContent = d.title;
                doc.querySelector("#" + d.id + " .js-gloss").textContent = d.gloss;
            }
        });

        // add btns to standfirst
        var e = document.querySelector("#jsTop .js-gloss"),
            s = dataText[0].gloss; 
        
        var sfm = s.match(/\[(\w|\s)*\]/g),
            sfs = s.split(/\[|\]/);

        //console.log(sfm);
        //console.log(sfs);

        e.textContent = "";
        sfs.forEach(function(s) {
            var n1, n2,
            flag = false;
            sfm.forEach(function(m) {
                var str = m.slice(1, -1);
                if (s === str) {
                    flag = true;
                }
            });
            if (flag) {
                n2 = document.createTextNode(s);
                n1 = document.createElement("button");
                n1.appendChild(n2);
            } else {
                n1 = document.createTextNode(s);
            }
            e.appendChild(n1); 
        });
        //console.log(e);
    }

    return {
        render: render
    };
});
