
drawMainChart(dataset.filter(d => d.Year === 2019));


[... new Set(dataset.filter(d => d.Year === 2019).sort((a, b) => b.Value - a.Value).map(d => d.Country))].forEach((d,i) => {
    drawAreaChart(`area-chart-${i+1}`, dataset.filter(e => e.Country === d))
    // console.log(d)
})



function drawAreaChart(container, data) {
    const w = 320,
        h = 200,
        format = d3.format(".0%");

    const svg = d3.select(`.${container}`).append("svg")
        .attr("width", w)
        .attr("height", h);

    const bisectDate = d3.bisector(function(d) { return d.Year; }).left;

    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Year))
        .range([0, w]);
    
    const yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([h, 0]);
    
    const area = d3.area()
        .x(d => xScale(d.Year))
        .y0(yScale(0))
        .y1(d => yScale(d.Value))
        .curve(d3.curveNatural);

    const xAxis = d3.axisBottom()
        .scale(xScale)
        // .ticks(3);

    svg.append("linearGradient")
        .attr("id", "area-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", yScale(-0.1))
        .attr("x2", 0).attr("y2", yScale(1))
      .selectAll("stop")
        .data([
          {offset: "0%", color: "white"},
          {offset: "100%", color: "#FFC3AD"}
        ])
      .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });

    svg.append("path")
        .datum(data)
        .attr("d", area)
        .classed("area", true)
        .attr("fill", "RGBA(80, 80, 80, 0.2)")
    

    const line = d3.line()
        // .defined(d => !isNaN(d.value))
        .x(d => xScale(d.Year))
        .y(d => yScale(d.Value))
        .curve(d3.curveCardinal);

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#FF7F50")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    svg.append("text")
        .classed("country-title", true)
        .text(data[0].Country)
        .attr("x", 26)
        .attr("y", 40);

    svg.append("text")
        .classed("country-share", true)
        .text(format(data.filter(d => d.Year === 2019)[0].Value))
        .attr("x", 250)
        .attr("y", 40);

    svg.append("text")
        .classed("country-share-sub", true)
        .text("2019 seats")
        .attr("x", 234)
        .attr("y", 57);
        
        
    svg.append("line")
        .attr("x1", 0)
        .attr("y1", 100)
        .attr("x2", 320)
        .attr("y2", 100)
        .classed("area-axis-line", true);
    
    svg.append("text")
        .classed("area-axis-label", true)
        .text("50%")
        .attr("x", 295)
        .attr("y", 95);

    if (data[0].Country === "Sweden") {
        svg.append("text")
            .classed("area-axis-label-years", true)
            .text("2003")
            .attr("x", -2)
            .attr("y", 210);        

        svg.append("text")
                .classed("area-axis-label-years", true)
                .text("2019")
                .attr("x", 304)
                .attr("y", 210);        
    }


    const focus = svg.append("g")
        .attr("class", "focus")
        .style("opacity", 0);

    focus.append("circle")
        .attr("r", 5);

    focus.append("rect")
        .attr("class", "tooltip")
        .attr("width", 100)
        .attr("height", 50)
        .attr("x", 10)
        .attr("y", -22)
        .attr("rx", 4)
        .attr("ry", 4);

    focus.append("text")
        .attr("class", "tooltip-date")
        .attr("x", 18)
        .attr("y", -2);

    focus.append("text")
        .attr("x", 18)
        .attr("y", 18)
        .text("Seats: ");

    focus.append("text")
        .attr("class", "tooltip-seats")
        .attr("x", 60)
        .attr("y", 18);

    svg.append("rect")
        .attr("class", "overlay")
        .attr("fill", "transparent")
        .attr("width", w)
        .attr("height", h)
        .on("mouseover", function() { focus.style("opacity", 1); })
        .on("mouseout", function() { focus.style("opacity", 0); })
        .on("mousemove", mousemove);

    function mousemove() {
        
        let x0 = xScale.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;
        focus.attr("transform", "translate(" + xScale(d.Year) + "," + yScale(d.Value) + ")");
        focus.select(".tooltip-date").text(d.Year);
        focus.select(".tooltip-seats").text(format(d.Value));
    }



}


function drawMainChart(data) {
    data.sort((a, b) => b.Value - a.Value);
    data.sort((a, b) => a.Value - b.Value);

    const w=1200, 
        h=900,
        chartRadius = h / 2 - 10,
        PI = Math.PI,
        arcMinRadius = 40,
        arcPadding = 3,
        numArcs = data.length,
        axisLineWidth = 2;
        arcWidth = (chartRadius - arcMinRadius - numArcs * arcPadding) / numArcs;

    const format = d3.format(".0%");

    const tooltip = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

    let scale = d3.scaleLinear()
        .domain([0, 1])
        .range([-PI/2, PI/2]);

    let scale2 = d3.scaleLinear()
        .domain([1, 0])
        .range([-PI/2, PI/2]);

    const svg = d3.select(".main-chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h/2)
        .append("g")
        .attr("transform", `translate(${w/2},${h/2})`);

        
    const arcTween = function(d, i) {
        let interpolate = d3.interpolate(0, d.Value);
        return t => arc(interpolate(t), i);
    }

    const arcTween2 = function(d, i) {
        let interpolate = d3.interpolate(0, 1);
        return t => arc2(interpolate(t), i);
    }

    const arcTween3 = function(d, i) {
        let interpolate = d3.interpolate(0, 1);
        return t => arc3(interpolate(t), i);
    }

    const getInnerRadius = function(index) {
        return arcMinRadius + (numArcs - (index + 1)) * (arcWidth + arcPadding);
    }

    const getOuterRadius = function(index) {
        return getInnerRadius(index) + arcWidth;
    }

    
    let arc2 = d3.arc()
        .innerRadius((d, i) => getInnerRadius(i))
        .outerRadius((d, i) => getOuterRadius(i))
        .startAngle((d, i) => scale2(d))
        .endAngle(PI/2);
    
    let arcs2 = svg.append('g')
        .selectAll('path')
        .data(data)
        .enter().append('path')
        .classed("base-arc", true)
        .attr("id", (d, i) => `arc2-${i}`);
        // .style('fill', "#DEE2E6");
        
    arcs2.transition()
        // .delay((d, i) => i * 200)
        .duration(1000)
        .attrTween('d', arcTween2);            
        
    let arc = d3.arc()
        .innerRadius((d, i) => getInnerRadius(i))
        .outerRadius((d, i) => getOuterRadius(i))
        .startAngle(-PI/2)
        .endAngle((d, i) => scale(d));
        
    let arcs = svg.append('g')
        .selectAll('path')
        .data(data)
        .enter().append('path')
        .attr("id", (d, i) => `arc-${i}`)
        .classed('arc', true);
        // .style('fill', "#FF7F50");
        
        arcs.transition()
        // .delay((d, i) => i * 200)
        .duration(1000)
        .attrTween('d', arcTween);            
        
        let arc3 = d3.arc()
        .innerRadius((d, i) => getInnerRadius(i))
        .outerRadius((d, i) => getOuterRadius(i))
        .startAngle((d, i) => scale2(d))
        .endAngle(PI/2);
        
        let arcs3 = svg.append('g')
        .selectAll('path')
        .data(data)
        .enter().append('path')
        .classed('arc-hover', true)
        .attr("id", (d, i) => `arc2-${i}`)
        .style('fill', "transparent");
        
    arcs3.transition()
        // .delay((d, i) => i * 200)
        .duration(1000)
        .attrTween('d', arcTween3);            
    

    d3.selectAll(".arc-hover")
        .on("mouseover", function(d)  {
            d3.select(this)
                .attr("stroke", "#333232")
                .attr("stroke-width", 0.7)
                .style("cursor", "pointer")
               
            tooltip.transition()		
                .duration(100)		
                .style("opacity", 1);		
            tooltip.html(`<p class='tooltip-arc-country'>${d.Country}</p><p class="tooltip-arc-value"><span>${format(d.Value) }</span> seats held by women in 2019</p>`)	
                .style("left", (d3.event.pageX + 20) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })                
            // console.log(d.Country)
        .on("mouseout", function(d) {
            d3.select(this).attr("stroke", "none") ;    
            tooltip.transition()		
            .duration(200)		
            .style("opacity", 0);	                     
        })

        // svg
    //     .selectAll(".labels")
    //     .data(data)
    //     .enter()
    //     .append("text")
    //     .attr("class", "labels")
    //     .style("font-size",8)
    //     .style("fill","white")
    //     .attr("dy", 6.5)
    //     .append("textPath")
    //     .attr("xlink:href",(d, i) => `#arc-${i}`)
    //     .attr("startOffset",function(d,i){return "0.4%";})
    //     .text(function(d){return d.Country;})

    svg
        .append("text")
        .attr("class", "radial-axis-label")
        // .style("font-size",10)
        // .style("fill","white")
        .attr("dy", -4)
        .append("textPath")
        .attr("text-anchor", "center")
        .attr("xlink:href",`#arc2-${0}`)
        .attr("startOffset",function(d,i){return "12.25%";})
        .text("25%");

    svg
        .append("text")
        .attr("class", "radial-axis-label")
        // .style("font-size",10)
        // .style("fill","white")
        .attr("dy", -4)
        .append("textPath")
        .attr("text-anchor", "center")
        .attr("xlink:href",`#arc2-${0}`)
        .attr("startOffset",function(d,i){return "24.75%";})
        .text("50%");

    svg
        .append("text")
        .attr("class", "radial-axis-label")
        // .style("font-size",10)
        // .style("fill","white")
        .attr("dy", -4)
        .append("textPath")
        .attr("text-anchor", "center")
        .attr("xlink:href",`#arc2-${0}`)
        .attr("startOffset",function(d,i){return "37.25%";})
        .text("75%");

    svg
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", chartRadius * Math.sin(3*Math.PI/4))
        .attr("y2", chartRadius * Math.cos(3*Math.PI/4))
        .classed("radial-axis-lines", true)
        .attr("stroke", "white")            
        .attr("stroke-width", axisLineWidth);            

    svg
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", chartRadius * Math.sin(-3*Math.PI/4))
        .attr("y2", chartRadius * Math.cos(-3*Math.PI/4))
        .classed("radial-axis-lines", true)
        .attr("stroke", "white")            
        .attr("stroke-width", axisLineWidth);            

    svg
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", -chartRadius)
        .classed("radial-axis-lines", true)
        .attr("stroke", "white")            
        .attr("stroke-width", axisLineWidth);      
        
    svg.append("text")
        .attr("x", -18)
        .attr("y", 0)
        .text("2019")
        .attr("text-anchor", "center")
}

