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
            var shareWindow = "";
            var twitterBaseUrl = "https://twitter.com/home?status=";
            var facebookBaseUrl = "https://www.facebook.com/dialog/feed?display=popup&app_id=741666719251986&link=";
            var network = e.currentTarget.getAttribute('data-source'); 


            var currentView = e.currentTarget.getAttribute('data-view');
            var defaultSharemessage = "The Guardian poll projection. ";

            var sharemessage=document.querySelector("a[name=default]");
            if(currentView) {
                sharemessage = document.querySelector("a[name="+currentView+"]");
            }

            sharemessage=sharemessage.getAttribute("data-status");

            var shareImage = "";
            var guardianUrl = "http://gu.com/p/464t6"+(currentView?("#"+currentView):"");


            if(network === "twitter"){
                shareWindow = 
                    twitterBaseUrl + 
                    encodeURIComponent(sharemessage) + 
                    "%20" + 
                    (currentView?encodeURIComponent(guardianUrl):"")

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
}

return addShareButtons;
});
