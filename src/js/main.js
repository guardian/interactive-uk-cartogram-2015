define([
    'reqwest',
    'json!data/hexagons-topo.json',
    'json!data/regions-topo.json',
    'page/page',
    'cartograms/main',
    'text!templates/appTemplate.html'
], function(
    reqwest,
    topo,
    regions,
    pageText,
    cartograms,
    templateHTML
) {
    'use strict';

    function handleRequestError(err, msg) {
        console.error('Failed: ', err, msg);
    }
    function afterRequest(resp) {
        //console.log('Finished', resp);
    }


    function init(el) {

        // DOM template
        el.innerHTML = templateHTML;

        /* View */
        var head = document.querySelector('head'),
            script = document.createElement('script');
        script.setAttribute('src','http://interactive.guim.co.uk/2015/04/election-nav/electionNav.js');
        script.setAttribute('type','text/javascript');
        head.appendChild(script);

        /* Data */
        // Load local JSON data
        //console.log(localData);

        // Load remote JSON data
        var key = '1YilVzArect3kcE1rzJvYivXkfs1oL0MLCrvC9GjPF6E',
            url = 'http://interactive.guim.co.uk/spreadsheetdata/'+key+'.json';

        reqwest({
            url: url,
            type: 'json',
            crossOrigin: true
        })
        .then(function(data) {

            /* Render */
            pageText.render(data.sheets.glosses);
            cartograms.render(data,topo,regions);

        })
        .fail(handleRequestError)
        .always(afterRequest);  
    }

    return {
        init: init
    };
});
