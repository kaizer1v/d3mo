/* Sample data, with state abbreviation as keys */
var states_data = {
  "AN": 1,
  "AP": 29,
  "AS": 12,
  "BH": 46,
  "CG": 24,
  "CH": 9,
  "DH": 401,
  "DN": 1,
  "GJ": 124,
  "HP": 9,
  "HY": 97,
  "JH": 63,
  "JK": 10,
  "KL": 20,
  "KN": 91,
  "LD": 1,
  "MG": 3,
  "MH": 341,
  "MP": 72,
  "NL": 1,
  "OR": 21,
  "PB": 58,
  "PC": 2,
  "RJ": 119,
  "TG": 39,
  "TN": 88,
  "TR": 1,
  "UC": 13,
  "UP": 262,
  "WB": 143,
  "XX": 13,
  "XY": 172
};
var states_data_values = d3.values(states_data);
var min_state_value = d3.min(states_data_values);
var max_state_value = d3.max(states_data_values);
var mean_state_value = d3.mean(states_data_values);

// SVG settings
var W = 960,
    H = 600;
var svg = d3.select("#india")
  .append("svg")
  .attr("width", W)
  .attr("height", H);

// Create a scale for heatmap
var colorScale = d3.scale.linear()
  .domain([min_state_value, mean_state_value, max_state_value])
  .range(['#1A9850', '#FFFFBF', '#D73027']);

// Create a tooltip for showing interactive information
var tip = d3.tip()
  .attr('class', 'tooltip')
  .offset([-10, 0])
  .html(function(d) {
    var state_count = (states_data[d.properties.ST_ID]) ? states_data[d.properties.ST_ID] : 0;
    return "<span>"+ d.properties.ST_NM +": "+ state_count +"</span>";
  });
  // Append the tooltip to the svg
  svg.call(tip);

// Create a legend
var g = svg.insert("g", ":first-child")
  .attr("class", "key")
  .attr("transform", "translate(50, 70)");

g.selectAll("rect")
  .data(colorScale.range().map(function(d) {
      if (d[0] == null) d[0] = colorScale.domain()[0];
      if (d[1] == null) d[1] = colorScale.domain()[colorScale.domain.length - 1];
      return d;
    }))
  .enter().append("rect")
    .attr("height", 8)
    .attr("width", 50)
    .attr("x", function(d, i) { return i*50; })
    .attr("fill", function(d) { return d; });

// Labels to the Legend
g.append("text")
  .attr("class", "caption")
  .attr("x", colorScale.range()[0])
  .attr("y", -6)
  .attr("fill", "#000")
  .attr("text-anchor", "start")
  .attr("font-weight", "bold")
  .text("Random Legend Heat Map");

var legendScale = d3.scale.ordinal()
  .domain(colorScale.range())
  .range([0, colorScale.domain().length * 50]);

var xAxis = d3.svg.axis()
  .scale(legendScale)
  .ticks(5)
  .tickFormat(function(x, i) { return x; })
  .tickValues(colorScale.domain())
  .orient("bottom");
// Call the axis on the map
g.call(xAxis);

// Read the paths of every state and append it to the map/svg.
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
    .attr("fill", function(d) {
      if(states_data[d.properties.ST_ID])
        return colorScale(states_data[d.properties.ST_ID]);
      return "#999";
    })
    .attr("stroke-width", 0.6)
    .attr("stroke", "#333")
    .on("mouseover", tip.show)
    .on("mousout", tip.hide);

  svg.append("path")
    .datum(topojson.mesh(coords, subunits))
    .attr("d", path)
    .attr("fill", "none")
    .attr("class", "subunit-border");

});