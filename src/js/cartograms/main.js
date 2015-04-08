define([
    'd3',
    'cartograms/UKCartogram',
    'cartograms/UKCartogramComparison',
    'cartograms/ReferenceMap',
    'edd/ElectionPollDropdown'
], function(
    d3,
    UKCartogram,
    UKCartogramComparison,
    ReferenceMap,
    ElectionPollDropdown
) {
    'use strict';
    
    function render(projections,topo,regions) {
        
        new ElectionPollDropdown(topo.objects.hexagons.geometries,{
            onSelect:function(constituencyCode) {
                ukCartogram.selectConstituency(constituencyCode);
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
                scale_factor:2,
                center:[0, 51.6]
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
                scale_factor:2,
                center:[-2, 51.15]
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
            height:300,
            geom: {
                scale_factor:2,
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
                scale_factor:2,
                center:[2, 52]
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