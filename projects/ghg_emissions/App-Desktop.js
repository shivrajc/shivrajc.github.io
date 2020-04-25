
const tableData2 = d3.nest()
    .key(d => d.food)
    .rollup(d => +d[0].total.toFixed(1))
    .entries(tableData);

const table = d3.select(".table-container").append("table").append("tbody");

const tr = table.selectAll("tr.food")
    .data(tableData)
    .enter()
    .append("tr")
    .attr("class", "food")
    .attr("title", d => d.food);

const td = tr.selectAll("td")
    .data(d => d3.keys(tableData[0]).map(col => ({key: col, value: d[col]})))
    .enter()
    .append("td")
    .text(d => (d.key === "food" ? d.value : d3.format(".1f") (d.value)));


d3.selectAll("tr")
    .on("click", function() {
        d3.selectAll("tr").classed("selected", false);
        d3.select(this).classed("selected", true);
        UpdateChart(this.title);
    });

const dimensions = {
    width: document.querySelector(".chart-container").offsetWidth,
    height: (document.querySelector(".chart-container").offsetHeight)-100,
    margin: {
        top: 20,
        right: 20,
        bottom: 80,
        left: 20,
    },
}

dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

const wrapper = d3.select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

const bounds = wrapper.append("g")
    .attr("transform", `translate(${dimensions.margin.left},${dimensions.margin.top})`);

const filteredData = chartData.filter(d => d.food === "Beef (beef herd)");

const xScale = d3.scaleBand()
    .domain(filteredData.map(d => d.supplychain))
    .range([dimensions.margin.left, dimensions.boundedWidth-dimensions.margin.left]);

const yScale = d3.scaleLinear()
    .domain([0, d3.max(filteredData, d => d.value)])
    .range([dimensions.boundedHeight-dimensions.margin.top, dimensions.margin.bottom]);

let yAxis = bounds.append("g")
    .attr("transform", `translate(${dimensions.margin.left},0)`)
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale).tickSize(-(dimensions.boundedWidth-100)));

let xAxis = bounds.append("g")
    .attr("transform", `translate(0, ${dimensions.boundedHeight-10})`)
    .attr("class", "x-axis")
    .call(d3.axisBottom(xScale))
    // .call(d3.axisTop(xScale).ticks(5).tickSize(-(dimensions.boundedHeight-50)));

bounds.selectAll(".y-axis .tick text")
    .attr("dx", 20)
    .attr("dy", -5)

let rScale = d3.scaleLinear()
    .domain([0,d3.max(filteredData, d => d.value)])
    .range([2, 24]);

d3.select("tr").classed("selected", true);  
d3.select(".chart-title").html(`<span class="title-food">Beef (beef herd)</span>: Emissions across the suppy chain`);

const bars = bounds.selectAll(".circle-groups")
    .data(filteredData)
    .enter()
    .append("g")
    .attr("class", "circle-groups")
    .each(function() {
        // console.log(filteredData.indexOf(this.__data__));
        d3.select(this).selectAll("circle")
            .data(d3.range(1000))
            .enter()
            .append("circle")
            .attr("cx", xScale(this.__data__.supplychain)+ xScale.bandwidth()/2)
            .attr("cy", yScale(0))
            .attr("r", 2)
            .attr("opacity", 0.3)
            .transition()
            .delay((c,i) => i*100)
            .duration(4000)
            .attr("cx", xScale(this.__data__.supplychain)+ xScale.bandwidth()/2)
            .attr("cy", yScale(this.__data__.value))
            .attr("r", rScale( (this.__data__.value < 0 ? 0 : this.__data__.value)))
            .attr("opacity", 0.3)
            .on("end", d => d3.select(d).remove());
    });

const labels = bounds.selectAll(".labels")
    .data(filteredData)
    .enter()
    .append("text")
    .attr("class", "labels")
    .attr("x", d => xScale(d.supplychain)+ xScale.bandwidth()/2)
    .attr("y", dimensions.boundedHeight+50)
    .text(d => d.value);


function UpdateChart(food) {
    const data = chartData.filter(d => d.food === food);

    yScale.domain([0, d3.max(data, d => d.value)]);
    rScale.domain([0,d3.max(data, d => d.value)]);

    yAxis = d3.axisLeft(yScale).tickSize(-(dimensions.boundedWidth-100));

    bounds.selectAll(".y-axis")
        .transition()
        .duration(1000)
        .call(yAxis);

    bounds.selectAll(".y-axis .tick text")
        .attr("dx", 20)
        .attr("dy", -5);

    bounds
        .selectAll(".circle-groups")
        .remove();
    bounds.selectAll(".labels").remove();

    d3.select(".chart-title").html(`<span class="title-food">${food}</span>: Emissions across the suppy chain`);
    
    const bars = bounds.selectAll(".circle-groups")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "circle-groups")
        .each(function() {
            // console.log(filteredData.indexOf(this.__data__));
            d3.select(this).selectAll("circle")
                .data(d3.range(1000))
                .enter()
                .append("circle")
                .attr("cx", xScale(this.__data__.supplychain)+ xScale.bandwidth()/2)
                .attr("cy", yScale(0))
                .attr("r", 2)
                .attr("opacity", 0.3)
                .transition()
                .delay((c,i) => i*100)
                .duration(4000)
                .attr("cx", xScale(this.__data__.supplychain)+ xScale.bandwidth()/2)
                .attr("cy", yScale(this.__data__.value))
                .attr("r", rScale( (this.__data__.value < 0 ? 0 : this.__data__.value)))
                .attr("opacity", 0.3)
                .on("end", d => d3.select(d).remove());
        });
    
    const labels = bounds.selectAll(".labels")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "labels")
        .attr("x", d => xScale(d.supplychain)+ xScale.bandwidth()/2)
        .attr("y", dimensions.boundedHeight+50)
        .text(d => d.value);
}
