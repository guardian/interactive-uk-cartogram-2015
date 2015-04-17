define([
        "d3"
    ], function(
        d3
    ) {
   'use strict';

   function TouchEvents(element,options) {
        var touch,
            action,
            diffX,
            diffY,
            endX,
            endY,
            scroll,
            sort,
            startX,
            startY,
            swipe,
            sortTimer;
         
        function getCoord(e, c) {
            //console.log(e)
            return /touch/.test(e.type) ? (e.originalEvent || e).changedTouches[0]['page' + c] : e['page' + c];
        }

        function testTouch(e) {

            if (e.type == 'touchstart') {
                touch = true;
            } else if (touch) {
                touch = false;
                return false;
            }
            return true;
        }
         
        function onStart() {

            var touches=d3.touches(options.element)
            //console.log(touches,options.element,this)

            //console.log("onStart",touches)

            if (!action) {
                action = true;
         
                startX = touches[0][0];//getCoord(ev, 'X');
                startY = touches[0][1];//(ev, 'Y');
                diffX = 0;
                diffY = 0;
         
                sortTimer = setTimeout(function () {
                    sort = true;
                }, 100);
         
                //if (ev.type == 'mousedown') {
                //    $(document).on('mousemove', onMove).on('mouseup', onEnd);
                //}
            }
        }
         
        function onMove(ev) {
            if (action) {

                var touches=d3.touches(options.element)

                //endX = getCoord(ev, 'X');
                //endY = getCoord(ev, 'Y');
                endX = touches[0][0],
                endY = touches[0][1],
                diffX = endX - startX;
                diffY = endY - startY;
         
                if (!sort && !swipe && !scroll) {
                    if (Math.abs(diffY) > 10) { // It's a scroll
                        scroll = true;
                        // Android 4.0 will not fire touchend event
                        //$(this).trigger('touchend');
                        touchEnd();
                    } else if (Math.abs(diffX) > 7) { // It's a swipe
                        swipe = true;
                    }
                }
         
                if (swipe) {
                    //ev.preventDefault(); // Kill page scroll
                    // Handle swipe
                    // ...
                    //console.log("onMove: swipe")
                }
         
                if (sort) {
                    //ev.preventDefault(); // Kill page scroll
                    d3.event.preventDefault();
                    // Handle sort
                    // ....
                    if(options.touchMoveCallback) {
                        //console.log(diffX,diffY)
                        options.touchMoveCallback([endX,endY]);
                    }
                }
         
                if (Math.abs(diffX) > 5 || Math.abs(diffY) > 5) {
                    clearTimeout(sortTimer);
                }
            }
        }
         
        function onEnd() {
            touchEnd();
        }

        function touchEnd() {
            if (action) {
                action = false;
         
                if (swipe) {
                    // Handle swipe end
                    // ...
                    //console.log("onEnd: swipe")
                } else if (sort) {
                    // Handle sort end
                    // ...
                    //console.log("onEnd: sort")

                    if(options.touchEndCallback) {
                        options.touchEndCallback();
                    }

                } else if (!scroll && Math.abs(diffX) < 5 && Math.abs(diffY) < 5) { // Tap
                    //if (ev.type === 'touchend') { // Prevent phantom clicks
                    //    ev.preventDefault();
                    //}
                    // Handle tap
                    // ...
                    //console.log("tap")
                }
         
                swipe = false;
                sort = false;
                scroll = false;
         
                clearTimeout(sortTimer);
         
                //if (ev.type == 'mouseup') {
                //    $(document).off('mousemove', onMove).off('mouseup', onEnd);
                //}
            }
        }

        //console.log(element)
        //console.log(element)
        element.on('touchstart', onStart);
        element.on('touchmove', onMove)
        element.on('touchend', onEnd)
    }

    return TouchEvents;
});
