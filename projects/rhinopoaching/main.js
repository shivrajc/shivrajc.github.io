
const data2 = [{"year":"2006","rhinos_poached":36},{"year":"2007","rhinos_poached":13},{"year":"2008","rhinos_poached":83},{"year":"2009","rhinos_poached":122},{"year":"2010","rhinos_poached":333},{"year":"2011","rhinos_poached":448},{"year":"2012","rhinos_poached":668},{"year":"2013","rhinos_poached":1004},{"year":"2014","rhinos_poached":1215},{"year":"2015","rhinos_poached":1175},{"year":"2016","rhinos_poached":1054}];

const margin = {top: 10, right: 20, bottom: 40, left:20};
const width = 850 - 30 - margin.left - margin.right;
const height = 650 - margin.top - margin.bottom;
let index = 0;

let xScale = d3.scaleBand()
                .domain(data2.map(function(d) { return d.year; }))
                .range([margin.left, width]);

let yScale = d3.scaleLinear()
                  .domain([d3.max(data2, d => d.rhinos_poached), 0])
                  .range([100, height-20]);

const svg = d3.select(".chart-area")
                .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const circles = svg.selectAll(".circle")
                  .data(data, d => d.id);
                  
circles 
  .enter()
  .append("circle")
  .attr("class", "circle")
  .attr("r", 4)
  .attr("cx", d => d.x+40)
  .attr("cy", -50)
  .transition()
  // .ease(d3.easeExp)
  .duration(2000)
  // .delay(d => Number(d.id.toString().substring(0,3)))
  .delay(d => d.id)
  .attr("cx", d => d.x+40)
  .attr("cy", d => d.y+180)
  .on("end", () => {
    index++;

    if (index === 6151) {
      svg.append("text")
        .text("6151")
        .attr("x", 50)
        .attr("y", 20)
        .style("opacity", 0)
        .attr("class", "total-ban")
        .transition()
        .duration(500)
        .style("opacity", 1);

      svg.append("text")
        .text("Rhinos have been poached in South Africa from 2006-2016")
        .attr("x", width/2+50)
        .attr("y", 20)
        .style("opacity", 0)
        .attr("class", "total-text")
        .transition()
        .duration(500)
        .style("opacity", 1);

      d3.select("button")
        .style("top", "170px")
        .style("left", document.documentElement.clientWidth/2-(document.querySelector("button").clientWidth/2) + "px")
        .transition()
        .delay(500)
        .style("opacity", 1)
        .style("top", "170px")
        .style("left", document.documentElement.clientWidth/2-(document.querySelector("button").clientWidth/2) + "px");

      d3.select("button")      
        .on("click", function () {
          d3.select("button").style("display", "none");
          createBarChart();
        })
    } 
  });

function createBarChart() {
  let bars = svg.selectAll(".bars")
                    .data(data2, d => d.year);
  index = 0;

  bars
    .enter()
    .append("rect")
    .attr("class", "bars")
    .attr("x", d => xScale(d.year))
    .attr("width", xScale.bandwidth()-2)
    .attr("y", height-20)
    .attr("height", 0)
    .transition()
    .duration(2000)
    .delay((d,i) => (i+1)*400)
    .attr("height", d => (height-20) - yScale(d.rhinos_poached))
    .attr("y", d => yScale(d.rhinos_poached))
    .on("end", () => {
      index++;

      if (index === data2.length) {
        d3.selectAll(".circle").remove();
        bars
        .enter()
        .append("text")
        .attr("class", "chart-label")
        .text(d => d.rhinos_poached)
        .attr("y", d => yScale(d.rhinos_poached)-10)
        .attr("x", (d, i) => xScale(d.year) + xScale.bandwidth()/2);
        
        svg.append("text")
          .text("Data Source: Department of Environmental Affairs  |  Image: Noun Project & spotify.github.io/coordinator   |   Design: @shivrajc")
          .attr("class", "credits")
          .attr("x", margin.left)
          .attr("y", height+margin.bottom-10);

      }

    });


  bars
    .enter()
    .append("text")
    .attr("class", "x-axis-label")
    .text(d => d.year)
    .attr("y", height)
    .attr("x", (d, i) => xScale(d.year) + xScale.bandwidth()/2);

  svg.selectAll(".circle")
      .data(data, d => d.id)
      .transition()
      .duration(2000)
      .delay(d => d.id-(d.id/6))
      .attr("cx", (d, i) => xScale(d.year) + xScale.bandwidth()/2)
      .attr("cy", height-30)
      .attr("r", 0);

}