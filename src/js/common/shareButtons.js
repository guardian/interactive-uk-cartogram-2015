define([
], function(
) {
    'use strict';

    function addShareButtons() {    
        var shareButtons = document.querySelectorAll('.btns-share button');

        for (var i = 0; i < shareButtons.length; i++) {
            shareButtons[i].addEventListener('click',openShareWindow);
        }

        function openShareWindow(e){
            
            var network = e.currentTarget.getAttribute('data-source'); 
            var guardianUrl = "http://preview.gutools.co.uk/politics/ng-interactive/2015/apr/17/election-2015-constituency-map";//+(currentView?("#"+currentView):"");
            var twitterBaseUrl = "https://twitter.com/home?status=";
            var facebookBaseUrl = "https://www.facebook.com/dialog/feed?display=popup&app_id=741666719251986&link=";
            var sharemessage = "Election 2015: Constituency by constituency - The Guardian";
            var shareWindow = "";
            var shareImage = "";
            //var currentView = e.currentTarget.getAttribute('data-view');
            //var sharemessage=document.querySelector("a[name=default]");
            
            /*
            if(currentView) {
                sharemessage = document.querySelector("a[name="+currentView+"]");
            }
            sharemessage = sharemessage.getAttribute("data-status");
            */

            if(network === "twitter"){
                shareWindow = 
                    twitterBaseUrl + 
                    encodeURIComponent(sharemessage);/* + 
                    "%20" + 
                    (currentView?encodeURIComponent(guardianUrl):""); */

            }else if(network === "facebook"){
                shareWindow = 
                    facebookBaseUrl + 
                    encodeURIComponent(guardianUrl) + 
                    "&picture=" + 
                    encodeURIComponent(shareImage) + 
                    "&redirect_uri=http://www.theguardian.com";
            }
            window.open(shareWindow, network + "share", "width=640,height=320");
        }
    }

    return addShareButtons;
});
