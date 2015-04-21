define([
    'common/utilities',
    //'json!data/constituency_src.json'
    'json!data/constituency.json'
], function(
    util,
    //data
    dataObj
) {
    'use strict';

    var term = util.mapTerm;
    
    // data
    //var max = 0, con; 
    /*
    var dataObj = {};
    data.constituencies.forEach(function(d) {
        var mp = {}, 
            mpObj = d[2010].candidates[0];
        //mp.txt = mpObj.name + ", " + mpObj.party; //text
        mp.who = mpObj.name;                        //winner 2010
        mp.pty = mpObj.party;                       //party
        mp.per = mpObj.percentage;                  //percentage
        mp.maj = d[2010].percentageMajority;        //majority
        
        dataObj[d.ons_id] = {
            //"const": d.name,
            "mp": mp,
            /*mp_parsed: d[2010].candidates.filter(function(c) {
              return c.party === d[2010].winningParty;
              }).map(function(mp) {
              return mp.name + ", " + mp.party;
              })[0],* /
            "candi": 
                d[2015].candidates.map(function(c) {
                var url = c.url,
                    //console.log(c.url);
                    //console.log(url.slice(-4));
                    id = (url !== undefined) ? url.slice(-4) : undefined;
                return {
                    //txt: c.name + ", " + c.party,
                    who: c.name,
                    url: id,//c.url,
                    pty: c.party
                };
            })
        };
    });
    console.log(JSON.stringify(dataObj));
    */
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

    function updateData(constCode, constName, p2010, p2015, src) {
        var a, cn1, cn2, txt, li, 
        pType = (src === "Wales") ? "polling in Wales." : term(src) + " polling",
            ul = document.querySelector("#jsCandidates"), 
            p1 = document.querySelector("#jsInfo"),
            p2 = document.querySelector("#jsMP"),
            mp = dataObj[constCode].mp;

        // add constituency
        document.querySelector("#jsName").textContent = constName;   

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
        removeChildNodes(p2); 
        
        txt = mp.who + ", " + mp.pty + ", " + 
            Math.round(mp.per*10)/10 + "% vote share (" + 
            Math.round(mp.maj*10)/10 + "% majority)";
        
        p2.appendChild(insertRect(mp.pty));
        p2.appendChild(document.createTextNode(txt));   
        //console.log(mp);

        // add candidates
        // empty ul
        //TODO: clone node with children and replace to improve performance
        //ul = ul.cloneNode(false);
        removeChildNodes(ul);

        dataObj[constCode].candi.forEach(function(d) {
            txt = document.createTextNode(d.who + ", " + d.pty);
            cn1 = insertRect(d.pty);
            cn2 = txt;

            // link
            if (d.url !== undefined) {
                a = document.createElement("a");
                //a.href = d.url;
                a.href = "https://yournextmp.com/person/" + d.url;
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
