define([
    'common/utilities',
    'json!data/constituency.json'
], function(
    util,
    data
) {
    'use strict';

    // data
    //var max = 0, con;
    var term = util.mapTerm,
        dataObj = {};
    data.constituencies.forEach(function(d) {
        var mp = d[2010].candidates[0];
        mp.text = mp.name + ", " + mp.party;
        mp.majority = d[2010].percentageMajority;

        dataObj[d.ons_id] = {
            name: d.name,
            /*mp: d[2010].candidates.filter(function(c) {
              return c.party === d[2010].winningParty;
              }).map(function(mp) {
              return mp.name + ", " + mp.party;
              })[0],*/
            mp: mp,
            candidates: 
                d[2015].candidates.map(function(c) {
                return {
                    text: c.name + ", " + c.party,
                    link: c.url,
                    party: c.party
                };
            })
        };
        /*
        var l = d[2015].candidates.length;
        if (l > max) { 
           max = l; 
           con = d.name;
        }
        */
    });
    //console.log(data);
    //console.log(dataObj);
    //console.log(max, con);    

    function removeChildNodes(el) {
        if (el.hasChildNodes()) { 
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }
        }
    }

    function getBgColor(party) {
        var bgc = party.toLowerCase(),
            str = "lab snp green ukip libdem con dup sf sdlp pc";

        // specail cases
        //console.log(party);
        if (party === "LD") { bgc = "libdem"; } 
        if (str.indexOf(bgc) === -1) { bgc = "others"; }

        return " bgc-" + bgc;
    }

    function insertRect(party) {
        var node = document.createElement("span");
        node.className = "rect" + getBgColor(party);
        return node;
    }

    function updateData(code, name, p2010, p2015, src) {
        var a, cn1, cn2, txt, li, 
        pType = (src === "Wales") ? "polling in Wales." : term(src) + " polling",
            ul = document.querySelector("#jsCandidates"), 
            p1 = document.querySelector("#jsInfo"),
            p2 = document.querySelector("#jsMP"),
            mp = dataObj[code].mp;

        // add constituency
        document.querySelector("#jsName").textContent = name;   

        // add info
        if (p2010 === p2015) {
            p2010 = term(p2010) || p2010;
            p1.textContent = p2010 + " hold, based on " + pType;
        } else {
            p2010 = term(p2010) || p2010;
            p2015 = term(p2015) || p2015;
            p1.textContent = p2015 + " gain from " + p2010 + " based on " + pType; 
        }

        // add mp
        txt = mp.text + ", " + Math.round(mp.percentage*10)/10 + "% vote share (" + Math.round(mp.majority*10)/10 + "% majority)";
        removeChildNodes(p2); 
        p2.appendChild(insertRect(mp.party));
        p2.appendChild(document.createTextNode(txt));   
        //console.log(mp);

        // add candidates
        // empty ul
        //TODO: clone node with children and replace to improve performance
        //ul = ul.cloneNode(false);
        removeChildNodes(ul);

        dataObj[code].candidates.forEach(function(d) {
            txt = document.createTextNode(d.text);
            cn1 = insertRect(d.party);
            cn2 = txt;

            // link
            if (d.link !== undefined) {
                a = document.createElement("a");
                a.href = d.link;
                a.target = "_blank";
                a.appendChild(txt); 
                cn2 = a;
            }

            li = document.createElement("li");
            li.appendChild(cn1); 
            li.appendChild(cn2); 
            ul.appendChild(li);
        });

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
