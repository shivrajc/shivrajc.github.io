
const data2 = [{"country":"United Kingdom","index":72, "rank": 1},{"country":"France","index":71, "rank": 2},{"country":"Canada","index":71, "rank": 3},{"country":"United States","index":70, "rank": 4},{"country":"Japan","index":61, "rank": 6},{"country":"Germany","index":59, "rank": 7},{"country":"Italy","index":57, "rank": 8},{"country":"G7 Average","index":66, "rank": 5}];

let screenWidth;

window.screen.width < 600 ? 
  screenWidth=window.screen.width :
  screenWidth=800;

window.screen.width < 600 ? 
  document.querySelector(".header").classList.add("header-mobile") :
  document.querySelector(".header").classList.add("header-desktop");

const margin = {top: 10, right: 20, bottom: 0, left:0};
const width = screenWidth - 30 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const svg = d3.select(".chart-area")
                .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                  
data2.sort((a, b) => b.index-a.index);
data.sort((a, b) => b.rank-a.rank);

data2.forEach(country => {
  const tempData1 = data.filter(d => d.country == country.country);
  const tempData2 = data2.filter(d => d.country == country.country);
    
    svg.selectAll(".country-label")
    .data(tempData2, d => d.country)
    .enter()
    .append("text")
    .classed("country-label", true)
    .attr("x", 0)
    .attr("y", d => (d.rank-1) * (height/8) + 10)
    .transition()
    .duration(500)
    .delay(d => d.rank*1000)
    .attr("x", 0)
    .attr("y", d => (d.rank-1) * (height/8) + 15)
    .text(d => d.country)
    .on("end", () => {

      const squares = svg.selectAll(".square")
                        .data(tempData1, d => (d.country));
      
      squares
        .enter()
        .append("rect")
        .classed("square", true)
        .attr("x", 0)
        .attr("y", d => (d.rank-1) * (height/8) + 20)
        .attr("width", width/100-1)                  
        .attr("height", 10)
        .classed("square-index", d => d.index)
        .classed("square-index-g7", d =>  d.index && d.country === "G7 Average")
        .transition()
        // .duration(500)
        // .delay(d => d.id)
        .attr("x", d => (d.id-1) *  width/100)
        .attr("y", d => (d.rank-1) * (height/8) + 20)
        .attr("width", width/100-1)                  
        .attr("height", 10)
        .on("end", () => {
          
        });

        svg.selectAll(".country-index")
          .data(tempData2, d => d.country)
          .enter()
          .append("text")
          .classed("country-index", true)
          .classed("country-index-g7", d => d.country === "G7 Average")
          .attr("x", width-40)
          .attr("y", d => (d.rank-1) * (height/8) + 50)
          .style("opacity", 0)
          .transition()
          .duration(500)
          .delay(d => d.rank)
          .attr("x", width-40)
          .attr("y", d => (d.rank-1) * (height/8) + 15)
          .text(d => d.index)
          .style("opacity", 1);
        
                          
    });

})





