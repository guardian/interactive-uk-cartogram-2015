define([
    'reqwest',
    'json!data/hexagons-topo.json',
    'json!data/regions-topo.json',
    'page/page.js',
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

        /*  Data */
        // Load local JSON data
        // uk-cartogram
        //console.log(topo);
        //console.log(regions);

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
