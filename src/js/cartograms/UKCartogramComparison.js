define([
    'd3',
    'cartograms/MapsTable'
], function(
    d3,
    MapsTable
) {
   'use strict';

    function UKCartogramComparison(projections,topo,topoRegions,options) {
    	
    	topo.objects.hexagons.geometries.forEach(function(d) {

    		var projection = projections.sheets["RESULT"].filter(function(p) {
    			return d.properties.constituency == p.constituencycode;
    		});

    		d.properties.projection_info = projection.length > 0 ? projection[0] : null;
    		d.properties.projection = projection.length > 0 ? projection[0].projection.toLowerCase() : null;

    	});

    	

    	var WIDTH=d3.select(options.container).node().clientWidth || d3.select(options.container).node().offsetWidth,
    		HEIGHT = options.height,
    		margins = {
    			top:15
    		};
    	

    	var parties = ["lab", "con", "snp", "libdem", "ukip", "green","others","dup"];
    	var ORDER = (["con", "libdem", "ukip", "dup", "others", "pc", "green", "snp", "lab"]).reverse();

    	parties.sort(function(a, b) {
    		return ORDER.indexOf(a) - ORDER.indexOf(b);
    	});
    	
    	var xscale=d3.scale.linear().range([0,WIDTH]).domain([0,2]);

        
        var tooltip=new Tooltip({
            container: options.container,
            width:options.width || WIDTH,
            height:options.height || HEIGHT,
            geom:options.geom,
            selected_geom:options.selected_geom
        });

    	var mapsTable = new MapsTable(parties, topo, topoRegions, {
    		container: options.container,
    		width: options.width || WIDTH,
    		height: options.height || 300,
    		geom:options.geom,
            geom_small:options.geom_small,
            selected_geom:options.selected_geom,
    		id:options.id,
    		xscale:xscale,
    		regions:options.regions,
    		clipPath:options.clipPath,
    		fadeOut:options.fadeOut,
            tooltip:tooltip
    	});

        this.resize=function(size) {
            mapsTable.resize(size);
        }

    	//mapsTable.connect("2010", "2015", "end", "projection",options);
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
            
        });*/
    	
        function Tooltip(options) {
            //console.log("Tooltip",options)

            var container=d3.select(options.container);

            var tooltip = container
                .append("div")
                .attr("class", "tooltip-arrow")
                //.style("width","46%");//options.width?((options.width/2-(margins.left+margins.right))+"px"):"90%");



            var tooltip_contents = tooltip.append("div")
                                        .attr("class","tooltip-content")
            tooltip_contents.append("h4");
            tooltip_contents.append("p")
                .attr("class", "proj");

            tooltip.append("div")
                        .attr("class","arrow_box")
            this.hide = function() {
                tooltip.style({
                    display:"none"
                });
            };
            this.show = function(info, coords, translate, scale, bbox) {

                //console.log(info,coords);
                
                var left=bbox.left;

                if(left>460) {
                    return;
                }
                //console.log(options)
                
                var container_w=container.node().clientWidth || container.node().offsetWidth,
                    status=(container_w>620)?"h":"v",
                    w=(status=="h")?options.geom.normal.width:options.geom.small.width,
                    h=(status=="h")?0:options.geom.small.height,
                
                container_w=(container_w>620)?container_w/2:container_w;
                
                tooltip.style({
                    display:"block",
                    left: (status=="v"?(container_w-w)/2:0) + coords[0] +"px",
                    height: (h+(status=="v"?-10:0))+"px",
                    top: coords[1] + "px"
                });

                tooltip_contents.select("h4")
                    .text(function() {
                        return info.properties.name;
                    });

                tooltip_contents.select(".proj")
                    .html(function() {
                        var from=info.properties.projection_info["winner2010"].toLowerCase(),
                            to=info.properties.projection;

                        //console.log(info.properties.projection_info)

                        var swings={
                            "Const":"constituency and national polling",
                            "National":"national polling",
                            "NI":"Northern Ireland polling",
                            "Wales":"polling in Wales",
                            "Scotland":"Scotland-wide polling"
                        }
                        /*
                        if(from!==to) {
                            return "<span class=\""+to+"\">" + names[to] + "<\/span> gain from <span class=\""+from+"\">" + names[from] + "<\/span>, based on "+swings[info.properties.projection_info.source];    
                        }
                        return "<span class=\""+to+"\">" + names[to] + "<\/span> hold, based on "+swings[info.properties.projection_info.source];    
                        */
                        if(from!==to) {
                            return "<b>" + names[to] + "<\/b> gain from <b>" + names[from] + "<\/b>, based on "+swings[info.properties.projection_info.source];    
                        }
                        return "<b>" + names[to] + "<\/b> hold, based on "+swings[info.properties.projection_info.source];    
                    });

            };

        }

    }

    var names = {
                "con": "Conservative",
                "libdem": "Lib Dem",
                "ukip": "UKIP",
                "others": "Others",
                "pc": "PC",
                "green": "Green",
                "snp": "SNP",
                "lab": "Labour",
                "dup": "DUP",
                "Alliance": "Alliance",
                "SDLP": "SDLP",
                "SF": "SF",
                "Ind": "Ind"
            };

    d3.selection.prototype.moveToFront = function() {
      return this.each(function(){
      this.parentNode.appendChild(this);
      });
    };

    return UKCartogramComparison;

});
