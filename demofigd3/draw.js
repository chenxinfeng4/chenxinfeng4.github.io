var width = 960,
    height = 700,
    radius = Math.min(width, height) / 2,
    color = d3.scale.category20c();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height * .52 + ")");

var partition = d3.layout.partition()
    .sort(null)
    .size([2 * Math.PI, radius * radius])
    .value(function(d) { return 1; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx; })
    .innerRadius(function(d) { return Math.sqrt(d.y)-60; })
    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy)-60; });

var texthint2 = d3.select("body").selectAll("svg")
					.append("g")
					.append("text")
					.attr("x","50%")
					.attr("y","50%")
					.attr("text-anchor","middle")
					.attr("class","caption");
texthint2.append("tspan")
		.attr("x","50%")
		.attr("class", "name")
		.attr("dy", 0)
		.attr("font-weight","bold");
texthint2.append("tspan")
		.attr("x","50%")
		.attr("class", "value")
		.attr("dy", 50);
var texthint = d3.select("body").selectAll("svg")
					.append("g")
					.append("text")
					.attr("x","50%")
					.attr("y","55%")
					.attr("text-anchor","middle")
					.attr("font-weight","bold")
					.attr("font-size","50px")
					.text(myfile);
					
var stylepre = null;
d3.json(myfile+".json", function(error, root) {
  if (error) throw error;

  var path = svg.datum(root).selectAll("path")
      .data(partition.value(function(d){ return  d.size;}).nodes)
    .enter().append("path")
      .attr("display", function(d) {
		  if (! d.depth) return "none";
		  if (d.name == "_gap_")  return "none";
		  return null; 
		}) // hide inner ring
      .attr("d", arc)
      .style("stroke", "#fff")
      .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
      .style("fill-rule", "evenodd")
      .each(stash);

	path.on("mouseover", function(d,i){
		// 文字提示
		texthint2.selectAll(".name").text(d.name);
		texthint2.selectAll(".value").text(d.value.toFixed(1));
		texthint.text("")
		stylepre = d3.select(this)
			.attr("style")
		var res = stylepre + "stroke: rgb(0,0,0); fill: rgb(0,0,0)"
		d3.select(this).attr("style", res)
	})
	.on("mouseout", function(){
		d3.select(this).attr("style", stylepre)
		// 文字提示
		texthint2.selectAll(".name").text("");
		texthint2.selectAll(".value").text("");
		texthint.text(myfile)
	})
/*
  d3.selectAll("input").on("change", function change() {
//    var value = this.value === "count"
//        ? function() { return 1; }
//        : function(d) { return d.size; };
	var value = function(d) { return  d.size; };
    path
        .data(partition.value(value).nodes)
      .transition()
        .duration(1500)
        .attrTween("d", arcTween);
  });*/
});

// Stash the old values for transition.
function stash(d) {
  d.x0 = d.x;
  d.dx0 = d.dx;
}

// Interpolate the arcs in data space.
function arcTween(a) {
  var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
  return function(t) {
    var b = i(t);
    a.x0 = b.x;
    a.dx0 = b.dx;
    return arc(b);
  };
}

//d3.select(self.frameElement).style("height", height + "px");

