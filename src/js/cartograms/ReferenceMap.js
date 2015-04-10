define([
    'd3',
    'cartograms/RegionsMap'
], function(
    d3,
    RegionsMap
) {
   'use strict';

    function ReferenceMap(topo,options) {


    	var svg=d3.select(options.container)
    		.append("div")
    		.attr("class","ref-map")
    			.append("svg")
    			.attr("width",120)
    			.attr("height",120);
    	var map=svg.append("g");
    	
    	new RegionsMap(topo,{
            width: 120,
            height: 120,
            left: 0,
            svg:svg,
            map_g:map,
            highlight:options.regions,
            selected_geom:"normal",
            geom:{
            	normal:{
                    scale_factor:0.25
                },
                small:{
                    scale_factor:0.25
                },
            }
        });

    }

    return ReferenceMap;

});