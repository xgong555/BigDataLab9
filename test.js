var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 400 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var draw = function(mpg_min,mpg_max) {
  var x_var = document.getElementById("sel-x").value;
  var y_var = document.getElementById("sel-y").value; 
  var mpg_min = +$('#mpg-min').val();
  var mpg_max = +$('#mpg-max').val();

  // setup x 
  var xValue = function(d) { return d[x_var];},
      xScale = d3.scale.linear().range([0, width]), 
      xMap = function(d) { return xScale(xValue(d));}, 
      xAxis = d3.svg.axis().scale(xScale).orient("bottom");

  // setup y
  var yValue = function(d) { return d[y_var];}, 
      yScale = d3.scale.linear().range([height, 0]), 
      yMap = function(d) { return yScale(yValue(d));}, 
      yAxis = d3.svg.axis().scale(yScale).orient("left");

  // $(".plot").empty();
  var svg = d3.select("svg")  
      .attr("width", 400)
      .attr("height", 300)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // load data
    d3.csv("car.csv", function(error, data) {
      data.forEach(function(d) {
      d.mpg = +d.mpg;
      d.cylinders = +d.cylinders;
      d.displacement = +d.displacement;
      d.horsepower = +d.horsepower;
      d.weight = +d.weight;
      d.acceleration = +d.acceleration;
      d["model.year"] = +d["model.year"];
    });

    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([d3.min(data, xValue)-5, d3.max(data, xValue)+5]);
    yScale.domain([d3.min(data, yValue)-5, d3.max(data, yValue)+5]);

    // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text(x_var);

    // y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(y_var);

    // draw dots
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .filter(function(d) { return d.mpg < mpg_max && d.mpg > mpg_min})
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .on("mouseover", function(d) {
           $('#hovered').text(d.name)
        });
  });
};

function fresh(){
  jQuery("body").load(window.location.href);
}

function addListener(){
  $('#update').on('click', function(){
    window.location.reload();
    draw();
  });
};

$(document).ready(function() {
  draw();
  addListener();
});
