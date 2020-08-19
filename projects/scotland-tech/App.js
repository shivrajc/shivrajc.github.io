const width = 650,
    height = 600;

let currentShapes = dataset.map(d => d.bar_d);

dataset = dataset.sort((a, b) => a.companies-b.companies);

const svg = d3.select(".container")
    .append("svg")
    // .attr("viewBox", "40 250 400 350");
    .attr("width", width)
    .attr("height", height);

const radios = document.querySelectorAll("input[type=radio]");

const t = textures.lines()
    .lighter()
    .size(5)
    .strokeWidth(1.3)
    .shapeRendering("crispEdges");

const yScale = d3.scaleBand()
    .domain(dataset.map(d => d.region))
    .range([height-20, 20]);

const xScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, d => d.companies)])
    .range([0, width-20]);

let tooltip = d3.select(".container")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 1)
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    // .style("border-radius", "5px")
    .style("padding", "10px")

// const url = "topo_eer.json";

d3.json("topo_eer.json", function(error, world) {
    if (error) throw error;
    
    let geoData = topojson.feature(world, world.objects.eer).features;
    
    let projection = d3.geoMercator()
        .fitSize([width, height], {type:"FeatureCollection", features: geoData});

    let path = d3.geoPath().projection(projection);
    
    svg.selectAll("path.map")
        .data(geoData)
        .enter()
        .append("path")
        .classed("map", true)
        .attr("d", path)
        .attr("stroke", "RGBA(200, 200, 200, 0.8)")
        .attr("fill", "none")
        .style("opacity", 0);    

    svg.call(t);

    let marks = svg.selectAll("path.marks")
        .data(dataset);

    marks
        .enter()
        .append("path")
        .classed("marks", true)
        .attr("d", d => d.bar_d)
        .attr("fill", t.url())
        .attr("stroke", "#777")
        .on("mouseover",function(d,i){
            return tooltip.style("hidden", false).html(`<p>${d.region}</p> <p>${d.companies}</p>`);
        })
        .on("mousemove",function(d){
            tooltip.classed("hidden", false)
                   .style("top", (d3.event.pageY) + "px")
                   .style("left", (d3.event.pageX + 10) + "px")
                   .html(`<p>${d.region}</p> <p><strong>${d.companies}</strong></p>`);
        })
        .on("mouseout",function(d,i){
            tooltip.classed("hidden", true);
        });

    svg.selectAll("text.measure")
        .data(dataset) 
        .enter()
        .append("text")
        .classed("measure", true)
        .text(d => `${d.companies}`)
        .attr("x", 20)
        .attr("y", d => yScale(d.region)+26)

    svg.selectAll("text.label")
        .data(dataset) 
        .enter()
        .append("text")
        .classed("label", true)
        .text(d => d.region)
        .attr("x", d => d.companies<100 ? 50 : 60)
        .attr("y", d => yScale(d.region)+26)

    svg.selectAll("text.dot-label")
        .data(dataset)
        .enter()
        .append("text")
        .classed("dot-label", true)
        .text(d => d.region_code)
        .attr("x", d => d.circle_x)
        .attr("y", d => d.circle_y)
        .attr("transform", d =>{
            switch(d.region) {
                case "Highlands & Islands":
                    return `translate(0, -10)`;
                case "Glasgow":
                    return `translate(-43, 15)`;
                case "Midlothian":
                    return `translate(53, 5)`;
                case "Aberdeenshire":
                    return `translate(0, -15)`;
                case "Lanarkshire":
                    return `translate(0, 15)`;
                case "Borders":
                    return `translate(5, 12)`;                                                                 
                case "Ayrshire":
                    return `translate(-5, 12)`;
                default:
                    return `translate(0, -10)`;
              }
            
        })
        .style("opacity", 0);
    
    radios.forEach(radio => {
        radio.addEventListener("change", () => {
            toggle = document.querySelectorAll("input[name=radioToggle]:checked")[0].value;

            d3.selectAll(".marks")
                .on("mouseover", null)
                .on("mousemove", null)
                .on("mouseout", null);

            animate(toggle);
           

        })
    })
    
    
});


function animate(toggle) {
    let nextShapes = toggle === "Bar Chart" ? dataset.map(d => d.bar_d) : dataset.map(d => d.circle_d),
        interpolators = flubber.interpolateAll(currentShapes, nextShapes, { match: true });

    if (toggle === "Bar Chart") {
        d3.selectAll("path.map, .dot-label")
            .transition()
            .duration(500)
            .style("opacity", 0);

        d3.selectAll(".measure, .label")
            .transition()
            .duration(2000)
            .style("opacity", 1)  
    } else {
        d3.selectAll("path.map, .dot-label")
            .transition()
            .duration(500)
            .style("opacity", 1);

        d3.selectAll(".measure, .label")
            .transition()
            .duration(500)
            .style("opacity", 0)        
    }

    currentShapes = nextShapes;

    d3.selectAll("path.marks")
        .data(interpolators)
        .transition()
        .duration(2000)
        .attrTween("d", function(d) {
            return d;
        })
        .filter(function(d, i) {
            return !i;
        })
    
}