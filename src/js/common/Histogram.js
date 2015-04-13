define([
    'd3'
], function(
    d3
) {
   'use strict';

   function Histogram(data,options) {

		var WIDTH=200,
			HEIGHT=100;

		var margins={
			top:20,
			bottom:15,
			left:30,
			right:20
		}

		var padding={
			top:0,
			bottom:0,
			left:0,
			right:0
		}
		var timeSelector;
		
		var svg=d3.select(options.container)
				.append("div")
					.attr("id","#ht")
					.attr("class","histogram hidden")
					.style({
						width:WIDTH+"px",
						height:HEIGHT+"px"
					})
				.append("svg")
					.attr("width",WIDTH)
					.attr("height",HEIGHT);

		var defs=svg.append("defs")
				.append("pattern")
					.attr({
						id:"diagonalHatch",
						width:3,
						height:3,
						patternTransform:"rotate(-45 0 0)",
						patternUnits:"userSpaceOnUse"
					});
		defs.append("rect")
						.attr({
							x:0,
							y:0,
							width:4,
							height:4
						})
						.style({
							stroke:"none",
							fill:"#fff"
						})
		defs
			.append("line")
			.attr({
				x0:0,
				y1:0,
				x2:0,
				y2:4
			})
			.style({
				stroke:"#A06535",
				"stroke-width":1
			})

		var axes=svg.append("g")
					.attr("id","axes")
					.attr("transform","translate("+(margins.left)+","+(HEIGHT-margins.bottom)+")");

		var linechart=svg.append("g")
				.attr("class","linechart")
				.attr("transform","translate("+(margins.left)+","+(margins.top)+")");

		
		var extents={
			x1:d3.extent(data,function(d){
				return d.bucket;
			}),
			y:d3.extent(data,function(d){
				return d.qty;
			})
		}

		//var xscale=d3.scale.linear().domain(extents.x).range([0,WIDTH-(margins.left+margins.right+padding.left+padding.right)]);
		
		var xs=data.map(function(d){return d.descr});
		//console.log(xs)

		var xscale=d3.scale.ordinal().domain(xs).rangePoints([0,WIDTH-(margins.left+margins.right+padding.left+padding.right)]);
		
		var yscale=d3.scale.linear()
						.domain([0,extents.y[1]])
						.range([HEIGHT-(margins.bottom+margins.top),0]).nice();

		var bars = linechart.selectAll("g.bar")
					.data(data)
					.enter()
					.append("g")
						.attr("rel",function(d){
							return d.bucket+", "+d.qty;
						})
						.attr("class","bar")
						.attr("transform",function(d){
							var x=xscale(d.descr),
								y=yscale(d.qty);//HEIGHT-(margins.bottom+margins.top);//-yscale(d.qty);
							return "translate("+x+","+y+")";
						})
						.on("mouseover",function(d){
							d3.select(".x.axis")
								.selectAll(".tick")
									.classed("highlight",function(t){
										return d.bucket==t;
									})
						})
						.on("mouseout",function(d){
							d3.select(".x.axis")
								.selectAll(".tick")
									.classed("highlight",false)
						})
						.on("click",function(d){
							if(options.onClickCallback) {
								options.onClickCallback(d);
							}
						})

		var w=(WIDTH-(margins.left+margins.right+padding.left+padding.right))/xscale.domain().length;

		//console.log(xscale.range()[1],bars.data().length-1)
		bars.append("rect")
					.attr("x",-w/4)
					.attr("y",function(d){
						return 0;//-yscale(d.qty);
					})
					.attr("width",w/2)
					.attr("height",function(d){
						return HEIGHT-(margins.bottom+margins.top) - yscale(d.qty);
					})

		bars.append("rect")
					.attr("class","ix")
					.attr("x",-w/2)
					.attr("y",function(d){
						return -yscale(d.qty)-margins.top;
					})
					.attr("width",w)
					.attr("height",function(d){
						return HEIGHT;
					})

		


		var xAxis = d3.svg.axis().scale(xscale).tickSize(3);
		var yAxis = d3.svg.axis().scale(yscale).orient("left").tickValues(yscale.ticks(3).filter(function(d){return d>0;}));

		
		var ytickFormat=function(d,i){
			var title="";
			if(i==yAxis.tickValues().length-1) {
				title=" ACTIVE REPOSITORIES";
			}
			return d3.format("s")(d)+title;
		}
		
		//xAxis.tickFormat(xtickFormat);
		//yAxis.tickFormat(ytickFormat);

		var xaxis=axes.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate("+(0)+",0)")
	      .call(xAxis)

	    xaxis.append("line")
	    		.attr("class","axis")
	    		.attr("x1",-w/2)
	    		.attr("y1",0)
	    		.attr("x2",WIDTH-(margins.left+margins.right)+w/2)
	    		.attr("y2",0)

	    
	    

	    axes.append("g")
	      .attr("class", "y axis")
	      .attr("transform", "translate(0,"+(-(HEIGHT-(margins.bottom+margins.top)))+")")
	      .call(yAxis)
	      	.selectAll("text")
	      	.attr("dy","-0.3em")

	    axes.selectAll("line.ygrid")
				.data(yscale.ticks(3).filter(function(d){return d>0;}))
	    		.enter()
	    		.append("line")
	    			.attr("class","ygrid")
	    			.attr("x1",-w/2)
	    			.attr("x2",WIDTH-(margins.left+margins.right)+w/2)
	    			.attr("y1",function(d){
	    				return  - ((HEIGHT - (margins.top+margins.bottom)) - yscale(d));
	    			})
	    			.attr("y2",function(d){
	    				return  - ((HEIGHT - (margins.top+margins.bottom)) - yscale(d));
	    			});
				

	    
		function selectTick(bucket) {

			linechart
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
			d3.select(options.container).select(".histogram").classed("hidden",!status)
		}
	}

   return Histogram;

});
