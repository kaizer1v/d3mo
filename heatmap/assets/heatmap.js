var W = 960,
    H = 600;

var svg = d3.select("#india")
  .append("svg")
  .attr("width", W)
  .attr("height", H);

d3.json("assets/india-coordinates.json", function(error, coords) {
  if (error) return console.error(error);

  var subunits = topojson.feature( coords, coords.objects[Object.keys(coords.objects)[0]] );

  var projection = d3.geo.mercator()
    .scale(1000)
    .translate([-W + 100, H + 100]);

  var path = d3.geo.path()
    .projection(projection);

  svg.selectAll(".subunits")
    .data(subunits.features)
    .enter().append("path")
    .attr("class", function(d) { return "subunit "+ d.properties.ST_ID })
    .attr("title", function(d) { return d.properties.ST_NM; })
    .attr("d", path)
    // remove below attributes once mesh is applied
    .attr("fill", "none")
    .attr("stroke-width", 0.7)
    .attr("stroke", "#333");

  svg.append("path")
    .datum(topojson.mesh(coords, subunits))
    .attr("d", path)
    .attr("fill", "none")
    .attr("class", "subunit-border");

});