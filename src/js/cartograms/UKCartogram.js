define([
    'd3',
    'cartograms/HexMap'
], function(
    d3,
    HexMap
) {
   'use strict';

    function UKCartogram(projections,topo,topoRegions,options) {
    	
    	topo.objects.hexagons.geometries.forEach(function(d) {

    		var projection = projections.sheets["RESULT"].filter(function(p) {
    			return d.properties.constituency == p.constituencycode;
    		});

    		d.properties.projection_info = projection.length > 0 ? projection[0] : null;
    		d.properties.projection = projection.length > 0 ? projection[0].projection.toLowerCase() : null;

    	});

    	d3.select(options.container).attr("width",options.width||"100%")

    	var WIDTH=options.width || d3.select(options.container).node().clientWidth || d3.select(options.container).node().offsetWidth || 960,
    		HEIGHT = options.height || 500,
    		margins = {
    			top:15
    		};

        var svg = d3.select(options.container).append("svg")
                                .attr("width", WIDTH)
                                .attr("height", HEIGHT);
        var map_regions_g=svg.append("g").attr("class","regions"),
            map_g=svg.append("g");
    	

        var center=[0,0];

    	var parties = ["lab", "con", "snp", "libdem", "ukip", "green","others","dup"];
    	var ORDER = (["con", "libdem", "ukip", "dup", "others", "pc", "green", "snp", "lab"]).reverse();

    	parties.sort(function(a, b) {
    		return ORDER.indexOf(a) - ORDER.indexOf(b);
    	});

        var map=new HexMap(topo, {
            id:options.id,
            field: "projection",
            width: WIDTH,
            height: HEIGHT,
            bg: {
                width:WIDTH
            },
            left: 0,//WIDTH/2,
            svg:svg,
            tooltip: new Tooltip({
                    container: options.container,
                    left: 0
                }),
            map_g:map_g,
            border:1,
            container: options.container,
            geom:options.geom,
            regions:options.regions,
            zoomable:true,
            mouseClickMapCallback:function(d){
                map.selectCostituency(d);
            },
            mouseOverMapCallback:function(d){
                map.highlightCostituency(d);
            },
            mouseOutMapCallback:function(d){
                map.highlightCostituency();
            }
        });

        var constituencies = map.getConstituencies();
        //console.log("---->",constituencies)
            
        //console.log(1,map.getCentroid(constituencies[20]),constituencies[20]);

        //center=map.zoom(constituencies[20]);

        //console.log(2,map.getCentroid(constituencies[20]),constituencies[20]);



        window.zoom=function(constituency) {
            constituency=map.findConstituency(constituency || "S14000051");
            //console.log(constituency)
            map.zoom(constituency);
            map.selectCostituency(constituency);
            //console.log(map.getCentroid(constituency),constituency);
        }

        this.selectConstituency=function(constituency) {
            constituency=map.findConstituency(constituency || "S14000051");
            //console.log(constituency)
            map.zoom(constituency);
            map.selectCostituency(constituency);
            //console.log(map.getCentroid(constituency),constituency);
            return constituency;
            //console.log(map.getCentroid(constituency),constituency);
        }
        /*
    	var to=null;
        window.addEventListener('resize', function(event){
            if(to) {
                clearTimeout(to);
                to=null;
            }
            to=setTimeout(function(){
                mapsTable.resize();   
            },250)
            
        });
        */
    	
        function Tooltip(options) {

            var tooltip = d3.select(options.container)
                .append("div")
                .attr("class", "tooltip");
            var tooltip_contents = tooltip.append("div")
                                        .attr("class","tooltip-content")
            tooltip_contents.append("h4");
            tooltip_contents.append("p")
                .attr("class", "proj");
            this.hide = function() {
                tooltip.style({
                    display:"none"
                });
            };
            this.show = function(info, coords, translate, scale) {

                //console.log(info,coords,translate,scale);

                

                coords[0]*=scale;
                coords[1]*=scale;

                coords[0]+=translate[0];
                coords[1]+=translate[1];

                tooltip.style({
                    display:"block",
                    left: (coords[0]) + "px",
                    top: (coords[1]-20) + "px"
                });

                tooltip_contents.select("h4")
                    .text(function() {
                        return info.properties.name;
                    });

                tooltip_contents.select(".proj")
                    .html(function() {
                        var from=info.properties.projection_info["winner2010"].toLowerCase(),
                            to=info.properties.projection;
                        return "from <span class=\""+from+"\">" + names[from] + "<\/span> to <span class=\""+to+"\">" + names[to] + "<\/span>";
                    });

            };

        }

    }

    var names = {
                "con": "Conservative",
                "libdem": "Liberal Democrats",
                "ukip": "UKIP",
                "others": "Others",
                "pc": "PC",
                "green": "Green Party",
                "snp": "Scottish National",
                "lab": "Labour Party",
                "dup": "DUP"
            };

    d3.selection.prototype.moveToFront = function() {
      return this.each(function(){
      this.parentNode.appendChild(this);
      });
    };

    return UKCartogram;

});
