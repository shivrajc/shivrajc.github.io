
const margin = {top: 10, right: 20, bottom: 0, left:0};
const width = 960  - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;
const formatDecimal = d3.format(".1f")

const bubbles = [2, 3, 2, 1, 3] 

const xScale = d3.scaleBand()
                    .domain(data.map(d => d.country))
                    .range([margin.left, width])
                    .padding(0.1);

const yScale = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d.alcohol_in_litres)]);
                    // .range([document.querySelector(".bar").offsetHeight, 0]);

const tScale = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d.alcohol_in_litres)])
                    .range([0, 3000]);


const random = function(num) {
                return Math.floor(Math.random()*num);
}

const bars = d3.select(".container").selectAll(".bars")
            .data(data, d => d.country);

bars
    .enter()
    .append("div")
    .attr("class", "bars");

d3.selectAll(".bars")
    .each(function(d, i) {
        d3.select(this)
            .append("p")
            .attr("class", "title")
            .html(d => `${d.rank}. ${d.country}`);   
            // .html(d => `${d.rank}. ${d.country}: <span class="title-value">${d.alcohol_in_litres}</span>`);   
        
            
        const svg = d3.select(this)
                        .append("div")
                        .attr("class", "outer-bar")
                        .append("div")
                        .attr("class", "bar")
                        .append("svg")
                        .attr("width", document.querySelector(".bar").offsetWidth)
                        .attr("height", document.querySelector(".bar").offsetHeight);
        
        const barHeight = document.querySelector(".bar").offsetHeight;
        const barWidth = document.querySelector(".bar").offsetWidth;
        yScale.range([0, barHeight]);
        svg.append("rect")
                .attr("class", "val-bar")
                .attr("x", 0)
                .attr("y", barHeight)
                .attr("width", barWidth)
                .attr("height", 0)
                .transition()
                .duration(tScale(d.alcohol_in_litres))
                .delay(0)
                .on("end", function(){

                    const circles = 
                            svg.selectAll("circle")
                                .data(bubbles)
                                .enter()
                                .append("circle")
                                .attr("cx", (d, i) => random(barWidth))
                                .attr("cy", barHeight+10)
                                .attr("r", d => d * 3)
                                .attr("fill", "rgba(255, 255, 255, 0.8)");
                                
                    repeat();
    
                    
                    function repeat(){
                        circles
                        .transition()
                        .duration(3000)
                        .delay((d, i) => i * 1000)
                        .attr("cy", (d, i) => random(barHeight))
                        .style("opacity", 0)
                        .transition()
                        .duration(0)
                        .delay((d, i) => i * 1000)
                        // .delay(0)
                        .on("end", () => {
                            circles
                            .transition()
                            .duration(0)
                            .delay(0)
                            .attr("cy", (d, i) => barHeight+50)
                            .style("opacity", 1)
                            .on("end", () => {
                                repeat();
                            })
                        })
                    }
                })
                .attr("y", barHeight - yScale(d.alcohol_in_litres))
                .attr("height", yScale(d.alcohol_in_litres));
                
        const text = svg.append("text")
                        .attr("class", "value")
                        .text(formatDecimal(d.alcohol_in_litres))
                        .attr("x", barWidth/2)
                        .attr("y", barHeight-20);
        text.transition()
            .tween("text", function() {
                const selection = d3.select(this);   
                const start = 0; 
                const end = d.alcohol_in_litres;                     
                const interpolator = d3.interpolateNumber(start,end); 
        
            return function(t) { selection.text(formatDecimal(interpolator(t))); }; 
            // return function(t) { selection.text(formatDecimal(Math.round(interpolator(t)))); }; 
        })
        .duration(tScale(d.alcohol_in_litres));
    })

