// @TODO: YOUR CODE HERE!

function init(x_data,y_data) {
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


    // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
    var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

    var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Import Data
    d3.csv("assets/data/data.csv").then(function(healthcareData) {

        // Step 1: Parse Data/Cast as numbers
        // ==============================

        healthcareData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;

        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;});
        
        // Step 2: Create scale functions
        // ==============================
       function xScale (healthcareData,x_data) {
        var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthcareData,d => d[x_data])-1, d3.max(healthcareData,d => d[x_data])])
        .range([0, width]);
        return xLinearScale;
       };

       function yScale(healthcareData, y_data) {
        var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthcareData, d => d[y_data])])
        .range([height, 0]);
        return yLinearScale;
       }


        // Step 3: Create axis functions
        // ==============================
       function updateXAxis (updateXscale, xAxis) {
        var bottomAxis = d3.axisBottom(xLinearScale);
        xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

        return xAxis;
       }

       function updateYAxis (updateYScale, yAxis) {
        var leftAxis = d3.axisLeft(yLinearScale);

        yAxis.transition()
        .duration(1000)
        .call(leftAxis);

        return yAxis;
       }


        // Step 4: update circles on the chart
        // ==============================
        function updateXCircles (circlesGroup, updateXscale, x_data) {
            circlesGroup.transition()
            .duration (1000)
            .attr("cx", d => updateXscale(d[x_data]));
            return circlesGroup;
        }
        function updateYCircles (circlesGroup, updateYscale, y_data) {
            circlesGroup.transition()
            .duration (1000)
            .attr("cy", d => updateYscale(d[y_data]));
            return circlesGroup;
        }
        // Step 5: update Labels
        // ==============================
        function updateXLabels (dataLabels, updateXscale, x_data) {
            dataLabels.transition ()
            .duration(1000)
            .attr("x", d=> updateXscale(d[x_data]));
            return dataLabels;
        }
        function updateYLabels (dataLabels, updateYscale, y_data) {
            dataLabels.transition ()
            .duration(1000)
            .attr("y", d=> updateYscale(d[y_data]));
            return dataLabels;
        }
        // Step 5: update Tooltip
        // ==============================
        function updateTooltip(x_data, circlesGroup, y_data) {
            var x_label;
            console.log(x_data);
            console.log(y_data);
            if (x_data === "poverty") {
                x_label = "In Poverty %";
            } else if (x_data === "age") {
                x_label = "Age (Median)"
            } else { x_data = "income"
                x_label = "House Income (Median)";
            }
        
            var y_label;
        
            if (y_data === "obesity") {
                y_label = "Obese (%)";
            } else if (y_data === "smokes") {
                y_label = "Smokes (%)"
            } else { y_data = "healthcare"
                y_label = "Lacks Healthcare (%)";
            }
            var toolTip = d3.tip()
                .attr("class", "d3-tip")
                .offset([80, -60])
                .html(function(d) {
                    return (`${d.state}<br>${x_label} ${d[x_data]}<br>${y_label} ${d[y_data]}`);
                });
        
        
            circlesGroup.call(toolTip);
        
            circlesGroup.on("mouseover", function(data) {
                    toolTip.show(data);
                })
                // onmouseout event
                .on("mouseout", function(data, index) {
                    toolTip.hide(data);
                });
        
            return circlesGroup;
        }
        // PLOT INITIAL DATA===============
        //================================
        // Step 1: Create Axes
        var xLinearScale = xScale(healthcareData,x_data);
        var yLinearScale = yScale(healthcareData,y_data);
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0,${height})`)
        .call(bottomAxis);

        var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);
        

        // Step 2: Create Circles
        // ==============================
         var circlesGroup = chartGroup.selectAll("circle")
        .data(healthcareData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[x_data]))
        .attr("cy", d => yLinearScale(d[y_data]))
        .attr("r", "15")
        .attr("class", "stateCircle");

        var circleLabels = chartGroup.selectAll(null).data(healthcareData).enter().append("text");
        circleLabels.attr("x", d=> xLinearScale(d[x_data]))
        .attr("y", d => yLinearScale(d[y_data]))
        .attr("class","stateText")
        .html(function(d){
            return (`${d.abbr}`)});

        // Step 3: Create x-axis labels group
        //===========================
        var xlabelGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
        // create individual labels
        var povertyLabel = xlabelGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("active", true)
        .text("In Poverty (%)");

        var ageLabel = xlabelGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (Median)");

         var incomeLabel = xlabelGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Household Income (Median)");

        // Create y-axis labels group
        //===========================
        var ylabelGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)")
        // create invidual labels
        var healthcareLabel = ylabelGroup.append("text")
        .attr("x", 0 - height / 2)
        .attr("y", 0 - margin.left + 60)
        .attr("value", "healthcare")
        .classed("active", true)
        .text("Lacks Healthcare (%)");

        var obesityLabel = ylabelGroup.append("text")
        .attr("x", 0 - height / 2)
        .attr("y", 0 - margin.left + 20)
        .attr("value", "obesity")
        .classed("inactive", true)
        .text("Obese (%)");

        var smokesLabel = ylabelGroup.append("text")
        .attr("x", 0 - height / 2)
        .attr("y", 0 - margin.left + 40)
        .attr("value", "smokes")
        .classed("inactive", true)
        .text("Smokes (%)");

        // Step 4: Update tool tip
        // ==============================
         updateTooltip(x_data, circlesGroup, y_data);

        // Step 5: Create event listeners to change and transition data
        // ==============================
        
        xlabelGroup.selectAll("text").on("click", function() {
            var x_value = d3.select(this).attr("value");
            if (x_value !== x_data) {

                x_data = x_value;

                xLinearScale = xScale(healthcareData, x_data);

                xAxis = updateXAxis(xLinearScale, xAxis);

                circlesGroup = updateXCircles(circlesGroup, xLinearScale, x_data);

                updateTooltip(x_data, circlesGroup, y_data);

                circleLabels = updateXLabels(circleLabels, xLinearScale, x_data);

                if (x_data === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else if (x_data === "age") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        })
        ylabelGroup.selectAll("text").on("click", function() {
            var y_value = d3.select(this).attr("value");
            if (y_value !== y_data) {

                y_data = y_value;

                yLinearScale = yScale(healthcareData, y_data);

                yAxis = updateYAxis(yLinearScale, yAxis);

                circlesGroup = updateYCircles(circlesGroup, yLinearScale, y_data);

                updateTooltip(x_data, circlesGroup, y_data)

                circleLabels = updateYLabels(circleLabels, yLinearScale, y_data);

                if (y_data === "obesity") {
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else if (y_data === "smokes") {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        })
        
        
    })

    };
    init("poverty","healthcare");

