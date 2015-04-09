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

        //100:600=WIDTH:x
        var scale = 2000;
        scale*=(options.geom?options.geom.scale_factor:1);

        var projection = d3.geo.transverseMercator()
            .scale(scale)
            .translate([HEIGHT / 2, HEIGHT / 2])
            .center(options.geom?options.geom.center:[2, 54.1])
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
        if(options.bg) {
    	    ix=options.svg.append("rect")
    				.attr("class","bg")
    				.attr("x",options.left)
    				.attr("y",0)
    				.attr("width",options.bg.width)
    				.attr("height",HEIGHT)
            
                    
            //console.log("----->",options.bg.width,options.left)

        }

        
        if(options.mouseClickMapCallback) {
            ix.on("click",function(){
                    self.zoom(__currentConstituency.properties.constituency);

                    options.mouseClickMapCallback(__currentConstituency);
                })
        }
        if(options.mouseOverMapCallback) {

        	ix
                .on("mousemove",function(){
                    //console.log("mouse",d3.mouse(this))

        	    	var c=findClosest([d3.mouse(this)[0]-options.left,d3.mouse(this)[1]],function(d){
                        if(!options.filterSame) {
                            return true;
                        }
        	    		return d.properties.projection_info["projection"] != d.properties.projection_info["winner2010"];
        	    	});
        	    	//console.log(c)

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
            	return d.properties.projection_info["projection"] == d.properties.projection_info["winner2010"];
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
        this.selectCostituency = function(constituency) {

            if(!constituency) {
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

        };
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
                        d3.select(this).moveToFront();
                        map.selectAll("path.selected").moveToFront();
                    })

        	if (options.tooltip) {
                tooltip.show(constituency, getCentroid(constituency.properties.constituency), __translate, __scale);
            }



        };

        this.zoom=function(constituency) {
            if(options.zoomable) {
                var c_centre=this.getCentroid(constituency);
                /*
                var bounds = path.bounds(constituency),
                                  dx = bounds[1][0] - bounds[0][0],
                                  dy = bounds[1][1] - bounds[0][1],
                                  x = (bounds[0][0] + bounds[1][0]) / 2,
                                  y = (bounds[0][1] + bounds[1][1]) / 2,
                                  scale = 1.5,//.05 / Math.max(dx / options.width, dy / options.width),
                                  translate = [options.width / 2 - scale * x, options.height / 2 - scale * y];
                */

                var center =    getCentroid(constituency.properties.constituency),//path.centroid(constituency),
                                scale = 1.5,
                                translate = [options.width / 2 - scale * center[0], options.height / 2 - scale * center[1]];

                __scale=scale;

                var dist=getDistance(__translate[0],__translate[1],translate[0],translate[1]);
                
                __translate=translate;    

                map.transition()
                        .ease(d3.ease("quad-in-out"))
                        .duration(500)
                        .attr("transform", "translate(" + __translate + ")scale(" + __scale + ")");

                
                updateConstituencies();
                setCentroids();

                if(options.tooltip) {
                    tooltip.hide();
                }

                return translate;    
            }
            
            return null;

        }

        this.findConstituency=function(code) {
            console.log("looking for ",code)
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