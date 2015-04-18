define([
    'd3',
    'topojson',
    'common/TouchEvents'
], function(
    d3,
    topojson,
    TouchEvents
) {
   'use strict';

    function HexMap(topo, options) {

        

        var WIDTH = options.width || 300,
            HEIGHT = options.height || 300;

        var GEOM= {
            center:[2, 54.1],
            scale_factor:1,
            width:WIDTH,
            height:HEIGHT
        };

        

        if(options.selected_geom) {
            
            GEOM.center=options.geom[options.selected_geom].center || GEOM.center;
            GEOM.scale_factor=options.geom[options.selected_geom].scale_factor || GEOM.scale_factor;
            GEOM.width=options.geom[options.selected_geom].width || GEOM.width;
            GEOM.height=options.geom[options.selected_geom].height || GEOM.height;
            

            WIDTH = GEOM.width || WIDTH;
            HEIGHT = GEOM.height || HEIGHT;

            
        }

        var scale = 2000;
        scale*=GEOM.scale_factor;

        var projection = d3.geo.transverseMercator()
            .scale(scale)
            .translate([HEIGHT / 2, HEIGHT / 2])
            .center(GEOM.center)
            .rotate([2,0])
            .precision(.1);


        var path = d3.geo.path()
            .projection(projection);

        var __scale=1,
            __translate=[0,0];
        var __currentConstituency;


        var tooltip=options.tooltip;

        
        var map,
            svg=options.svg;

        svg.attr("width", options.hundred?"100%":WIDTH)
            .attr("height", options.hundred?"100%":HEIGHT);

        
        

        map = options.map_g.append("g")
            .attr("id", "map_"+options.id)
            .attr("class",options.field)

        //OPTIMIZATIONS
        var svg_node=svg.node(),
            map_node=map.node();
        //END OF OPTIMAZIONS

        var constituenciesMap=map.append("g")
            .attr("class","constituencies")
            .classed("highlight-change",options.highlightChange);

        

        var ix=map;
        var clone;
        if(options.bg) {
            clone=options.svg.append("g")
                    .attr("class","clone")
                    .attr("x",options.left)
                        .append("path");

            ix=options.svg.append("rect")
                    .attr("class","bg")
                    .attr("x",options.left)
                    .attr("y",0)
                    .attr("width",svg_node.clientWidth || svg_node.offsetWidth)
                    .attr("height",svg_node.clientHeight || svg_node.offsetHeight)
            
                    
            //console.log("----->",options.bg.width,options.left)

        }

        function onMove(coords) {
            var c=findClosest([coords[0]-options.left,coords[1]],function(d){
                if(options.filterRange) {
                    return filterRange(d.properties.projection_info.margin);
                }
                if(!options.filterSame) {
                    return true;
                }
                return d.properties.projection_info["projection"] != d.properties.projection_info["winner2010"];
            });
            

            if(c) {
                __currentConstituency=c;
                options.mouseOverMapCallback(c);
            }
        }
        
        if(options.mouseClickMapCallback) {
            ix.on("click",function(){
                    options.mouseClickMapCallback(__currentConstituency);
                })
        }
        var touchstart=false;
        if(options.mouseOverMapCallback) {


            ix
                .on("mousemove",function(){
                    //console.log("mouse",d3.mouse(this))
                    if(!touchstart) {
                        onMove(d3.mouse(this));
                    }

                });

            new TouchEvents(ix,{
                element:map_node,
                touchStartCallback:function(coords){
                    touchstart=true;
                    onMove([coords[0],coords[1]-40]);
                },
                touchEndCallback:function(){
                    touchstart=false;
                },
                touchMoveCallback:function(coords){
                    touchstart=true;
                    onMove([coords[0],coords[1]-40]);
                }
            });
            
                

        }
        if(options.mouseOutMapCallback) {
            ix.on("mouseout",function(){
                options.mouseOutMapCallback();
            });                 
        }
        

        if(typeof options.left != 'undefined') {
            map.attr("transform","translate("+(options.left)+",0)");
        }
        var to=null;

        var hexagons=!options.regions?topo.objects.hexagons:(function(){
            //console.log(topo)
            return {
                crs:topo.objects.hexagons.crs,
                type:topo.objects.hexagons.type,
                geometries:topo.objects.hexagons.geometries.filter(function(c){
                    return options.regions.indexOf(c.properties.regions)>-1;
                })
            };

        }());


        //var constituencies=[];
        //console.log("!!!!!!",topo)
        constituenciesMap
            .selectAll("path")
            .data(topojson.feature(topo, hexagons).features)
            .enter()
            .append("path")
            .attr("rel",function(d){
                return d.properties.projection_info["winner2010"]+" -> "+d.properties.projection_info["projection"];
            })
            .attr("class", function(d) {
                var c = "constituency " + d.properties.projection_info[options.field].toLowerCase();
                //var c = "constituency " + d.properties.projection_info[options.field].toLowerCase();

                if (options.border) {
                    c += " constituency-border";
                }

                return c;
            })
            .classed("changing",function(d){
                return d.properties.projection_info["projection"] != d.properties.projection_info["winner2010"];
            })
            .classed("gray",function(d){
                if(!options.filterSame) {
                    return 0;
                }
                if(options.filterRange) {
                    return !options.filterRange(d.properties.projection_info.margin)
                }
                return d.properties.projection_info["projection"] == d.properties.projection_info["winner2010"];
            })
            .style("fill-opacity",function(d){
                if(!options.filterContest) {
                    return;
                }
                if(options.contestScale) {
                    return options.contestScale(d.properties.projection_info.margin)
                }
            })
            .attr("d", function(d) {
                return path(d);
            })            
            .on("mouseover", function(d) {
                if(typeof options.mouseOverCallback != 'undefined') {
                    if(to) {
                        clearTimeout(to);
                        to=null;
                    }
                    options.mouseOverCallback(d);
                }
            })
            .on("mouseout",function(d){
                if(typeof options.mouseOutCallback != 'undefined') {
                    to=setTimeout(function(){
                        options.mouseOutCallback(); 
                    },250);
                    
                }
                
            });
        

        map.selectAll("path").filter(function(d){
            return !d.properties.gray;
        })
        .style("fill",function(d){
            if(options.gradients) {
                return "url(#grad_"+d.properties.projection_info.winner2010.toLowerCase()+"2"+d.properties.projection_info.projection.toLowerCase()+")";    
            }
        });

        var constituencies=map
                .selectAll("path").filter(function(d){
                    return !d.properties.gray;
                })
                .data(),
            centroids={};

        setCentroids();

        
        if(options.callback) {
            options.callback();
        }

        function setCentroids() {
            map
                .selectAll("path")
                .each(function(d){
                    centroids[d.properties.constituency]=path.centroid(d);
                });
        }
        function getCentroid(constituencyCode) {
            return centroids[constituencyCode];
        }

        function resize(size) {


            GEOM=options.geom[size];

            if(WIDTH===GEOM.width) {
                return;
            }

            WIDTH = GEOM.width;
            HEIGHT = GEOM.height;

            svg.attr("width",options.hundred?"100%":WIDTH)
                .attr("height",options.hundred?"100%":HEIGHT);

            //100:600=WIDTH:x
            scale = 2000;
            scale*=GEOM.scale_factor;

            projection.scale(scale)
                        .translate([HEIGHT / 2, HEIGHT / 2])
                        .center(GEOM.center);

            path.projection(projection);

            setCentroids();

            ix.attr("width",svg_node.clientWidth || svg_node.offsetWidth || GEOM.width)
                .attr("height",svg_node.clientHeight || svg_node.offsetHeight || GEOM.height);

            constituenciesMap
                .selectAll("path")
                    .attr("d", function(d) {
                        return path(d);
                    });

        }

        this.resize=function(size){
            resize(size);
        }
        this.getConstituencies=function() {
            return constituencies;
        };
        this.getPosition=function() {
            return [options.left,0];
        };

        this.changePreferences = function(year) {
            map.selectAll("path")
                .attr("class", function(d) {
                    return "constituency " + d.properties.projection_info[year == 2010 ? "winner2010" : "projections"].toLowerCase();
                });
        };
        this.getCentroid=function(constituency) {
            return path.centroid(constituency);
        };
        this.getBounds=function(constituency) {
            return path.bounds(constituency);
        };
        this.selectCostituency = function(constituency,callback) {

            if(!constituency) {
                map//.classed("highlight",true)
                    .selectAll("path")
                        .classed("selected",false);

                return;
            }
            map//.classed("highlight",true)
                .selectAll("path")
                    .classed("selected",function(d){
                        return d.properties.constituency==constituency.properties.constituency;
                    })
                    .filter(function(d){
                        return d.properties.constituency==constituency.properties.constituency;
                    })
                    .each(function(d){
                        //console.log(options.field,this)
                        d3.select(this).moveToFront();
                    });

            if(callback) {
                callback(constituency);
            }

        };
        this.deHighlightCostituency = function() {
            map
                .selectAll(".highlight")
                    .classed("highlight",false)
            clone
                .style("display","none")
        }
        this.highlightCostituency = function(constituency) {
            if(!constituency) {
                //map.classed("highlight",false);
                    //.selectAll("path")
                    //      .classed("highlight",false)
                if(options.tooltip) {
                    tooltip.hide();
                }
                return;
            }
            
            map
                .selectAll("path")
                    .classed("highlight",function(d){
                        return d.properties.constituency==constituency.properties.constituency;
                    })
                    .filter(function(d){
                        return d.properties.constituency==constituency.properties.constituency;
                    })
                    .each(function(d){
                        var __this=d3.select(this);
                        __this.moveToFront();
                        map.selectAll("path.selected").moveToFront();
                        clone
                            .style("display","block")
                            .attr("d",__this.attr("d"));
                    });
            



            if (options.tooltip) {

                var bbox=svg_node.getBoundingClientRect();
                tooltip.show(constituency, getCentroid(constituency.properties.constituency), __translate, __scale, bbox);
            }



        };

        function filterRange(margin) {
            return margin <= 0.05;
        }

        function applyFilters() {
            constituenciesMap
                .selectAll("path")
                    .classed("gray",function(d){
                        
                        if(options.filterRange) {
                            return !filterRange(d.properties.projection_info.margin)
                        }

                        if(!options.filterSame) {
                            return 0;
                        }
                        return d.properties.projection_info["projection"] == d.properties.projection_info["winner2010"];
                    })

        }

        this.applyFilterSame=function(doApply) {
            options.filterSame=doApply;
            options.filterContest=false;
            options.filterRange=false;
            applyFilters();
        };

        this.applyFilterContest=function(doApply) {
            options.filterContest=doApply;
            options.filterSame=false;
            options.filterRange=false;
            applyFilters();
        };
        this.applyFilterContestRange=function() {
            
            options.filterSame=false;

            options.filterContest=false;
            options.filterRange=true;

            //console.log(options.filterRange)
            applyFilters();
            
        }
        this.removeFilters=function() {
            options.filterContest=false;
            options.filterSame=false;
            options.filterRange=null;
            applyFilters();  
        }

        this.zoom=function(constituency,callback) {

            if(options.zoomable) {
                var c_centre=this.getCentroid(constituency);
                

                var center =    getCentroid(constituency.properties.constituency),//path.centroid(constituency),
                                scale = 2,
                                translate = [GEOM.width / 2 - scale * center[0], GEOM.height / 2 - scale * center[1]];

                __scale=scale;

                //var dist=getDistance(__translate[0],__translate[1],translate[0],translate[1]);
                
                __translate=translate;

                map
                        .transition()
                            .ease(d3.ease("linear"))
                            .duration(500)
                            .attr("transform", "translate(" + __translate + ")scale(" + __scale + ")");

                clone.transition()
                        .ease(d3.ease("linear"))
                        .duration(500)
                        .attr("transform", "translate(" + __translate + ")scale(" + __scale + ")");
                
                if(callback) {
                    callback(__translate,__scale);
                }
                
                setCentroids();


                if(options.reset) {
                    options.reset.classed("hidden",false);
                }

                if(options.tooltip) {
                    tooltip.hide();
                    setTimeout(function(d){
                        var bbox=svg_node.getBoundingClientRect();
                        tooltip.show(constituency, c_centre, __translate, __scale, bbox);    
                    },750)
                    
                }


                svg.classed("overflow",true);

                return translate;    
            }
            
            return null;

        }
        this.resetZoom=function() {
            if(options.reset && options.zoomable) {
                if(options.tooltip) {
                    tooltip.hide();
                }
                __translate=[0,0];
                __scale=1;

                map.transition()
                        .ease(d3.ease("linear"))
                        .duration(500)
                        .attr("transform", "translate(" + __translate + ")scale(" + __scale + ")");

                clone.transition()
                        .ease(d3.ease("linear"))
                        .duration(500)
                        .attr("transform", "translate(" + __translate + ")scale(" + __scale + ")");

                svg.classed("overflow",false);
            }
        }

        this.findConstituency=function(code) {
            //console.log("looking for ",code)
            return constituencies.filter(function(c){
                return c.properties.constituency==code;
            })[0];
        }



        function getDistance(x1,y1,x2,y2) {
            return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
        }

        

        function getMapCoords(x, y, translate, scale) {
                return [(x - translate[0])/scale,(y - translate[1])/scale];
            }

        function findClosest(coords,filter) {

            //console.log("FIND CLOSEST",coords)

            var closest_constituency=null,
                dist=10000;
            
            coords=getMapCoords(coords[0],coords[1],__translate,__scale);

            constituencies.filter(function(d){
                if(!filter) {
                    return 1;
                }
                return filter(d);
            }).every(function(constituency){
                
                //var c_centre=path.centroid(constituency),
                var     c_centre=getCentroid(constituency.properties.constituency),
                      __dist=getDistance(coords[0],coords[1],c_centre[0],c_centre[1]);              

                //console.log(coords,c_centre,screen_c_centre)

                //console.log(c_centre,constituency.properties.centroid)

                

                if(__dist<dist) {
                    //console.log(coords,c_centre,screen_c_centre)
                    closest_constituency=constituency;
                    dist=__dist;
                }

                
                return __dist>5;
                
            });

            


            return closest_constituency;
        }

        

    };
    return HexMap;    
});