define([
    'reqwest',
    'json!data/uk-cartogram.json',
    'page/page.js',
    'text!templates/appTemplate.html'
], function(
    reqwest,
    localData,
    pageText,
    templateHTML
) {
    'use strict';

    function handleRequestError(err, msg) {
        console.error('Failed: ', err, msg);
    }
    function afterRequest(resp) {
        console.log('Finished', resp);
    }


    function init(el) {

        // DOM template
        el.innerHTML = templateHTML;

        /*  Data */
        // Load local JSON data
        // uk-cartogram
        console.log(localData);

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
            //chartCartogram.remder(data, "#ID");
            //...
        })
        .fail(handleRequestError)
        .always(afterRequest);  
    }

    return {
        init: init
    };
});
