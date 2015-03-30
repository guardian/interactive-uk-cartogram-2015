define([
    'reqwest',
    'json!data/sampleData.json',
    'text!templates/appTemplate.html'
], function(
    reqwest,
    sampleData,
    templateHTML
) {
   'use strict';

    function logResponse(resp) {
        console.log(resp);
    }

    function handleRequestError(err, msg) {
        console.error('Failed: ', err, msg);
    }

    function afterRequest(resp) {
        console.log('Finished', resp);
    }

    function init(el, context, config, mediator) {
        // DEBUG: What we get given on boot
        console.log(el, context, config, mediator);

        // DOM template example
        el.innerHTML = templateHTML;

        // Load local JSON data
        console.log(sampleData);

        // Load remote JSON data
        var key = '1hy65wVx-pjwjSt2ZK7y4pRDlX9wMXFQbwKN0v3XgtXM';
        var url = 'http://interactive.guim.co.uk/spreadsheetdata/'+key+'.json';

        reqwest({
            url: url,
            type: 'json',
            crossOrigin: true
        })
        .then(logResponse)
        .fail(handleRequestError)
        .always(afterRequest);
    }

    return {
        init: init
    };
});
