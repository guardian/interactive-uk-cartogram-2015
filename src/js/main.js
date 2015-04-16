define([
    'reqwest',
    'json!data/hexagons-topo.json',
    'json!data/regions-topo.json',
    'page/page',
    'common/elementStick.js',
    'cartograms/main.js',
    'text!templates/appTemplate.html'
], function(
    reqwest,
    topo,
    regions,
    pageText,
    stickElement,
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

        //TODO: move to nav project
        /* Render tabs */
        var head = document.querySelector('head'),
            script = document.createElement('script');
        script.setAttribute('src','http://interactive.guim.co.uk/2015/04/election-nav/electionNav.js');
        script.setAttribute('type','text/javascript');
        head.appendChild(script); 
        //END OF TODO

        /* Data */
        // Load local JSON data
        //console.log(localData);

        // Load remote JSON data
        var key = '1tfMwu6bHXIoB9uVmTnuhYT0K8lv4OwNXhBCjHVasZP8',
            url = 'http://interactive.guim.co.uk/spreadsheetdata/'+key+'.json';

        reqwest({
            url: url,
            type: 'json',
            crossOrigin: true
        })
        .then(function(data) {
            /* Render texts and cartograms */
            pageText.render(data.sheets.RESULT[0], data.sheets.glosses);
            cartograms.render(data,topo,regions);
        })
        .then(function() {
            /* Render legand as stick element */
            stickElement.render();

            //TODO: move to nav project
            var imgs = document.querySelectorAll('.electionNav-footer-item img');
            imgs[0].src = '@@assetPath@@/imgs/proj_projection.png';
            imgs[1].src = '@@assetPath@@/imgs/proj_cartogram.png';
            //END OF TODO/
        })
        .fail(handleRequestError)
        .always(afterRequest);  
    }

    return {
        init: init
    };
});
