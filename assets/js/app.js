// @TODO: YOUR CODE HERE!


var svgWidth = 960;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
console.log(height);

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(healthcareData) {
    console.log(healthcareData);
    var labels = [{
        x_label: "In Poverty %",
        y_label: "Lacks Healthcare(%)"
    },
    {
        x_label: "Age(Median)",
        y_label: "Smokes(%)"
    },
    {
        x_label: "Household Income(Median)",
        y_label: "Obese(%)"
    }]
    // Step 1: Parse Data/Cast as numbers
    // ==============================

    healthcareData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthcareData, d => d.poverty)-1, d3.max(healthcareData, d => d.poverty)])
      .range([0, width]);
    console.log(xLinearScale);
    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(healthcareData, d => d.healthcare)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var newGroup = chartGroup.append("g")
    var circlesGroup = newGroup.selectAll("circle")
    .data(healthcareData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("class", "stateCircle");

    newGroup.selectAll("text").data(healthcareData)
    .enter().append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("class","stateText")
    .html(function(d){
        return (`${d.abbr}`)
    });

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create  y axes labels
    // ==============================
    labels.forEach(function (data,index) {
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", (-20*index - 60))
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "aText")
      .attr("class", "inactive")
      .text(data.y_label);
    })
    // Create  x axes labels
    // ==============================
    labels.forEach(function (data,index) {
        chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${(height + margin.top + 25*(index+1))})`)
        .attr("class", "aText")      
        .attr("class", "inactive")
        .text(data.x_label)
      });
    
  }).catch(function(error) {
    console.log(error);
  });
