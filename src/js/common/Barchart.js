define([
    'd3'
], function(
    d3
) {
   'use strict';

   function Barchart(data,options) {

		var WIDTH=180,
			HEIGHT=100;

		var margins={
			top:0,
			bottom:15,
			left:50,
			right:5
		};

		var padding={
			top:0,
			bottom:0,
			left:0,
			right:0
		};
		
		
		var chart=d3.select(options.container)
				.append("div")
					.attr("id","#bc")
					.attr("class","barchart hidden")
					.style({
						width:WIDTH+"px",
						height:HEIGHT+"px"
					})
		var svg=chart
				.append("svg")
					.attr("width",WIDTH)
					.attr("height",HEIGHT);

		var axes=svg.append("g")
					.attr("id","axes")
					.attr("transform","translate("+(margins.left)+","+(HEIGHT-margins.bottom)+")");

		var barchart=svg.append("g")
				.attr("class","barchart")
				.attr("transform","translate("+(margins.left)+","+(margins.top)+")");

		
		var extents={
			x1:d3.extent(data,function(d){
				return d.bucket;
			}),
			x:d3.extent(data,function(d){
				return d.qty;
			}),
			y:data.map(function(d){return d.descr;})
		};
		
		
		//console.log(xs)

		/*var xscale=d3.scale.ordinal().domain(xs).rangePoints([0,WIDTH-(margins.left+margins.right+padding.left+padding.right)]);
		
		var yscale=d3.scale.linear()
						.domain([0,extents.y[1]])
						.range([HEIGHT-(margins.bottom+margins.top),0]).nice();*/

		var xscale=d3.scale.linear()
						.domain([0,extents.x[1]])
						.range([0,WIDTH-(margins.left+margins.right+padding.left+padding.right)]).nice()
		var yscale=d3.scale.ordinal().domain(extents.y).rangeBands([0,HEIGHT-(margins.bottom+margins.top)],0.2);
		var yaxis;
		var bars = barchart.selectAll("g.bar")
					.data(data)
					.enter()
					.append("g")
						.attr("rel",function(d){
							return d.descr+", "+d.qty;
						})
						.attr("class","bar")
						/*.classed("selected",function(d,i){
							return i===options.default
						})*/
						.attr("transform",function(d){
							var x=0,
								y=yscale(d.descr);//HEIGHT-(margins.bottom+margins.top);//-yscale(d.qty);
							return "translate("+x+","+y+")";
						})
						.on("mouseover",function(d){
							console.log(d,yaxis.selectAll(".tick"))
							svg
								.select(".y.axis")
									.selectAll(".tick")
										.classed("highlight",function(t){
											//console.log(d,t)
											return d.descr==t;
										})
							var selected=d3.select(this).classed("selected");
							bars
								.classed("selected",function(b){
									return b.descr == d.descr && !selected;
								});
							svg
								.select(".y.axis")
									.selectAll(".tick")
										.classed("selected",function(t){
											return d.descr==t && !selected;
										});
							
							if(options.onClickCallback) {
								options.onClickCallback(selected?null:d);
							}
						})
						.on("mouseout",function(d){
							svg
								.select(".y.axis")
								.selectAll(".tick")
									.classed("highlight",false)
						})
						.on("click",function(d){
							var selected=d3.select(this).classed("selected");
							bars
								.classed("selected",function(b){
									return b.descr == d.descr && !selected;
								});
							svg
								.select(".y.axis")
									.selectAll(".tick")
										.classed("selected",function(t){
											return d.descr==t && !selected;
										});
							
							if(options.onClickCallback) {
								options.onClickCallback(selected?null:d);
							}
						})

		var w=(WIDTH-(margins.left+margins.right+padding.left+padding.right))/yscale.domain().length;

		//console.log(xscale.range()[1],bars.data().length-1)
		bars.append("rect")
					.attr("x",0)
					.attr("width",function(d){
						return xscale(d.qty)
					})
					.attr("height",function(d){
						return yscale.rangeBand();
					})

		bars.append("rect")
					.attr("class","ix")
					.attr("x",-margins.left)
					.attr("width",function(d){
						return WIDTH;
					})
					.attr("height",function(d){
						return yscale.rangeBand()*1.1;
					})

		


		var xAxis = d3.svg.axis().scale(xscale).tickValues(xscale.ticks(3).filter(function(d){return d>0;}));
		var yAxis = d3.svg.axis().scale(yscale).orient("left");//.tickValues(yscale.ticks(3).filter(function(d){return d>0;}));


		var xaxis=axes.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate("+(0)+",0)")
	      .call(xAxis)
	      	.selectAll("text")
	      	.attr("dy","2px")

	   

	    
	    

	    yaxis=axes.append("g")
	      .attr("class", "y axis")
	      .attr("transform", "translate(0,"+(-(HEIGHT-(margins.bottom+margins.top)))+")")
	      .call(yAxis)
	      	.selectAll(".tick")
	      		/*.classed("selected",function(d,i){
					return i===options.default
				})*/
	      		.select("text")
	      			.attr("dy","0.3em")

	    axes.selectAll("line.ygrid")
				.data(xscale.ticks(3).filter(function(d){return d>0;}))
	    		.enter()
	    		.append("line")
	    			.attr("class","ygrid")
	    			.attr("x1",function(d){
	    				return xscale(d);
	    			})
	    			.attr("x2",function(d){
	    				return xscale(d);
	    			})
	    			.attr("y1",function(d){
	    				return  0;
	    			})
	    			.attr("y2",function(d){
	    				return  - (HEIGHT - (margins.top+margins.bottom));
	    			});
				

	    
		function selectTick(bucket) {

			barchart
				.selectAll("g.circle")
				.classed("selected",function(t){
					return bucket==t.descr;
				});

			svg.select(".x.axis")
				.selectAll(".tick")
					.classed("selected",function(t){
						return bucket==t.descr;
					});

			//timeSelector.select(time);
		}
		//console.log(xscale.domain())
		selectTick(xscale.domain()[xscale.domain().length-1]);

		this.show=function(status){
			if(chart.classed("hidden")) {
				svg
					.select(".y.axis")
						.selectAll(".tick")
			      		/*.classed("selected",function(d,i){
							return i===options.default
						})*/

				/*bars.classed("selected",function(b,i){
									return i === options.default;
								});*/

			}
			d3.select(options.container).select(".barchart").classed("hidden",!status);			
		}
	}

   return Barchart;

});
