const margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 560
}

const data2 =[];

const width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

const format = d3.format(".1f");

let data = [{"Batsman":"Virat Kohli","Average":100,"Dismissals":5},{"Batsman":"Kedar Jadhav","Average":62,"Dismissals":1},{"Batsman":"Rohit Sharma","Average":51.9,"Dismissals":10},{"Batsman":"Shikhar Dhawan","Average":34.4,"Dismissals":12},{"Batsman":"MS Dhoni","Average":24.77,"Dismissals":9}];

data.forEach(d => {
    d3.range(d.Dismissals).map((el, i) => {
        data2.push({    
            Batsman: d.Batsman,
            Dismissals: d.Dismissals,
            index: i
        })        
    })
});

const svg = d3.select(".container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    
const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Average)])
    .range([0, width]);

const yScale = d3.scaleBand()
    .domain(data.map(d => d.Batsman))
    .range([margin.bottom, height-margin.top]);

const barTexture = textures.lines()
    .orientation("3/8", "7/8")
    .strokeWidth(1.2)
    .stroke("#038DCC");
    // .background("#DAEAF1");

const circleTexture =   textures.lines()
    .orientation("vertical", "horizontal")
    .size(4)
    .strokeWidth(1)
    .shapeRendering("crispEdges")
    .stroke("#cf474a");

svg.call(barTexture);
svg.call(circleTexture);

// const yAxis = bounds.append("g")
//     .attr("transform", `translate(${dimensions.margin.left-10}, ${-(dimensions.margin.top+4)})`)
//     .attr("class", "y-axis")
//     .call(d3.axisLeft(yScale));

// const xAxis = bounds.append("g")
//     .attr("transform", `translate(0, ${dimensions.margin.top})`)
//     .attr("class", "x-axis");

svg.selectAll(".bars")
    .data(data, d => d.Batsman)
    .join("rect")
    .classed("bars", true)
    .attr("x", 0)
    .attr("y", d => yScale(d.Batsman)+20)
    .attr("width", d => xScale(d.Average))
    .attr("height", yScale.bandwidth()-56)
    .attr("fill", barTexture.url());

svg.selectAll(".label-batsman")
    .data(data, d => d.Batsman)
    .join("text")
    .classed("label-batsman", true)
    .attr("x", -160)
    .attr("y", d => yScale(d.Batsman) + (yScale.bandwidth()/2))
    .text(d => d.Batsman);

svg.selectAll(".label-average")
    .data(data, d => d.Batsman)
    .join("text")
    .classed("label-average", true)
    .attr("x", -60)
    .attr("y", d => yScale(d.Batsman) + (yScale.bandwidth()/2))
    .text(d => format(d.Average));

svg.selectAll(".label-dismissals")
    .data(data, d => d.Batsman)
    .join("text")
    .classed("label-dismissals", true)
    .attr("x", -264)
    .attr("y", d => yScale(d.Batsman) + (yScale.bandwidth()/2))
    .text(d => d.Dismissals);

svg.selectAll(".circles")
    .data(data2, d => d.Batsman)
    .join("circle")
    .classed("circles", true)
    .attr("cx", d => -304 - (d.index*20))
    .attr("cy", d => yScale(d.Batsman) + (yScale.bandwidth()/2)-7)
    .attr("r", 8)
    .attr("fill", circleTexture.url())
    .attr("stroke", "#cf474a");

svg.append("text")
    .text("DISMISSALS")
    .classed("header-d", true)
    .attr("x", -264);

svg.append("text")
    .text("BATTING AVERAGE")
    .classed("header-a", true)
    .attr("x", -60);

svg.append("text")
    .text("BATSMAN")
    .classed("header-batsman", true)
    .attr("x", -160);

svg.append("rect")
    .attr("x", -60)
    .attr("y", 20)
    .attr("width", 450)
    .attr("height", 1)
    .attr("fill", "#038DCC");

svg.append("rect")
    .attr("x", -264-300)
    .attr("y", 20)
    .attr("width", 300)
    .attr("height", 1)
    .attr("fill", "#cf474a");

svg.append("rect")
    .attr("x", -60)
    .attr("y", height-36)
    .attr("width", 450)
    .attr("height", 1)
    .attr("fill", "#038DCC");

svg.append("rect")
    .attr("x", -264-300)
    .attr("y", height-36)
    .attr("width", 300)
    .attr("height", 1)
    .attr("fill", "#cf474a");

svg.select(".header-d")
    .on("click", () => {
        order(data.sort((a, b) => b.Dismissals-a.Dismissals), data2.sort((a, b) => b.Dismissals-a.Dismissals))
    })


function order(dataset, dataset2) {
    yScale.domain(dataset.map(d => d.Batsman));

    d3.selectAll(".bars")
        .data(dataset, d => d.Batsman)
        .transition()
        .duration(1000)
        .attr("y", d => yScale(d.Batsman)+20)

    svg.selectAll(".label-batsman")
        .data(dataset, d => d.Batsman)
        .attr("y", d => yScale(d.Batsman) + (yScale.bandwidth()/2)); 

    svg.selectAll(".label-average")
        .data(dataset, d => d.Batsman)
        .attr("y", d => yScale(d.Batsman) + (yScale.bandwidth()/2));

    svg.selectAll(".label-dismissals")
        .data(dataset, d => d.Batsman)
        .attr("y", d => yScale(d.Batsman) + (yScale.bandwidth()/2));
    
    svg.selectAll(".circles")
        .data(dataset2, d => d.Batsman)
        .attr("cy", d => yScale(d.Batsman) + (yScale.bandwidth()/2)-7);
}