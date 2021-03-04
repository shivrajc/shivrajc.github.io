
  const width = 800;
  const height = 900;

  let svg = d3
    .select(".container")
    .append("svg")
    .attr("height", height)
    .attr("width", width);

let teams = Array.from(new Set(data.map((d) => d.team_name)));
let yCoords = teams.map((d, i) => 100 + i * 100);
let yScale = d3.scaleOrdinal().domain(teams).range(yCoords);

let xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => +d.cost_DOL_K)])
    // .domain(d3.extent(data.map((d) => +d.cost_DOL_K)))
    .range([50, width - 50]);

const xAxis = d3.axisTop(xScale)
    .tickSize(-height)
    .ticks(7)
    .tickSizeOuter(0);

svg
    .append("g")
      .classed("xAxis", true)
      .call(xAxis)
      .attr("transform", "translate(0," + 40 + ")");

// let xAxis = svg.append("g")
//     .attr("transform", `translate(0, ${40})`)
//     .attr("class", "x-axis");

// xAxis = d3.axisTop(xScale).tickSize(-(height));
    // xAxis.tickPadding(2);

svg.selectAll(".x-axis")
    .transition()
    .duration(500)
    .call(xAxis);    

let color = d3.scaleOrdinal().domain(teams).range(d3.schemePaired);

// let marketcapDomain = d3.extent(data.map((d) => d["Market Cap"]));
// marketcapDomain = marketcapDomain.map((d) => Math.sqrt(d));
const rScale = d3.scaleSqrt()
.domain([0, d3.max(data, d => d.cost_DOL_K)])
.range([0, 28]);
let size = d3.scaleLinear().domain(d3.extent(d => d.cost_DOL_K)).range([5, 30]);

svg
    .selectAll(".circ")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "circ")
    .attr("stroke", "black")
    .attr("fill", (d) => color(d.team_name))
    // .attr("r", (d) => rScale(d.cost_DOL_K))
    .attr("r", 5)
    .attr("cx", (d) => xScale(d.cost_DOL_K))
    .attr("cy", (d) => yScale(d.team_name))

let simulation = d3
    .forceSimulation(data)
    .force(
    "x",
    d3
        .forceX((d) => {
            return xScale(d.cost_DOL_K);
        // return xScale(d.team_name);
        })
        .strength(0.2)
    )
    .force(
    "y",
    d3
        .forceY(function (d) {
            return yScale(d.team_name);
        // return yScale(d.cost_DOL_K);
        })
        .strength(1)
    )
    .force(
    "collide",
    d3.forceCollide((d) => {
        return 6;
    })
    )
    .alphaDecay(0)
    .alpha(0.3)
    .on("tick", tick);

function tick() {
    d3.selectAll(".circ")
    .attr("cx", (d) => {
        return d.x;
    })
    .attr("cy", (d) => d.y);
}

let init_decay = setTimeout(function () {
    // console.log("start alpha decay");
    simulation.alphaDecay(0.1);
}, 3000);