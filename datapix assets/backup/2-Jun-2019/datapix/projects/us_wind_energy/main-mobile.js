
const margin = {top: 20, right: 30, bottom: 60, left:30};
const width = 400 - margin.left - margin.right;
const height = 420 - margin.top - margin.bottom;

const formatComma = d3.format(",");

const data2 = data.filter(state => state.wind_turbines !== "");

// let cellSize = calcCellSize(width, height, 11, 8); 
let colWidth = width / 11;
let rowHeight = height / 8;

const legendWidth = ((width-20)/6);


tooltip = d3.select("body")
			.append("div")
				.classed("tooltip", true);

for(let i=1; i<=8; i++) {
  for(let j=1; j<=11; j++) {
    data.forEach(function(item, index) {
      if(item.row === i && item.col === j) {
        item.x = (colWidth * j) - (colWidth / 2);
        item.y = (rowHeight * i) - (rowHeight / 2);
      }
    })
  }
}

let symbolGenerator = d3.symbol().size(400);

const xScale = d3.scaleLinear()
                  .domain(d3.extent(data, d => d.equivalent_homes_powered))
                  .range([0, width]);

const yScale = d3.scaleLinear()
                  .domain(d3.extent(data, d => d.installed_capacity_mw))
                  .range([height, 0]);

const xAxis = d3.axisBottom(xScale)
                  .tickSize(-height)
                  .tickFormat(d3.format(".2s"))
                  .tickSizeOuter(0);

const yAxis = d3.axisLeft(yScale)
                  .tickSize(-width)
                  .tickFormat(d3.format(".1s"))
                  .tickSizeOuter(0);


// const colorScale = d3.scaleSequential(d3.interpolateBlues)
//                     .domain([1,d3.max(data, d => d.installed_capacity_mw)]);
//                     // .range([4, 50]);

const colorDomain = [0, 100, 1000, 5000, 10000, 15000];
const colorLegend = ["<100 mw", "100-1K mw", "1K-5K mw", "5K-7K mw", "7K-10K mw", "10K+ mw"];
const colorRange = ['#f0f9e8','#ccebc5','#a8ddb5','#7bccc4','#43a2ca','#0868ac'];

const colorScale = d3.scaleQuantile()
                        .domain(colorDomain)
                        .range(colorRange);

const textColorScale = d3.scaleLinear(d3.interpolateBlues)
                    .domain([ 1,
                              d3.max(data, d => d.installed_capacity_mw)])
                    .range(["black", "white"]);

const svg = d3.select(".container")
                .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let symbols = svg.selectAll(".symbol")
                  .data(data2, d => d.state);

symbols
  .enter()
    .append("g")
      .attr("transform",  d => {
        return "translate(" + d.x + "," +  d.y + ")";
      })
    .append("path")
    .classed("symbol", true)
    .attr("d", symbolGenerator.type(d3["symbolWye"]))
    .attr("fill", d => colorScale(d.installed_capacity_mw))  
    .on("mousemove", showToolTip)
    .on("mouseout", hideTooltip);

let circles = svg.selectAll("circle")
                    .data(data, d => d.state);

circles
  .enter()
  .append("circle")
  .classed("circle", true)
  .attr("cx", d => d.x)
  .attr("cy", d => d.y)
  .attr("r",7)
  .attr("fill", d => colorScale(d.installed_capacity_mw))
  .on("mousemove", showToolTip)
	.on("mouseout", hideTooltip);
  // .attr("fill", d => colorScale(d.installed_capacity_mw));

let stateLabels = svg.selectAll(".state-label")
                  .data(data, d => d.state);

stateLabels
  .enter()
    .append("text")
    .classed("state-label", true)
    .attr("x", d => d.x)
    .attr("y", d => d.y + 2)
    .text(d => d.code)
    .attr("fill", d => textColorScale(d.installed_capacity_mw))
    .on("mousemove", showToolTip)
    .on("mouseout", hideTooltip);

let legendBars = svg.selectAll(".legend-bars")
                  .data(colorLegend);

legendBars
  .enter()
  .append("rect")
  .classed("legend-bars", true)
  .attr("x", (d, i) => legendWidth * i)
  .attr("y", height + 35)
  .attr("width", legendWidth)
  .attr("height", 7)
  .attr("fill", (d, i) => colorRange[i]);

let legendText = svg.selectAll(".legend-text")
  .data(colorLegend);

legendText
  .enter()
  .append("text")
  .classed("legend-text", true)
  .attr("x", (d, i) => (legendWidth * i) + (legendWidth/2))
  .attr("y", height + 60)
  .text(d => d);

function showToolTip(d) {
  tooltip
    .style("opacity", 1)
    .style("left", d3.event.x - (tooltip.node().offsetWidth/2) + "px")
    .style("top", (d3.event.y + 25) + "px")
    .html(`
      <p class="state-name">${d.state} (${d.code})</p>
      <p>Rank: <span class="tooltip-value">${d.rank}</span></p>
      <p>Installed Capacity (mw):	<span class="tooltip-value">${formatComma(d.installed_capacity_mw)}</span></p>
      <p>Equivalent Homes Powered:	<span class="tooltip-value">${formatComma(d.equivalent_homes_powered)}</span></p>
      <p>Total Investment:	<span class="tooltip-value">${formatComma(d.total_investment_mn)} mn</span></p>
      <p># of Wind Turbines:	<span class="tooltip-value">${formatComma(d.wind_turbines)}</span></p>
    `);

  d3.select(this)
    .classed("hovered", true);
}

function hideTooltip(d) {
  tooltip
    .style("opacity", 0);

  d3.select(this)
    .classed("hovered", false);
}

d3.timer(function(elapsed) {
  d3.selectAll(".symbol")
      .attr("transform", "rotate(" + elapsed / 20 + ")");
});

// t._call();

d3.select(".btnScatterPlot")
    .on("click", function() {

      d3.select(".btnMap").classed("selected", false);
      d3.select(".btnScatterPlot").classed("selected", true);
      // t.pause();

      d3.selectAll("path")
          // .transition()
          .remove();

      d3.selectAll(".legend-bars").remove();
      d3.selectAll(".legend-text").remove();
      d3.selectAll(".legend-header").remove();

      svg
        .append("g")
          .classed("xAxis", true)
          // .transition(500)
          .call(xAxis)
          .attr("transform", "translate(0," + height + ")");
          
      svg
        .append("g")
        .classed("yAxis", true)
          .call(yAxis);
          // .transition(500);

      
      d3.selectAll(".state-label").remove();

      d3.selectAll(".circle")
        .transition()
        .duration(750)
        .on("end", () => {
          
          
          const scatterLabels = svg.selectAll(".scatter-labels")
                                  .data(data.filter(d => d.installed_capacity_mw > 2500), d => d.state);
    
          scatterLabels
            .enter()
            .append("text")
            .classed("scatter-labels", true)
            .text(d => d.code)                              
            .attr("x", d => xScale(d.equivalent_homes_powered))
            .attr("y", d => yScale(d.installed_capacity_mw)+2)
            .attr("fill", d => textColorScale(d.installed_capacity_mw))
            .on("mousemove", showToolTip)
            .on("mouseout", hideTooltip);          
        })
        .attr("cx", d => xScale(d.equivalent_homes_powered))
        .attr("cy", d => yScale(d.installed_capacity_mw));

      d3.select(".yAxis .tick").remove();

      svg.append("text")
        .text("Equivalent Homes Powered")
        .classed("x-axis-label", true)
        .attr("x", 0)
        .attr("y", height + (margin.bottom-35));
  
      svg.append("text")
          .text("Installed Capacity (mw)")
          .classed("y-axis-label", true)
          .attr("x", -height)
          .attr("y", -(margin.left-10))
          .attr("transform", "rotate(-90)");        
    }) 

    d3.select(".btnMap")
        .on("click", function(){
          d3.select(".btnMap").classed("selected", true);
          d3.select(".btnScatterPlot").classed("selected", false);

          d3.selectAll(".yAxis").remove();
          d3.selectAll(".xAxis").remove();
          d3.selectAll(".x-axis-label").remove();
          d3.selectAll(".y-axis-label").remove();          
          d3.selectAll(".scatter-labels").remove();

          d3.selectAll(".circle")
          .transition()
          .duration(750)
          .on("end", () => {          

            symbols = svg.selectAll(".symbol")
              .data(data2, d => d.state);

            symbols
              .enter()
              .append("g")
              .attr("transform",  d => {
              return "translate(" + d.x + "," +  d.y + ")";
              })
              .append("path")
              .classed("symbol", true)
              // .transition(750)
              .attr("d", symbolGenerator.type(d3["symbolWye"]))
              .attr("fill", d => colorScale(d.installed_capacity_mw))  
              .on("mousemove", showToolTip)
              .on("mouseout", hideTooltip);
            
              
              d3.selectAll(".circle").remove();
              
              circles = svg.selectAll("circle")
                              .data(data, d => d.state);
              
              circles
                .enter()
                .append("circle")
                .classed("circle", true)
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .attr("r",7)
                .attr("fill", d => colorScale(d.installed_capacity_mw))
                .on("mousemove", showToolTip)
                .on("mouseout", hideTooltip);
              
              d3.selectAll(".state-label").remove();  

              stateLabels = svg.selectAll(".state-label")
                                .data(data, d => d.state);
  
              stateLabels
                .enter()
                .append("text")
                .classed("state-label", true)
                .attr("x", d => d.x)
                .attr("y", d => d.y + 2)
                .text(d => d.code)
                .attr("fill", d => textColorScale(d.installed_capacity_mw))
                .on("mousemove", showToolTip)
                .on("mouseout", hideTooltip);

            })
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
            
          legendBars = svg.selectAll(".legend-bars")
                            .data(colorLegend);

          legendBars
            .enter()
            .append("rect")
            .classed("legend-bars", true)
            .attr("x", (d, i) => legendWidth * i)
            .attr("y", height + 35)
            .attr("width", legendWidth)
            .attr("height", 7)
            .attr("fill", (d, i) => colorRange[i]);

          legendText = svg.selectAll(".legend-text")
                            .data(colorLegend);

          legendText
            .enter()
            .append("text")
            .classed("legend-text", true)
            .attr("x", (d, i) => (legendWidth * i) + (legendWidth/2))
            .attr("y", height + 60)
            .text(d => d);
      });
 