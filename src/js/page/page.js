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
        var doc = document;
        dataMap.forEach(function(d) { 
            if (doc.querySelector("#" + d.id) !== null) {
                doc.querySelector("#" + d.id + " .js-title").textContent = d.title;
                doc.querySelector("#" + d.id + " .js-gloss").textContent = d.gloss;
            }
        });

        /* component */
        doc.querySelector(".js-btn-expand").addEventListener("click", onExpand, false);
        doc.querySelector(".js-btn-collapse").addEventListener("click", onExpand, false);
    }


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


    // component: expand or collapse
    function onExpand() {
        var el = document.querySelector(".js-expand"),
            cn = el.className;
        
        if (isPattern(cn, "hide")) {
            el.className = removePattern(cn, " hide") + " show"; 
        } else if (isPattern(cn, "show")) {
            el.className = removePattern(cn, " show") + " hide"; 
        }
    }
    // component: social?
    // ...


    return {
        render: render
    };
});