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
    		HEIGHT = 200,
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
            width:options.width || WIDTH
        });

    	var mapsTable = new MapsTable(parties, topo, topoRegions, {
    		container: options.container,
    		width: options.width || WIDTH,
    		height: options.height || 300,
    		geom:options.geom,
    		id:options.id,
    		xscale:xscale,
    		regions:options.regions,
    		clipPath:options.clipPath,
    		fadeOut:options.fadeOut,
            tooltip:tooltip
    	});



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
            console.log("Tooltip",options)

            

            var tooltip = d3.select(options.container)
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
            this.show = function(info, coords) {

                //console.log(info,coords);

                tooltip.style({
                    display:"block",
                    left: (coords[0]+(options.left||0))  + "px",
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

    return UKCartogramComparison;

});