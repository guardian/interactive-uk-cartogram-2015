define([
    'd3',
    'topojson',
], function(
    d3,
    topojson
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

        svg.attr("width", WIDTH)
            .attr("height", HEIGHT);

        if(!options.svg) {
    	    map = d3.select(options.container)
    	        .append("div")
    	        .attr("class", "map");

    	    map.append("h2")
    	        .text(options.title || "UK");

    	    svg = options.svg || map.append("svg")
    								        .attr("width", WIDTH)
    								        .attr("height", HEIGHT);
    	}
    	

        map = options.map_g.append("g")
            .attr("id", "map_"+options.id)
            .attr("class",options.field)

        var constituenciesMap=map.append("g")
        	.attr("class","constituencies")
        	.classed("highlight-change",options.highlightChange);

        

       	var ix=map;
        var clone;
        var pulse;

        pulse=options.svg.append("g")
                    .attr("class","pulse");

        if(options.bg) {
            clone=options.svg.append("g")
                    .attr("class","clone")
                    .attr("x",options.left)
                        .append("path");
            

    	    ix=options.svg.append("rect")
    				.attr("class","bg")
    				.attr("x",options.left)
    				.attr("y",0)
    				.attr("width",WIDTH)
    				.attr("height",HEIGHT)
            
                    
            //console.log("----->",options.bg.width,options.left)

        }

        
        if(options.mouseClickMapCallback) {
            ix.on("click",function(){
                    options.mouseClickMapCallback(__currentConstituency);
                })
        }
        if(options.mouseOverMapCallback) {

        	ix
                .on("mousemove",function(){
                    //console.log("mouse",d3.mouse(this))

        	    	var c=findClosest([d3.mouse(this)[0]-options.left,d3.mouse(this)[1]],function(d){
                        if(options.filterRange) {
                            //return options.filterRange.filter(d.properties.projection_info.margin);
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
                    

        	    })
                

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
            //.classed("pulse",function(d){
            //    return d.properties.projection_info.margin<0.05;
            //})
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
            .on("mouseout",function(){
            	if(typeof options.mouseOutCallback != 'undefined') {
            		to=setTimeout(function(){
            			options.mouseOutCallback();	
            		},250);
                	
                }
            	
            })

        

        map.selectAll("path").filter(function(d){
        	return !d.properties.gray;
        })
        /*.each(function(d){
        	constituencies.push(d);
        })*/
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

        updateConstituencies();
        setCentroids();

        //setTimeout(updateConstituencies,1000);
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
        function updateConstituencies() {
            
        }

        function resize(size) {


            GEOM=options.geom[size];

            if(WIDTH===GEOM.width) {
                return;
            }

            WIDTH = GEOM.width;
            HEIGHT = GEOM.height;

            svg.attr("width",WIDTH)
                .attr("height",HEIGHT);

            //100:600=WIDTH:x
            scale = 2000;
            scale*=GEOM.scale_factor;

            projection.scale(scale)
                        .translate([HEIGHT / 2, HEIGHT / 2])
                        .center(GEOM.center);

            path.projection(projection);

            setCentroids();

            ix.attr("width",GEOM.width)
                .attr("height",GEOM.height);

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
        			//		.classed("highlight",false)
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
                        //console.log(__this.attr("class"))
                        clone
                            .style("display","block")
                            .attr("d",__this.attr("d"))
                            .classed("pulse",__this.classed("pulse"))
                            .classed("pulse-battle",__this.classed("pulse-battle"))
                            .classed("pulse-lean",__this.classed("pulse-lean"))
                            .classed("pulse-safe",__this.classed("pulse-safe"))
                            .classed("pulse-solid",__this.classed("pulse-solid"))
                    });
            



        	if (options.tooltip) {

                var bbox=svg.node().getBoundingClientRect();
                tooltip.show(constituency, getCentroid(constituency.properties.constituency), __translate, __scale, bbox);
            }



        };

        function applyFilters() {
            
            pulse.selectAll("path").remove();
            svg.attr("width",640)
            var scale=d3.scale.quantize().domain([0,0.65]).range([-300,0,300])

            var scale=function(d){
                if(d<0.05) {
                    return -400;
                }
                if(d>=0.05 && d<0.10) {
                    return 0;
                }
                if(d>=0.1) {
                    return 400;
                }
            }

            if(options.filterRange) {
                
                constituenciesMap
                    .style("transform-origin",function(d){
                        return "320px 320px";
                    })
                    .style("transform",function(){
                        return "scale(0.5)"
                    })
                    //.classed("pulsating",true)

                    .selectAll("path")
                        .transition()
                        .duration(1000)
                        //.style("transform-origin","center center")
                        .attr("transform",function(d){
                            var centre=getCentroid(d.properties.constituency);
                            console.log(d.properties.projection_info.margin,scale(d.properties.projection_info.margin))
                            return "translate("+(scale(d.properties.projection_info.margin))+","+0+")";
                        })
                        /*.style("transform-origin","center center")
                        .style("transform",function(d){
                            return "scale("+((1-d.properties.projection_info.margin))+")";
                        })*/
                        /*
                        .classed("gray",function(d){
                            return d.properties.projection_info.margin > 0.15;
                        })
                        .classed("pulse",false)
                        .each(function(d,i){
                            //console.log(options.filterRange)

                            //if(options.filterRange.filter(d.properties.projection_info.margin)) {
                                //d3.select(this).moveToFront();
                                var c=d3.select(this);
                                c.classed("pulse",true);
                                c.classed("pulse-"+options.filterRange.status,true);
                                
                                var status="solid",
                                    value=d.properties.projection_info.margin;
                                if(value<0.05) {
                                    status="battle";
                                }
                                if(value >= 0.05 && value < 0.10) {
                                    status="lean";
                                }
                                if(value >= 0.10 && value < 0.15) {
                                    status="safe";
                                }
                                

                                pulse
                                    .append("path")
                                    .attr("d",c.attr("d"))
                                    //.attr("class",c.attr("class")+" pulse pulse-"+options.filterRange.status)
                                    .attr("class",c.attr("class")+" pulse pulse-"+status)
                                    .style("stroke","#333")
                            //}
                            
                        });
                        */
            } else {
                constituenciesMap
                    .classed("pulsating",false)
                    .selectAll("path")
                        .classed("gray",function(d){
                            
                            if(options.filterRange) {
                                return !options.filterRange(d.properties.projection_info.margin)
                            }

                            if(!options.filterSame) {
                                return 0;
                            }
                            return d.properties.projection_info["projection"] == d.properties.projection_info["winner2010"];
                        })
            }

            
                    
                    
            
        }

        this.applyFilterSame=function(doApply) {
            options.filterSame=doApply;
            options.filterContest=false;
            options.filterRange=null;
            applyFilters();
        };

        this.applyFilterContest=function(doApply) {
            options.filterContest=doApply;
            options.filterSame=false;
            options.filterRange=null;
            applyFilters();
        };
        this.applyFilterContestRange=function(range) {
            
            console.log("applyFilterContestRange",range)

            options.filterSame=false;

            options.filterContest=false;
            options.filterRange=range;

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

                

                map.transition()
                        .ease(d3.ease("linear"))
                        .duration(500)
                        .attr("transform", "translate(" + __translate + ")scale(" + __scale + ")");

                clone.transition()
                        .ease(d3.ease("linear"))
                        .duration(500)
                        .attr("transform", "translate(" + __translate + ")scale(" + __scale + ")");

                pulse.transition()
                        .ease(d3.ease("linear"))
                        .duration(500)
                        .attr("transform", "translate(" + __translate + ")scale(" + __scale + ")");
                
                if(callback) {
                    callback(__translate,__scale);
                }
                
                updateConstituencies();
                setCentroids();


                if(options.reset) {
                    options.reset.classed("hidden",false);
                }

                if(options.tooltip) {
                    tooltip.hide();
                    setTimeout(function(d){
                        var bbox=svg.node().getBoundingClientRect();
                        tooltip.show(constituency, c_centre, __translate, __scale, bbox);    
                    },750)
                    
                }

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

                pulse.transition()
                        .ease(d3.ease("linear"))
                        .duration(500)
                        .attr("transform", "translate(" + __translate + ")scale(" + __scale + ")");
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
        	}).forEach(function(constituency){
                
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
                
        	});

            


        	return closest_constituency;
        }

        

    };
    return HexMap;    
});
