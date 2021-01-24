AOS.init();  

[...document.querySelectorAll("ul.flavors-cboxtags li input[type='checkbox']")].forEach(cb => cb.checked=true);

const effects = 
    ["Aroused","Creative","Energetic","Euphoric","Focused","Giggly","Happy","Hungry","None","Relaxed","Sleepy","Talkative","Tingly","Uplifted"];

const flavors = ["Ammonia","Apple","Apricot","Berry","Bubblegum","Butter","Cheese","Chemical","Chestnut","Citrus","Coffee","Diesel","Earthy","Flowery","Fruity","Grape","Honey","Lavender","Lemon","Mango","Menthol","Minty","None","Nutty","Orange","Peach","Pear","Pepper","Pineapple","Plum","Pungent","Rose","Sage","Skunk","Spicy/Herbal","Strawberry","Sweet","Tar","Tea","Tobacco","Tree","Tropical","Vanilla","Violet","Woody"];
const width = 330,
    height = 600,
    barChartHeight = 200,
    w = 900, 
    h = 700;

dataset.forEach(d => {
    d.x = 0;
    d.y = 0;

    if ((typeof d.rating_bin) === "number") {
        d.rating_bin = d.rating_bin.toString()
    } 
})

const svgRadial = d3.select(".chart-container")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

const innerRadius = 100,
      outerRadius = 260;

let effectStrains = [];

effects.forEach(e => {
    effectStrains.push(
        {effect: e, type: "indica", strains: dataset.filter(d => d.effects.includes(e) && d.type === "indica").length}
    )
    effectStrains.push(
        {effect: e, type: "sativa", strains: dataset.filter(d => d.effects.includes(e) && d.type === "sativa").length}
    )
    effectStrains.push(
        {effect: e, type: "hybrid", strains: dataset.filter(d => d.effects.includes(e) && d.type === "hybrid").length}
    )        
})

d3.select(".item-tooltip-header-title button")
    .on("click", () => {
        d3.select(".modal-overlay").classed("closed", true)
        d3.select(".item-tooltip").classed("closed", true)
    })


const tooltip = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

const tooltipDot = d3.select("body").append("div")	
    .attr("class", "tooltip-dot")				
    .style("opacity", 0);

const itemTooltip = d3.select(".item-tooltip");

const modalOverlay = d3.select(".modal-overlay")

const donutG = svgRadial.append("g")
    .attr("transform", `translate(${w/2}, ${h/2})`)


// ------------------------------------------------------------------------------------------------------------------------------------------

// Code source for labels on the arcs: https://www.visualcinnamon.com/2015/09/placing-text-on-arcs.html

const arc = d3.arc()
    .innerRadius(w*0.6/2) 
    .outerRadius(w*0.6/2 + 10);

const pie = d3.pie()
    .startAngle(-0.1*Math.PI/180)
    .endAngle(-0.1*Math.PI/180 + 2 * Math.PI)
    .value(function(d) { return 100/effectStrains.length; })
    .padAngle(.01);


//Create the donut slices and also the invisible arcs for the text 
donutG.selectAll(".donutArcs")
    .data(pie(effectStrains.filter(d => d.type === "indica")))
    .enter().append("path")
    .attr("class", "donutArcs")
    .attr("d", arc)
    .style("fill", "none")
.each(function(d,i) {
    //Search pattern for everything between the start and the first capital L
    var firstArcSection = /(^.+?)L/; 	

    //Grab everything up to the first Line statement
    var newArc = firstArcSection.exec( d3.select(this).attr("d") )[1];
    //Replace all the comma's so that IE can handle it
    newArc = newArc.replace(/,/g , " ");
    
    //If the end angle lies beyond a quarter of a circle (90 degrees or pi/2) 
    //flip the end and start position
    if (d.startAngle >  90 * Math.PI/180 && d.endAngle < 270 * Math.PI/180) {
        var startLoc 	= /M(.*?)A/,		//Everything between the first capital M and first capital A
            middleLoc 	= /A(.*?)0 0 1/,	//Everything between the first capital A and 0 0 1
            endLoc 		= /0 0 1 (.*?)$/;	//Everything between the first 0 0 1 and the end of the string (denoted by $)
        //Flip the direction of the arc by switching the start en end point (and sweep flag)
        //of those elements that are below the horizontal line
        var newStart = endLoc.exec( newArc )[1];
        var newEnd = startLoc.exec( newArc )[1];
        var middleSec = middleLoc.exec( newArc )[1];
        
        //Build up the new arc notation, set the sweep-flag to 0
        // newArc = "M" + newStart + "A" + middleSec + "0 0 0 " + newEnd;
        newArc = "M" + newStart + "A" + middleSec + "0 0 0 " + newEnd;
    }//if
    
    //Create a new invisible arc that the text can flow along
    donutG.append("path")
        .attr("class", "hiddenDonutArcs")
        .attr("id", "donutArc"+i)
        .attr("d", newArc)
        .style("fill", "none");
});
    
//Append the label names on the outside
donutG.selectAll(".donutText")
    .data(pie(effectStrains.filter(d => d.type === "indica")))
    .enter().append("text")
    .attr("class", "donutText")
    //Move the labels below the arcs for those slices with an end angle greater than 90 degrees
    .attr("dy", function(d,i) { return (d.startAngle >  90 * Math.PI/180 && d.endAngle < 270 * Math.PI/180 ? 25 : -15); })
    .append("textPath")
    .attr("startOffset","50%")
    .style("text-anchor","middle")
    .attr("xlink:href",function(d,i){return "#donutArc"+i;})
    .text(function(d){return d.data.effect;});


// ------------------------------------------------------------------------------------------------------------------------------------------


svgRadial.selectAll(".lines")
    .data(effects)
    .enter()
    .append("line")
    .attr("x1", (d, i) => (w/2) + innerRadius * Math.sin(-i * (1/effects.length) * 2 * Math.PI + (Math.PI/2)))
    .attr("y1", (d, i) => (h/2) + innerRadius * Math.cos(-i * (1/effects.length) * 2 * Math.PI + (Math.PI/2)))
    .attr("x2", (d, i) => (w/2) + outerRadius * Math.sin(-i * (1/effects.length) * 2 * Math.PI + (Math.PI/2)))
    .attr("y2", (d, i) => (h/2) + outerRadius * Math.cos(-i * (1/effects.length) * 2 * Math.PI + (Math.PI/2)))
    .classed("lines", true);

drawDots("indica", 100, effectStrains.filter(d => d.type === "indica"))
drawDots("sativa", 180, effectStrains.filter(d => d.type === "sativa"))
drawDots("hybrid", 260, effectStrains.filter(d => d.type === "hybrid"))

appendTextArcs("hybrid", 225)
appendTextArcs("sativa", 145)
appendTextArcs("indica", 65)

svgRadial.append("text")
    .classed("total-label-1", true)
    .text(dataset.length)
    .attr("x", w/2)
    .attr("y", h/2-2);

svgRadial.append("text")
    .classed("total-label-2", true)
    .text("Total strains")
    .attr("x", w/2)
    .attr("y", h/2+18);



function appendTextArcs(type, radius) {
    const textArc = d3.arc()
        .innerRadius(radius)
        .outerRadius(radius)
        .startAngle(4.5)
        .endAngle(8);

    const arcG = svgRadial.append("g")
        .attr("transform", `translate(${w/2}, ${h/2})`);

    arcG
        .append("path")
        .attr("id", `text-arc-${type}`)
        .attr("d", textArc())
        .attr("fill", "blue");

    arcG.append("text")
        .attr("id", `curve-text-${type}`)
    .append("textPath")
        .attr("xlink:href", `#text-arc-${type}`)
        .attr("startOffset", type === "sativa" ? "23.7%" : type === "indica" ? "21.5%" : "24%")
        .text(`${type}`);
}


function drawDots(type, r, data) {
    
    const rScale = d3.scaleSqrt()
        .domain([0, d3.max(effectStrains, d => d.strains)])
        .range([0, 28]);

    svgRadial.append("circle")
        .attr("cx", w/2)
        .attr("cy", h/2)
        .attr("r", r)
        .classed(`${type}-circle`, true);



    svgRadial.selectAll(`.${type}-dots`)
        .data(data)
        .enter()
        .append("circle")
        .classed(`${type}-dots`, true)
        .classed(`dots`, true)
        .attr("cx", (d, i) => (w/2) + r * Math.sin(-(i-45) * (1/data.length) * 2 * Math.PI + (Math.PI/2)))
        .attr("cy", (d, i) => (h/2) + r * Math.cos(-(i-45) * (1/data.length) * 2 * Math.PI + (Math.PI/2)))
        .attr("r", d => rScale(d.strains))
        .on("mouseover", function(d) {		
            tooltip.transition()		
                .duration(100)		
                .style("opacity", .9);		
            tooltip.html(`<p class='tooltip-strains'>${d.strains}</p><p><strong>${d.type}</strong> strains have <strong>${d.effect}</strong> effect</p>`)	
                .style("left", (d3.event.pageX + 20) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })					
        .on("mouseout", function(d) {		
            tooltip.transition()		
                .duration(200)		
                .style("opacity", 0);	
        });

;

}


const svg1 = d3.select(".wrapper-1")
    .append("svg")
        .attr("width", width)
        .attr("height", height);

const svg2 = d3.select(".wrapper-2")
    .append("svg")
        .attr("width", width)
        .attr("height", height);

const svg3 = d3.select(".wrapper-3")
    .append("svg")
        .attr("width", width)
        .attr("height", height);

const svgBars1 = d3.select(".bar-chart-indica")
    .append("svg")
        .attr("width", width)
        .attr("height", barChartHeight);

const svgBars2 = d3.select(".bar-chart-sativa")
    .append("svg")
        .attr("width", width)
        .attr("height", barChartHeight);

const svgBars3 = d3.select(".bar-chart-hybrid")
    .append("svg")
        .attr("width", width)
        .attr("height", barChartHeight);


document.querySelectorAll("ul.effects-cboxtags li label").forEach(label => {
    label.innerText = label.innerText + " (" + (dataset.filter(d => d.effects.includes(label.innerText)).length) + ")"
})

document.querySelectorAll("ul.flavors-cboxtags li label").forEach(label => {
    label.innerText = label.innerText + " (" + (dataset.filter(d => d.flavor.includes(label.innerText)).length) + ")"
})


document.querySelectorAll("ul.effects-cboxtags input[type='checkbox']").forEach(el => {
    el.addEventListener("change", () => UpdateData())
});

document.querySelectorAll("ul.flavors-cboxtags input[type='checkbox']").forEach(el => {
    el.addEventListener("change", () => UpdateData())
});


UpdateData();

function UpdateData() {
        const data = 
            dataset
                .filter(d => d.effects.split(",").filter(e => getCheckedItems("ul.effects-cboxtags").includes(e)).length > 0)
                .filter(d => d.flavor.split(",").filter(f => getCheckedItems("ul.flavors-cboxtags").includes(f)).length > 0);

        data.sort((a, b) => b.rating - a.rating);

        UpdateChart(data.filter(d => d.type === "indica"), svg1, "indica", svgBars1)
        UpdateChart(data.filter(d => d.type === "sativa"), svg2, "sativa", svgBars2)
        UpdateChart(data.filter(d => d.type === "hybrid"), svg3, "hybrid", svgBars3)                   
}


function UpdateChart(data, svg, type, svgBars) {
    let itemCount = {};
    let i = 0, y2 =0, ypos = 0;
    const cellSize=10, cells=32;                  

    // Hex calculations source: 'http://bl.ocks.org/nbremer/bd3dd129b4a812828397a85db6ba36b7'

    let SQRT3 = Math.sqrt(3),
    hexRadius = (cellSize+2)/2,
    hexWidth = SQRT3 * hexRadius,
    hexHeight = 2 * hexRadius;
    let hexagonPoly = [[0,-1],[SQRT3/2,0.5],[0,1],[-SQRT3/2,0.5],[-SQRT3/2,-0.5],[0,-1],[SQRT3/2,-0.5]];
    let hexagonPath = "m" + hexagonPoly.map(function(p){ return [p[0]*hexRadius, p[1]*hexRadius].join(','); }).join('l') + "z";


    d3.select(`.wrapper-header-${type} .wrapper-header-value`)
        .transition()
        .text(data.length);

    const ratings = [...new Set(data.map(d => d.rating_bin))]
                    .map(r => {
                        return ({
                            key: r,
                            value: parseInt(`${r[0]}0`)
                        })
                    }).sort((a, b) => b.value - a.value);
    
    const effectData = getCheckedItems("ul.effects-cboxtags").map(e => {
        return ({
            effect: e,
            strains: data.filter(d => d.effects.includes(e)).length
        })
    }).sort((a, b) => b.strains - a.strains);             

    const values = ratings.map(r => r.key)

    values.forEach(item => {
        itemCount[item] = data.filter(d => d.rating_bin === item).length;
    });



    // Hex unit chart

    svg.selectAll(".label")
        .remove();
    svg.selectAll(".value-label")
        .remove();
 
    values.forEach((el, j) => {
        ypos = d3.max(data, d => d.y) + cells + 20;
        i = 0;
                
        const text = svg.append("text")
            .attr("x", (i % cells) * cellSize)
            .attr("y", (Math.floor(i / cells) * cellSize) + ypos-8)
            .text(el + ":")
            .classed("label", true)
            .classed(`${type}-label`, true)
            .attr("class", "label")
            .style("opacity", 0);
        
        svg.append("text")
            .attr("x", (i % cells) * cellSize + text.node().getBBox().width + 5)
            .attr("y", (Math.floor(i / cells) * cellSize) + ypos-8)
            .text(itemCount[el])
            .classed("value-label", true)
            .classed(`${type}-value-label`, true)
            .style("opacity", 0);
        
        data.forEach(d => {
            if (d.rating_bin === el) {
                if ((Math.floor(i / cells)) % 2 !== 0) {
                    d.x = ((i % cells) * cellSize)+5;
                    d.y = (Math.floor(i / cells) * cellSize) + ypos - (Math.floor(i / cells)) ;    
                } else {
                    d.x = (i % cells) * cellSize;
                    d.y = (Math.floor(i / cells) * cellSize) + ypos - (Math.floor(i / cells));    
                }
                i += 1;
            }
        });
    })

    const items = svg.selectAll(`.${type}-item`)
        .data(data, d => d.strain);

    items
        .exit()
        .remove();

    items
        .enter()
      .append("path")
        .classed(`${type}-item`, true)
        .classed(`item`, true)
      .merge(items)
        .attr("d", d =>  "M" + (d.x+5) + "," + (d.y+5) + hexagonPath)
        .on("mouseover", function(d) {
            d3.event.preventDefault();

            tooltipDot.transition()		
                .duration(100)		
                .style("opacity", .9);		
            tooltipDot.html(`<p>${d.strain}</p>`)	
                .style("left", (d3.event.pageX + 20) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	            
            })				
        .on("mouseout", function(d) {	
            d3.event.preventDefault();	

            tooltipDot.html(`<p>${d.strain}</p>`)
            tooltipDot.transition()		
                .duration(100)		
                .style("opacity", 0);	            
        })        
        .on("click", function(d) {
            d3.event.preventDefault();

            d3.select(".item-tooltip-title").text(d.strain);	
            d3.select(".item-tooltip-desc").text(d.description);	
            d3.select(".item-tooltip-rating-value").text(d3.format(".1f") (d.rating));	
            
            d3.select(".item-tooltip-effects-value").selectAll("p").remove();
            d3.select(".item-tooltip-effects-value").html(d.effects.split(",").map(eff => `<p>${eff},&nbsp</p>`).join('').slice(0, -10) + "</p>");

            d3.select(".item-tooltip-flavors-value").selectAll("p").remove();
            d3.select(".item-tooltip-flavors-value").html(d.effects.split(",").map(eff => `<p>${eff},&nbsp</p>`).join('').slice(0, -10) + "</p>");
         
            tooltipDot.style("opacity", 0);
            modalOverlay.classed("closed", false);
            itemTooltip.classed("closed", false);

            })				

        .transition()
        .ease(d3.easeSin)
        .on("end", e => {
            d3.selectAll(".label")
                .style("opacity", 1);
            d3.selectAll(".value-label")
                .style("opacity", 1);                
        });        

    d3.selectAll(`${type}-item`)
        .on("mousemove", () => {
            console.log(d => d.strain)
        })

    data.forEach(d => {
            d.x = 0;
            d.y = 0;
    });
}

function getCheckedItems(cls) {
    return [...document.querySelectorAll(`${cls} input[type='checkbox']`)]
        .filter(node => node.checked).map(item => item.defaultValue)
}


function selectAllEffects() {
    [...document.querySelectorAll("ul.effects-cboxtags li input[type='checkbox']")].forEach(cb => cb.checked=true);
    UpdateData()
}

function selectAllFlavors() {
    [...document.querySelectorAll("ul.flavors-cboxtags li input[type='checkbox']")].forEach(cb => cb.checked=true);
    UpdateData()
}

function clearEffects() {
    [...document.querySelectorAll("ul.effects-cboxtags li input[type='checkbox']")].forEach(cb => cb.checked=false);
    UpdateData()
}

function clearFlavors() {
    [...document.querySelectorAll("ul.flavors-cboxtags li input[type='checkbox']")].forEach(cb => cb.checked=false);
    UpdateData()
}