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

        WIDTH=Math.min(WIDTH,460*2);        

        var maps=d3.select(options.container)
            .selectAll("div.carto")
            .data([
                    {
                        id:"map2010",
                        field:"winner2010"
                    },
                    {
                        id:"map2015",
                        field:"projection"
                    }]);


        var svgs=maps.append("svg");


        var defs=svgs.append("defs");
        
        var xscale=options.xscale;

        var MAX_WIDTH=300;

        var maps={},
            regions={};

        svgs.each(function(d,i){
            //console.log(d);

            var svg=d3.select(this),
                map_g=svg.append("g").attr("class","highlight"),
                map_regions_g=svg.append("g").attr("class","regions");

            regions[d.field]=new RegionsMap(topoRegions,{
                field:d.field,
                width: WIDTH/2,
                height: HEIGHT,
                left: xscale(0),
                svg:svg,
                //clipPath:options.clipPath,
                map_g:map_regions_g,
                geom:options.geom,
                geom_small:options.geom_small,
                selected_geom:options.selected_geom,
                main_regions:options.regions,
                fadeOut:options.fadeOut,
                textField:"abbr"
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
                    geom_small:options.geom_small,
                    selected_geom:options.selected_geom,
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
                            map.value.deHighlightCostituency();
                        });
                        //connections.selectAll("g.connection").classed("highlight",false);
                    }
                });
            //console.log(regions[d.field]);
            regions[d.field].addBorders();

        });
        
        this.resize=function(size) {

            d3.values(maps).forEach(function(map) {
                map.resize(size);
            });
            d3.values(regions).forEach(function(map) {
                map.resize(size);
            });
        };

    }

    return MapsTable;
});
