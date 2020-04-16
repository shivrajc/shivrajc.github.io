let width, height, strokeWidth;

window.screen.width > 600 ? width=945 : width=315;
window.screen.width > 600 ? height=190 : height=60;
window.screen.width > 600 ? strokeWidth=1 : strokeWidth=0.5;
           

const svg = d3.select(".hero")
                .append("svg")
                  .attr("width", width)
                  .attr("height", height);

const xScale = d3.scaleBand()
              .domain(d3.range(63))
              .range([0, width+7]);

const dataColored = data.filter(d => d.color === "Yes"); 

d3.select(".main-container")
    .classed("invisible", false)
    .classed("fade-in", true);

svg.selectAll(".squares")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "squares")
    .attr("fill", "white")
    .attr("stroke", "white")
    .attr("x", d => xScale(d.column)-4)                  
    .attr("y", d => (d.row * xScale.bandwidth())-3)
    .attr("width", xScale.bandwidth())                  
    .attr("height", xScale.bandwidth())
    .transition()
    .duration(1000)
    .attr("stroke", "rgb(221, 221, 221)")
    .attr("stroke-width", strokeWidth);

svg.selectAll(".square-colored")
    .data(dataColored)
    .enter()
    .append("rect")
    .attr("class", "square-colored")
    .attr("fill", "#708090")
    // .attr("x", d => xScale(d.column)-4)                  
    // .attr("y", d => ((d.row * xScale.bandwidth())-3)*-2)
    .attr("x", d => xScale(d.column)-4)                  
    .attr("y", d => (d.row * xScale.bandwidth())-3)
    .transition()
    .duration(1000)
    .delay(d => (d.row + d.column) * 20)
    .attr("x", d => xScale(d.column)-4)                  
    .attr("y", d => (d.row * xScale.bandwidth())-3)
    .attr("width", xScale.bandwidth())                  
    .attr("height", xScale.bandwidth());        


svg.selectAll(".squares")
    .on("mouseover", function() {
        d3.select(this)
        .attr("fill", "#c1c13f");
        // console.log(this);
    })
    .on("mouseout", function(d) {
        d3.select(this)
                .transition()
                .duration(300)
            .attr("fill", "white");
    });

svg.selectAll(".square-colored")
    .on("mouseover", function() {
        d3.select(this)
        .attr("fill", "#c1c13f");
        // console.log(this);
    })
    .on("mouseout", function(d) {
        d3.select(this)
                .transition()
                .duration(300)
            .attr("fill", "#708090");
    });    


// function showAbout() {
//     d3.select(".about")
//         .style("opacity", 1)
//         .style("left", "400px")
//         .style("top", "300px")
// }
    
// function hideAbout() {
//     d3.select(".about").style("opacity", 0);
// }    