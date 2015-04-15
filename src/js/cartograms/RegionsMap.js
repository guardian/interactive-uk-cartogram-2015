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

        var map,
            svg=options.svg;

        svg.attr("width", WIDTH)
            .attr("height", HEIGHT);


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
            .data(topojson.feature(topo, regions).features.filter(function(d){
                return d.geometry.type!="Point";
            }))
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

        regionsMap
            .selectAll("text.m-labels-below")
            .data(topojson.feature(topo, regions).features.filter(function(d){
                return d.geometry.type=="Point" && d.properties.abbr;
            }))
            .enter()
            .append("text")
                .attr("class","m-labels-below")
                    .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
                    .attr("dy", "-.35em")
                    .text(function(d){
                        return d.properties[options.textField] || d.properties.name;
                    });

        regionsMap
            .selectAll("text.m-labels")
            .data(topojson.feature(topo, regions).features.filter(function(d){
                return d.geometry.type=="Point" && d.properties.abbr;
            }))
            .enter()
            .append("text")
                .attr("class","m-labels")
                    .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
                    .attr("dy", "-.35em")
                    .text(function(d){
                        return d.properties[options.textField] || d.properties.name;
                    });

        regionsMap
            .selectAll("text.city-below")
            .data(topojson.feature(topo, regions).features.filter(function(d){
                return d.geometry.type=="Point" && !d.properties.abbr;
            }))
            .enter()
            .append("text")
                .attr("class","m-labels-below city-below")
                    .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
                    .attr("dy", "-.35em")
                    .text(function(d){
                        return d.properties[options.textField] || d.properties.name;
                    });
        regionsMap
            .selectAll("text.city")
            .data(topojson.feature(topo, regions).features.filter(function(d){
                return d.geometry.type=="Point" && !d.properties.abbr;
            }))
            .enter()
            .append("text")
                .attr("class","m-labels city")
                    .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
                    .attr("dy", "-.35em")
                    .text(function(d){
                        return d.properties[options.textField] || d.properties.name;
                    });

        regionsMap
            .selectAll("circle.city")
            .data(topojson.feature(topo, regions).features.filter(function(d){
                //console.log(d.properties)
                return d.geometry.type=="Point" && !d.properties.abbr;
            }))
            .enter()
            .append("circle")
                .attr("class","city")
                    .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
                    .attr("cx",0)
                    .attr("cy",0)
                    .attr("r",2)

        if(typeof options.left != 'undefined') {
            regionsMap.attr("transform","translate("+(options.left)+",0)");
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

            regionsMap
                .selectAll("path")
                    .attr("d", function(d) {
                        return path(d);
                    });

            regionsMap
                .selectAll("text")
                    .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; });
            
            regionsMap
                .selectAll("circle.city")
                    .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; }) 

            var thickness=options.border_thickness || 30,
                h=svg.attr("height");

            
            options.map_g.select("g.borders")
                        .selectAll("rect")
                            .data(getBordersData(WIDTH,h,thickness))
                                .attr("x",function(d){
                                    //console.log("setting ",d.x)
                                    return d.x;
                                })
                                .attr("y",function(d){
                                    return d.y;
                                })
                                .attr("width",function(d){
                                    return d.width;
                                })
                                .attr("height",function(d){
                                    return d.height;
                                })
                                

            if(options.clipPath) {
                var clipPath=svg.select("defs").append("clipPath")
                            .attr("id","clip");

                clipPath.select("rect")
                            .attr("x",0)
                            .attr("y",0)
                            .attr("width",WIDTH)
                            .attr("height",h);

            
                regionsMap
                    .attr("clip-path","url(#clip)")        
            }
 

        }

        this.resize=function(size){
            resize(size);
        }

        this.zoom=function(translate,scale) {


            regionsMap
                    .selectAll("path")
                    .transition()
                        .ease(d3.ease("linear"))
                        .duration(500)
                        .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
            regionsMap
                    .selectAll("text,circle")
                    .transition()
                        .ease(d3.ease("linear"))
                        .duration(500)
                        .attr("transform", function(d){
                            var c=d.properties.ocoords;
                            if(!d.properties.ocoords) {
                                c=d3.select(this).attr("transform").replace("translate(","").replace(")","").split(",");    
                                d.properties.ocoords=[+c[0],+c[1]];
                            }

                            var diffs=[+c[0]+translate[0],+c[1]+translate[1]];

                            return "translate("+(+c[0]+diffs[0])+","+(+c[1]+diffs[1])+")"

                        });
        }
        this.resetZoom=function(translate,zoom) {
            regionsMap
                    .selectAll("path")
                    .transition()
                        .ease(d3.ease("linear"))
                        .duration(500)
                        .attr("transform", "translate(0,0)scale(1)");

            regionsMap
                    .selectAll("text,circle")
                    .transition()
                        .ease(d3.ease("linear"))
                        .duration(500)
                        .attr("transform", function(d){
                            var c=d.properties.ocoords;
                            if(!d.properties.ocoords) {
                                c=d3.select(this).attr("transform").replace("translate(","").replace(")","").split(",");    
                                d.properties.ocoords=[+c[0],+c[1]];
                            }

                            var diffs=[0,0];

                            return "translate("+(+c[0]+diffs[0])+","+(+c[1]+diffs[1])+")"

                        });
        }
        function getBordersData(w,h,thickness) {
            
            return [
                {
                    x:0,
                    y:0,
                    width:thickness,
                    height:h,
                    fill:"url(#borderGrad_left)"
                },
                {
                    x:0,
                    y:0,
                    width:w,
                    height:thickness,
                    fill:"url(#borderGrad_top)"
                },
                {
                    x:w-thickness,
                    y:0,
                    width:thickness,
                    height:h,
                    fill:"url(#borderGrad_right)"
                },
                {
                    x:0,
                    y:h-thickness,
                    width:w,
                    height:thickness,
                    fill:"url(#borderGrad_bottom)"
                }
            ];
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
                thickness=options.border_thickness || 30,
                w=svg.attr("width"),
                h=svg.attr("height");

            

            borders.selectAll("rect")
                        .data(getBordersData(w,h,thickness))
                        .enter()
                        .append("rect")
                            .attr("x",function(d){
                                return d.x;
                            })
                            .attr("y",function(d){
                                return d.y;
                            })
                            .attr("width",function(d){
                                return d.width;
                            })
                            .attr("height",function(d){
                                return d.height;
                            })
                            .style("fill",function(d){
                                return d.fill;
                            });

            

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
