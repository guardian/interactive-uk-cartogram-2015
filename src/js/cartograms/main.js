define([
    'd3',
    'cartograms/UKCartogram',
    'cartograms/UKCartogramComparison',
    'cartograms/ReferenceMap',
    'common/ConstituencyDropdown',
    'common/ConstituencyExpand',
    'common/utilities'
], function(
    d3,
    UKCartogram,
    UKCartogramComparison,
    ReferenceMap,
    ConstituencyDropdown,
    ConstituencyExpand,
    util
) {
    'use strict';

    function render(projections,topo,regions) {

        var body=document.querySelector("body"),
            width=body.clientWidth || body.offsetWidth;

        new ConstituencyDropdown(topo.objects.hexagons.geometries,{
            onSelect:function(constituencyCode) {
                var constituency=ukCartogram.selectConstituency(constituencyCode);

                // expand component:
                var c = constituency.properties,
                    p = c.projection_info;
                ConstituencyExpand.updateData(c.constituency, c.name, p.winner2010, p.projection, p.source);
                ConstituencyExpand.updateView(1); //0:collapse, 1:expand
            }
        });

        var ukCartogram=new UKCartogram(projections, topo, regions,{
            container:"#ukProjections .cartogram .center",
            id:"ukProjection",
            width:460,
            height:640,
            selected_geom:(width<490*2?"small":"normal"),
            geom:{
                normal:{
                    width:460,
                    height:640,
                    scale_factor:2,
                    center:[1, 54.45]
                },
                small:{
                    width:310,
                    height:640,
                    scale_factor:1.6,
                    center:[2.9, 54.45]
                }
            }
        });

        var mapsData=[
            {
                container:"#jsLondon",
                id:"lnd",
                regions:["London"],
                geom:{
                    normal:{
                        width:460,
                        height:440,
                        scale_factor:3.4,
                        center:[0.8, 51.6]
                    },
                    small:{
                        width:310,
                        height:280,
                        scale_factor:2,
                        center:[0.8, 51.6]
                    }
                }
            },
            {
                container:"#jsSouthwest",
                id:"sw",
                regions:["South West"],
                geom:{
                    normal:{
                        width:460,
                        height:440,
                        scale_factor:3.4,
                        center:[-1.5, 51.15]
                    },
                    small:{
                        width:310,
                        height:280,
                        scale_factor:2,
                        center:[-1.5, 51.15]
                    }
                }
            },
            {
                container:"#jsScotland",
                id:"sct",
                regions:["Scotland"],
                height:440,
                geom:{
                    normal:{
                        width:460,
                        height:440,
                        scale_factor:3.4,
                        center:[-1.2, 57.1]
                    },
                    small:{
                        width:310,
                        height:280,
                        scale_factor:2,
                        center:[-1, 57]
                    }
                }
            },
            {
                container:"#jsEast",
                id:"east",
                height:440,
                regions:["Eastern","South East"],
                geom:{
                    normal:{
                        width:460,
                        height:440,
                        scale_factor:3.4,
                        center:[0.8, 52]
                    },
                    small:{
                        width:310,
                        height:330,
                        scale_factor:2,
                        center:[1.5, 52]
                    }
                }
            },
            {
                container:"#jsNorth",
                id:"east",
                height:440,
                regions:["North East","North West","Yorkshire and the Humber"],
                geom:{
                    normal:{
                        width:460,
                        height:440,
                        scale_factor:3.4,
                        center:[-0.2, 54.5]
                    },
                    small:{
                        width:310,
                        height:330,
                        scale_factor:2,
                        center:[-0.2, 54.5]
                    }
                }
            }
        ];

        var maps=[{map:ukCartogram}];

        mapsData.forEach(function(m){

            maps.push({
                map:new UKCartogramComparison(projections, topo, regions,{
                    container:m.container+" .cartogram",
                    id:m.id,
                    regions:m.regions,
                    height:m.height,
                    geom:m.geom,
                    geom_normal: m.geom_normal,
                    geom_small: m.geom_small,
                    selected_geom:(width<490*2?"small":"normal"),
                    clipPath:true,
                    fadeOut:true
                })
            });
        });

        function resize(size) {

            maps.forEach(function(m) {
                m.map.resize(size);
            });
        };

        var to=null;
        window.addEventListener('resize', function(event){
            if(to) {
                clearTimeout(to);
                to=null;
            }
            to=setTimeout(function(){
                var width=body.clientWidth || body.offsetWidth;
                resize(width<490*2?"small":"normal");
            },100)

        });

        window.applySameFilter=function(par) {
            ukCartogram.applyFilter("same",par);
        };

        window.applyContestFilter=function(par) {
            ukCartogram.applyFilter("contest",par);
        };

        window.removeFilters=function(par) {
            ukCartogram.applyFilter("none");
        };
        
        var btnParentID = "jsStandfirst",
            btnClass = "btn-standfirst",
            addClass = "selected";
        d3.select("#jsThe650seats")
        .on("click",function(){
            ukCartogram.applyFilter("none");
            util.selectRadioBtn(btnParentID, "jsThe650seats", btnClass, addClass);
        })
        d3.select("#jsChangehands")
        .on("click",function(){
            ukCartogram.applyFilter("same",true);
            util.selectRadioBtn(btnParentID, "jsChangehands", btnClass, addClass);
        })
        d3.select("#jsBattlegroundseats")
        .on("click",function(){
            ukCartogram.applyFilter("contestRange");
            util.selectRadioBtn(btnParentID, "jsBattlegroundseats", btnClass, addClass);
        })

    }



    return {
        render: render
    };
});
