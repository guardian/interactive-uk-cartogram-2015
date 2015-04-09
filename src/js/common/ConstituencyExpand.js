define([
    'common/utilities'
], function(
    util
) {
    'use strict';

    function updateData(con) {
        //console.log(con); 
        document.querySelector("#jsConName").textContent = con;   
        //document.querySelector("#jsConInfo").textContent = ;   
        //document.querySelector("#jsConMP").textContent = ;   
        //document.querySelector("#jsConCandidates")...   
    }

    function updateView(opt) {    
        var el = document.querySelector(".js-expand"),
            cn = el.className;

        document.querySelector(".js-btn-collapse")
                .addEventListener("click", function(){ onCollapse(el, cn); }, false);
        
        switch (opt) {
            case 0: onCollapse(el, cn); break;
            case 1: onExpand(el, cn); break;
            default: onToggle(el, cn); break;
        }
    }

    function onCollapse(el, cn) {
        el.className = util.removePattern(cn, " show") + " hide"; 
    }
    
    function onExpand(el, cn) {
        if (util.isPattern(cn, "hide")) {
            el.className = util.removePattern(cn, " hide") + " show"; 
        }
    }
    
    function onToggle(el, cn) {
        if (util.isPattern(cn, "hide")) {
            el.className = util.removePattern(cn, " hide") + " show"; 
        } else if (util.isPattern(cn, "show")) {
            el.className = util.removePattern(cn, " show") + " hide"; 
        }
    }

    return {
        updateData: updateData,
        updateView: updateView
    };
});
