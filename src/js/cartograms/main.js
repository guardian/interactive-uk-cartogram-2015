define([
    'd3',
    'cartograms/UKCartogram',
    'cartograms/UKCartogramComparison',
    'cartograms/ReferenceMap',
    'common/ConstituencyDropdown',
    'common/ConstituencyExpand'
], function(
    d3,
    UKCartogram,
    UKCartogramComparison,
    ReferenceMap,
    ConstituencyDropdown,
    ConstituencyExpand
) {
    'use strict';
    
    function render(projections,topo,regions) {
        
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
            container:"#ukProjections .cartogram",
            id:"ukProjection",
            width:560,
            height:560,
            geom: {
                scale_factor:1.8,
                center:[1, 54.6]
            },
        });

        
        new UKCartogramComparison(projections, topo, regions,{
            container:"#jsLondon .cartogram",
            id:"lnd",
            regions:["London"],
            geom: {
                scale_factor:3.4,
                center:[0.8, 51.6]
            },
            clipPath:true,
            fadeOut:true
        });
        
        new ReferenceMap(regions,{
            container:"#jsLondon .small-map",
            regions:["London"]
        })

        new UKCartogramComparison(projections, topo, regions,{
            container:"#jsSouthwest .cartogram",
            id:"sw",
            regions:["South West"],
            geom: {
                scale_factor:3.4,
                center:[-1.5, 51.15]
            },
            clipPath:true,
            fadeOut:true
        });

        new ReferenceMap(regions,{
                    container:"#jsSouthwest .small-map",
                    regions:["South West"]
                })

        new UKCartogramComparison(projections, topo, regions,{
            container:"#jsScotland .cartogram",
            id:"sct",
            regions:["Scotland"],
            height:440,
            geom: {
                scale_factor:3.4,
                center:[-1.2, 57.1]
            },
            clipPath:true,
            fadeOut:true
        });

        new ReferenceMap(regions,{
                    container:"#jsScotland .small-map",
                    regions:["Scotland"]
                });

        new UKCartogramComparison(projections, topo, regions,{
            container:"#jsEast .cartogram",
            id:"east",
            height:440,
            regions:["Eastern","South East"],
            geom: {
                scale_factor:3.4,
                center:[0.8, 52]
            },
            clipPath:true,
            fadeOut:true
            
        });

        new ReferenceMap(regions,{
            container:"#jsEast .small-map",
            regions:["Eastern","South East"]
        });

    }

    

    return {
        render: render
    };
});
