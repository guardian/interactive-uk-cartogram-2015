define([
    'd3',
    'cartograms/HexMap',
    'cartograms/RegionsMap'
], function(
    d3,
    HexMap,
    RegionsMap
) {
   'use strict';

    function MapsTable(parties,topo,topoRegions,options) {

    	var WIDTH = options.width || 960,
            HEIGHT = options.height || 500;

        

        var svgs=d3.select(options.container)
            .selectAll("div.carto")
            .data([
                    {
                        id:"map2010",
                        field:"winner2010",
                        year:2010
                    },
                    {
                        id:"map2015",
                        field:"projection",
                        year:2015
                    }])
                .enter()
                .append("div")
                .attr("id",function(d){
                    return d.id;
                })
                .attr("class",function(d){
                    return "carto col-"+d.year;
                })
                .append("svg")
                    .attr("width", WIDTH/2)
                    .attr("height", HEIGHT);


        var defs=svgs.append("defs");

        

        //console.log(parties);
        parties.forEach(function(d){
            parties.forEach(function(t){
                var gradient=defs.append("linearGradient")
                        .attr({
                            id:"grad_"+d+"2"+t,
                            x1:"0%",
                            y1:"0%",
                            x2:"100%",
                            y2:"0%"
                        });
                gradient.append("stop")
                            .attr({
                                offset:"30%",
                                //"stop-color":"#ff6600"
                                //offset:0.485,
                                "class":d
                            });
                gradient.append("stop")
                            .attr({
                                offset:"70%",
                                //"stop-color":"#000"
                                //offset:0.485,
                                "class":t
                            });
            });
        });
        
        parties.forEach(function(p){
        	
        	defs.append("marker")
    				.attr({
    					id:"triangle-start-"+p,
    					//"viewBox":"0 0 10 10",
    					"refX":5,					
    					"refY":6,
    					markerUnits:"userSpaceOnUse",
    					markerWidth:10,
    					markerHeight:10,
    					orient:"auto",
    					"class":"marker "//+p
    				})
    				.append("path")
    					.attr({
    						//"d":"M 0 0 L 10 5 L 0 10 z"
    						"d":"M 1 1 7 4 1 7 Z"
    					})
    					.attr("transform","rotate(180 5 5)");

    		defs.append("marker")
    				.attr({
    					id:"triangle-end-"+p,
    					//"viewBox":"0 0 10 10",
    					"refX":5,					
    					"refY":4,
    					markerUnits:"userSpaceOnUse",
    					markerWidth:10,
    					markerHeight:10,
    					orient:"auto",
    					"class":"marker "//+p
    				})
    				.append("path")
    					.attr({
    						//"d":"M 0 0 L 10 5 L 0 10 z"
    						"d":"M 1 1 7 4 1 7 Z"
    					});
    			    });
        
        var xscale=options.xscale;

        var MAX_WIDTH=300;

        var maps={};

        svgs.each(function(d,i){
            console.log(d);

            var svg=d3.select(this),
                map_regions_g=svg.append("g").attr("class","regions"),
                map_g=svg.append("g").attr("class","highlight");

            new RegionsMap(topoRegions,{
                field:d.field,
                width: WIDTH/2,
                height: HEIGHT,
                left: xscale(0),
                svg:svg,
                //clipPath:options.clipPath,
                map_g:map_regions_g,
                geom:options.geom,
                main_regions:options.regions,
                fadeOut:options.fadeOut
            });

            maps[d.field]=new HexMap(topo, {
                    id:options.id+d.id,
                    field: d.field,
                    width: WIDTH/2,
                    height: HEIGHT,
                    bg: {
                        width:WIDTH/2
                    },
                    left: xscale(0),
                    svg:svg,
                    tooltip:options.tooltip,
                    map_g:map_g,
                    border:1,
                    container: options.container,
                    geom:options.geom,
                    regions:options.regions,
                    filterSame:true,
                    mouseOverMapCallback:function(d){
                        d3.entries(maps).forEach(function(map){
                            map.value.highlightCostituency(d);
                        });
                        
                        /*connections.selectAll("g.connection")
                                        .classed("highlight",false)
                                        .filter(function(c){
                                            return d.properties.constituency == c.properties.constituency;
                                        })
                                        .classed("highlight",true);*/
                    },
                    mouseOutMapCallback:function(d){
                        d3.entries(maps).forEach(function(map){
                            map.value.highlightCostituency();
                        });
                        //connections.selectAll("g.connection").classed("highlight",false);
                    }
                });

        });

        

    }

    return MapsTable;
});