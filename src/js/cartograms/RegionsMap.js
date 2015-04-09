define([
    'd3',
    'topojson',
], function(
    d3,
    topojson
) {
   'use strict';
       
    function RegionsMap(topo,options) {

        //console.log("RegionsMap",topo)

        var WIDTH = options.width || 300,
            HEIGHT = options.height || 300;

        
        var scale = 2000;
        scale*=((options.geom && options.geom.scale_factor)?options.geom.scale_factor:1);

        var projection = d3.geo.transverseMercator()
            .scale(scale)
            .translate([HEIGHT / 2, HEIGHT / 2])
            .center((options.geom && options.geom.center)?options.geom.center:[2, 54.1])
            .rotate([2,0])
            .precision(.1);

        var path = d3.geo.path()
            .projection(projection);

        var map,
            svg=options.svg;




        var regionsMap=options.map_g.append("g")
            .attr("class","regions "+options.field);


        var regions=!options.regions?topo.objects.regions:(function(){
            
            return {
                crs:topo.objects.regions.crs,
                type:topo.objects.regions.type,
                geometries:topo.objects.regions.geometries.filter(function(c){
                    return options.regions.indexOf(c.properties.region)>-1;
                })
            };

        }());

        

        regionsMap
            .selectAll("path")
            .data(topojson.feature(topo, regions).features)
            .enter()
            .append("path")
            .attr("d", function(d) {
                return path(d);
            })
            .classed("main",function(c){
                return options.main_regions && options.main_regions.indexOf(c.properties.region)>-1;
            })
            .classed("highlight",function(c){
                return options.highlight && options.highlight.indexOf(c.properties.region)>-1;
            })
            .each(function(c){
                if(options.main_regions && options.main_regions.indexOf(c.properties.region)>-1) {
                    d3.select(this).moveToFront();
                }
            })


        if(typeof options.left != 'undefined') {
            regionsMap.attr("transform","translate("+(options.left)+",0)");
        }

        this.zoom=function(translate,scale) {
            regionsMap.transition()
                        .ease(d3.ease("linear"))
                        .duration(500)
                        .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
        }
        this.resetZoom=function(translate,zoom) {
            regionsMap.transition()
                        .ease(d3.ease("linear"))
                        .duration(500)
                        .attr("transform", "translate(0,0)scale(1)");
        }

        function addBorders() {
            

            if(!svg.select("defs").selectAll("linearGradient.borders").size()) {

                //WHY THIS DOESNT WORK?!?!?!?!?!?!?!?!?!?!?!?!?

                var gradients=[
                    {
                        position:"top",
                        x1:0,
                        x2:0,
                        y1:0,
                        y2:1
                    },
                    {
                        position:"right",
                        x1:1,
                        x2:0,
                        y1:0,
                        y2:0
                    },
                    {
                        position:"bottom",
                        x1:0,
                        x2:0,
                        y1:1,
                        y2:0
                    },
                    {
                        position:"left",
                        x1:0,
                        x2:1,
                        y1:0,
                        y2:0
                    }
                ];
                var borderGradients=svg.select("defs")
                            .selectAll("linearGradient.borders")
                            .data(gradients,function(d){
                                return d.position;
                            })
                            .enter();

                var gradient=borderGradients
                            .append("linearGradient")
                                .attr("class","borders")
                                .attr("id",function(d){
                                    //console.log("adding ",d)
                                    return "borderGrad_"+d.position
                                })
                                .attr("x1",function(d){
                                    return d.x1;
                                })
                                .attr("y1",function(d){
                                    return d.y1;
                                })
                                .attr("x2",function(d){
                                    return d.x2;
                                })
                                .attr("y2",function(d){
                                    return d.y2;
                                });


                gradient.append("stop")
                            .attr({
                                offset:"0%",
                                "stop-color":"#fff",
                                "stop-opacity":1
                            });
                gradient.append("stop")
                            .attr({
                                offset:"100%",
                                "stop-color":"#fff",
                                "stop-opacity":0
                            });
            }

            


            var borders=options.map_g.append("g")
                            .attr("class","borders")
                            .attr("transform","translate("+options.left+",0)"),
                thickness=30,
                w=svg.attr("width"),
                h=svg.attr("height");

            //left
            borders.append("rect")
                    .attr("x",0)
                    .attr("y",0)
                    .attr("width",thickness)
                    .attr("height",h)
                    .style("fill","url(#borderGrad_left)");
            //top
            borders.append("rect")
                    .attr("x",0)
                    .attr("y",0)
                    .attr("width",w)
                    .attr("height",thickness)
                    .style("fill","url(#borderGrad_top)");
            //right
            borders.append("rect")
                    .attr("x",w-thickness)
                    .attr("y",0)
                    .attr("width",thickness)
                    .attr("height",h)
                    .style("fill","url(#borderGrad_right)");
            //bottom
            borders.append("rect")
                    .attr("x",0)
                    .attr("y",h-thickness)
                    .attr("width",w)
                    .attr("height",thickness)
                    .style("fill","url(#borderGrad_bottom)");

            if(options.clipPath) {
                var clipPath=svg.select("defs").append("clipPath")
                            .attr("id","clip");

                clipPath.append("rect")
                            .attr("x",0)
                            .attr("y",0)
                            .attr("width",w)
                            .attr("height",h);

            
                regionsMap
                    .attr("clip-path","url(#clip)")        
            }
        }

        if(options.fadeOut) {
            addBorders();
        }
    }

    return RegionsMap;

});