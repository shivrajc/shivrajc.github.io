const dimensions = {
    width:  650,
    height: 600,
    margin: {
        top: 20,
        right: 40,
        bottom: 60,
        left: 40,
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
    
const tooltip = d3.select("#tooltip");

const parseDate = d3.timeParse("%Y-%m-%d");
const dateFormatter = d3.timeFormat("%d-%b-%Y")
const bisectDate = d3.bisector(d => d.date).left

data.forEach(d =>{
        d.date = parseDate(d.date);
        d.price = +d.price;
})


const x = d3.scaleTime()
    .domain(d3.extent(data, function(d) { return d.date; }))
    .range([0, dimensions.boundedWidth]);

const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.price)+10])
    .range([dimensions.boundedHeight, 0]);
    
const xAxis = d3.axisTop().scale(x);
    
const yAxis = d3.axisLeft().scale(y).tickSize(-(dimensions.boundedWidth));

bounds.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(-3, ${dimensions.boundedHeight+40})`)
    .call(xAxis);

bounds.append("g")
    .attr("class", "y-axis")
    .call(yAxis);

bounds.selectAll(".y-axis .tick text")
    .attr("dx", 25)
    .attr("dy", -5);
    // .text(d => d + "p");


const linePetrol = d3.area()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d["petrol"]); });

const lineDiesel = d3.area()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d["diesel"]); });

const area = d3.area()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.date); })
    .y1(function(d) { return y(d["petrol"]); });


const dataset = d3.nest()
        .key(function(d) {return d.date;})
        .entries(data);

dataset.forEach(function(d) {
    d.date = d.values[0]['date'];
    d["petrol"] = d.values[0]['price'];
    d["diesel"] = d.values[1]['price'];
});

// for(i=dataset.length-1;i>0;i--) {
//         dataset[i].petrol   = dataset[i].petrol  -dataset[(i-1)].petrol ;
//         dataset[i].diesel     = dataset[i].diesel    -dataset[(i-1)].diesel ;
// }

dataset.shift(); // Removes the first element in the array


// y.domain([
//     //  d3.min(dataset, d => Math.min(d["petrol"], d["diesel"])),
//     0,
//      d3.max(data, d => d.price)
//     // 0, 150
// ]);

bounds.datum(dataset);

bounds.append("clipPath")
    .attr("id", "clip-above")
    .append("path")
    .attr("d", area.y0(0));

bounds.append("clipPath")
    .attr("id", "clip-below")
    .append("path")
    .attr("d", area.y0(dimensions.boundedHeight));

bounds.append("path")
    .attr("class", "area above")
    .attr("clip-path", "url(#clip-above)")
    .attr("d", area.y0(function(d) { return y(d["diesel"]); }));

bounds.append("path")
    .attr("class", "area below")
    .attr("clip-path", "url(#clip-below)")
    .attr("d", area.y0(function(d) { return y(d["diesel"]); }));

bounds.append("path")
    .attr("class", "line")
    .style("stroke-width", 1.5)
    .style("stroke", "#7c6918")
    .attr("d", linePetrol);

bounds.append("path")
    .attr("class", "line")
    .style("stroke-width", 1.5)
    .style("stroke", "#177272")
    .attr("d", lineDiesel);

bounds.append("text")
    .attr("class", "y-axis-title")
    .text("Price per litre (pence)")
    .attr("transform", `rotate(-90) translate(${-dimensions.boundedHeight}, -10)`)
    // .attr("transform", `translate(0, 0)`)

// const listeningRect = bounds.append("rect")
//     .attr("class", "listening-rect")
//     .attr("width", dimensions.boundedWidth)
//     .attr("height", dimensions.boundedHeight)
//     .on("mousemove", onMouseMove)
//     .on("mouseleave", onMouseLeave);

    

// function onMouseMove() {
//     const x0 = x.invert(d3.mouse(this)[0]),
//             i = bisectDate(dataset, x0, 1),
//             d0 = dataset[i - 1],
//             d1 = dataset[i],
//             d = x0 - d0.date > d1.date - x0 ? d1 : d0;

//     tooltip.style("transform", "translate(" + x(d.date) + "px," + y(d.petrol) + "px)");

//     tooltip.select(".tooltip-date").text(dateFormatter(d.date));
//     tooltip.select(".tooltip-petrol-label").text("Petrol: ");
//     tooltip.select(".tooltip-petrol-price").text(d.petrol);

//     tooltip.select(".tooltip-diesel-label").text("Diesel: ");
//     tooltip.select(".tooltip-diesel-price").text(d.diesel);

//     tooltip.style("opacity", 1);

// }

// function onMouseLeave() {
//     tooltip.style("opacity", 0)

//     // tooltipCircle.style("opacity", 0)
//   }


const focus = bounds.append("g")
  .attr("class", "focus")
  .style("display", "none");

focus.append("line")
  .attr("class", "x-hover-line hover-line")
  .attr("y1", 0)
  .attr("y2", dimensions.boundedHeight);

focus.append("line")
  .attr("class", "y-hover-line hover-line")
  .attr("x1", dimensions.boundedWidth)
  .attr("x2", dimensions.boundedWidth);

// focus.append("circle")
//   .attr("r", 7.5);

// focus.append("text")
//   .attr("x", 15)
//     .attr("dy", ".31em");

bounds.append("rect")
  .attr("transform", "translate(" + dimensions.margin.left + "," + dimensions.margin.top + ")")
  .attr("class", "overlay")
  .attr("width", dimensions.boundedWidth)
  .attr("height", dimensions.boundedHeight)
  .on("mouseover", function() { focus.style("display", null); })
  .on("mouseout", function() { focus.style("display", "none"); })
  .on("mousemove", mousemove);



bounds.append("circle")
    .attr("r", 4)
    .attr("cx", x(parseDate("2009-01-05")))
    .attr("cy", y(82))
    .attr("class", "circle-annotation");

bounds.append("rect")
    .attr("class", "line-annotation")
    .attr("x", x(parseDate("2009-01-05")))
    .attr("y", y(82))
    .attr("width", 1)
    .attr("height", 65);

bounds.append("text")
    .attr("class", "text-annotation-1")
    .attr("x", x(parseDate("2009-01-05")))
    .attr("y", y(52))
    .text("drop in demand due to 2008 recession")


bounds.append("circle")
    .attr("r", 4)
    .attr("cx", x(parseDate("2020-04-04")))
    .attr("cy", y(105))
    .attr("class", "circle-annotation");

bounds.append("rect")
    .attr("class", "line-annotation")
    .attr("x", x(parseDate("2020-04-04")))
    .attr("y", y(106))
    .attr("width", 1)
    .attr("height", 75);

bounds.append("text")
    .attr("class", "text-annotation-2")
    .attr("x", x(parseDate("2020-06-04")))
    .attr("y", y(73))
    .text("drop in demand due to COVID-2019")



function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(dataset, x0, 1),
        d0 = dataset[i - 1],
        d1 = dataset[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    // focus.attr("transform", "translate(" + x(d.date) + "," + y(d.petrol) + ")");
    focus.attr("transform", "translate(" + x(d.date) + ",0)");
    // focus.select("text").text(function() { return d.petrol; });
    // focus.select(".x-hover-line").attr("y2", dimensions.boundedHeight - y(d.petrol));
    focus.select(".x-hover-line").attr("y2", dimensions.boundedHeight);
    focus.select(".y-hover-line").attr("x2", dimensions.boundedWidth + dimensions.boundedWidth);

    d3.select(".hover-date-ban")
        .text(dateFormatter(d.date));

    UpdateBAN(Array.from(Math.round(d.diesel).toString()),  Array.from(Math.round(d.petrol).toString()))

    
  }


function UpdateBAN(petrol, diesel) {
    const pArray = petrol.map(item => item = +item);
    const dArray = diesel.map(item => item = +item);

    if (pArray.length < 3) {
        pArray.unshift(0);
    }

    if (dArray.length < 3) {
        dArray.unshift(0);
    }

    d3.select(".petrol-ban").selectAll("div")
        .data(pArray)
        .text(d => d);

    d3.select(".diesel-ban").selectAll("div")
        .data(dArray)
        .text(d => d);

}