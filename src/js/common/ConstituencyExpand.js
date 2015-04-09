define([
    'common/utilities',
    'json!data/constituency.json'
], function(
    util,
    data
) {
    'use strict';
        
    // data
    var dataObj = {};
    data.constituencies.forEach(function(d) {
        dataObj[d.ons_id] = {
            name: d.name,
            mp: d[2010].candidates.filter(function(c) {
                    return c.party === d[2010].winningParty;
                }).map(function(mp) {
                    return mp.name + ", " + mp.party;
                })[0],
            candidates: 
                d[2015].candidates.map(function(c) {
                    return c.name + ", " + c.party;
                })
        };
    });
    //console.log(data);
    //console.log(dataObj);
    //party dic 
    
    function updateData(code, name, p2010, p2015, src) {
        var li,
            ul = document.querySelector("#jsCandidates"), 
            p = document.querySelector("#jsInfo");
        
        document.querySelector("#jsName").textContent = name;   
        document.querySelector("#jsMP").textContent = dataObj[code].mp;   
        
        // empty ul
        if (ul.hasChildNodes()) { 
            while (ul.firstChild) {
                ul.removeChild(ul.firstChild);
        }}
        dataObj[code].candidates.forEach(function(d) {
            li = document.createElement("li");
            li.appendChild(document.createTextNode(d)); 
            ul.appendChild(li);
        });
        
        if (p2010 === p2015) {
            p.textContent = p2010 + " will win the seat again.";
        } else {
            p.textContent = p2010 + " will lose the seat to the " + p2015 + " base on an overall " + src + " swing.";   
        }
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
