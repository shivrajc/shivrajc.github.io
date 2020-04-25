let league = "Champions League";
let metric = "Goals";

const radios = document.querySelectorAll("input[type=radio]");

const dimensions = {
    width: window.innerWidth * 0.6,
    height: 550,
    margin: {
        top: 20,
        right: 10,
        bottom: 40,
        left: 60,
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

const xScale = d3.scaleLinear()
    .range([dimensions.margin.left, dimensions.boundedWidth-dimensions.margin.left]);

const yScale = d3.scaleBand()
    .domain(dataset.map(d => d.Season))
    .range([dimensions.margin.bottom, dimensions.boundedHeight-dimensions.margin.top]);

let yAxis = bounds.append("g")
    .attr("transform", `translate(${dimensions.margin.left-10}, ${-(dimensions.margin.top+4)})`)
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale));



let xAxis = bounds.append("g")
    .attr("transform", `translate(0, ${dimensions.margin.top})`)
    .attr("class", "x-axis");
    // .call(d3.axisTop(xScale).ticks(5).tickSize(-(dimensions.boundedHeight-50)));

bounds.selectAll(".x-axis .tick text")
    .attr("dy", -5)

radios.forEach(radio => {
    radio.addEventListener("change", () => {
        league = document.querySelectorAll("input[name=radioLeague]:checked")[0].value;
        metric = document.querySelectorAll("input[name=radioStats]:checked")[0].value;
        CreateChart(league, metric);
    })
})


function CreateChart(league, metric) {
    const data = dataset.filter(d => d.League === league && d.Metric === metric)
    
    const playerValues = [...data.map(d => d.Messi), ...data.map(d => d.Ronaldo)];

    xScale.domain([0, d3.max(playerValues)]);
    
    data.forEach(element => {
        element.min = d3.min([element.Messi, element.Ronaldo]);
        element.max = d3.max([element.Messi, element.Ronaldo]);
        element.delta = element.max - element.min;
    });
    
    xAxis = d3.axisTop(xScale).tickSize(-(dimensions.boundedHeight-50));
    xAxis.tickPadding(2);

    bounds.selectAll(".x-axis")
        .transition()
        .duration(500)
        .call(xAxis);

    bounds.selectAll(".x-axis .tick text")
        .attr("dy", -5);

    const bars = bounds
        .selectAll("rect")
        .data(data)
    
    bars.enter()
        .append("rect")
    .merge(bars)
        .attr("class", "none")
        .attr("class", d => (d.Messi > d.Ronaldo ? "band-m-lead" : "band-r-lead"))
        .transition()
        .duration(500)
        .attr("x", d => xScale(d.min))
        .attr("y", d => yScale(d.Season)-10)
        .attr("width", d => xScale(d.max)-xScale(d.min))
        // .attr("width", 40)
        .attr("height", 20)
        .attr("rx", 2)
        .attr("ry", 2);
        
    const mDots = bounds
        .selectAll(".m-dots")
        .data(data);
        
    mDots.enter()
        .append("circle")
        .attr("class", "m-dots")
    .merge(mDots)
        .transition()
        .duration(500)
        .attr("cx", d => xScale(d.Messi))
        .attr("cy", d => yScale(d.Season))
        .attr("r", 10);
        
        const rDots = bounds
        .selectAll(".r-dots")
        .data(data);
        
        
    rDots.enter()
        .append("circle")
        .attr("class", "r-dots")
    .merge(rDots)
        .transition()
        .duration(500)
        .attr("cx", d => xScale(d.Ronaldo))
        .attr("cy", d => yScale(d.Season))
        .attr("r", 10);
    

}

CreateChart(league, metric);



// async function CreateChart() {
//     const dataset = await d3.csv("MessiRonaldo.csv", data => {
//         return {
//             season: data.Season,
//             league: data.League,
//             metric: data.Metric,
//             messi: +data.Messi,
//             ronaldo: +data.Ronaldo,
//         }
//     });
//     const data = dataset.filter(d => d.league === "La Liga" && d.metric === "Goals");
    
//     data.forEach(element => {
//         element.min = d3.min([element.messi, element.ronaldo]);
//         element.max = d3.max([element.messi, element.ronaldo]);
//         element.delta = element.max - element.min;
//     });
    
//     // console.table(data);
//     const dimensions = {
//         width: 960,
//         height: 550,
//         margin: {
//             top: 20,
//             right: 20,
//             bottom: 40,
//             left: 100,
//         },
//     }

//     dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
//     dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

//     const wrapper = d3.select("#wrapper")
//         .append("svg")
//         .attr("width", dimensions.width)
//         .attr("height", dimensions.height);

//     const bounds = wrapper.append("g")
//         .attr("transform", `translate(${dimensions.margin.left},${dimensions.margin.top})`);
    
//     const mAccessor = d => d.messi;
//     const rAccessor = d => d.ronaldo;
//     const seasonAccessor = d => d.season;

//     const mScale = d3.scaleLinear()
//         .domain([0, d3.max(data, mAccessor)])
//         .range([0, dimensions.boundedWidth]);

//     const rScale = d3.scaleLinear()
//         .domain([0, d3.max(data, rAccessor)])
//         .range([0, dimensions.boundedWidth]);

//     const yScale = d3.scaleBand()
//         .domain(data.map(seasonAccessor))
//         .range([dimensions.boundedHeight, 0]);

//     const xScale = d3.scaleLinear()
//         .domain([0, d3.max(data, d => d.max)])
//         .range([0, dimensions.boundedWidth]);
        
//     const cScale = d3.scaleLinear()
//         .domain([0, d3.max(data, d => d.max)])
//         .range([1, 10]);

//     const bar = bounds
//         .selectAll(".bands")
//         .data(data)
//         .enter()
//         .append("rect")
//         .attr("class", "bands")
//         .attr("x", d => {
//             if (mScale(mAccessor(d)) > rScale(rAccessor(d))) {
//                 return rScale(rAccessor(d));
//             } else {
//                 return mScale(mAccessor(d));
//             }
//         })
//         .attr("y", d => yScale(seasonAccessor(d))-10)
//         .attr("width", d => {
//             if (mScale(mAccessor(d)) > rScale(rAccessor(d))) {
//                 return mScale(mAccessor(d))-rScale(rAccessor(d));
//             } else {
//                 return rScale(rAccessor(d))-mScale(mAccessor(d));
//             }
//         })
//         .attr("height", 20)

//     const mDots = bounds
//         .selectAll(".m-dots")
//         .data(data)
//         .enter()
//         .append("circle")
//         .attr("class", "m-dots")
//         .attr("cx", d => mScale(mAccessor(d)))
//         .attr("cy", d => yScale(seasonAccessor(d)))
//         .attr("r", 10);

//     const rDots = bounds
//         .selectAll(".r-dots")
//         .data(data)
//         .enter()
//         .append("circle")
//         .attr("class", "r-dots")
//         .attr("cx", d => rScale(rAccessor(d)))
//         .attr("cy", d => yScale(seasonAccessor(d)))
//         .attr("r", 10);

//     // render(laLigaData);

// }


// function render(data) {

// }


// CreateChart();