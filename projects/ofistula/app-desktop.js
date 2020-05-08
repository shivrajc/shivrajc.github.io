const dimensions = {
    // width: document.querySelector(".canvas").offsetWidth,
    width: document.querySelector(".canvas").offsetWidth,
    height: document.querySelector(".canvas").offsetHeight,
    margin: {
        top: 0,
        right: 20,
        bottom: 20,
        left: 30,
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


const radios = document.querySelectorAll("input[type=radio]");
let col = "age_group";

data.forEach(d => {
    d.All = "All";
    d.x = 0;
    d.y = 0;
});

const age_group = ["less than 20", "21 to 30", "31 to 40", "41 to 50", "51 to 60", "greater than 60"];
const education_level = ["Above Secondary", "Completed Secondary", "Some Secondary Eduction But Did Not Finish", "Completed Primary", "Started Primary But Did Not Finish", "None", "Don't Know/Not Available"];
const cause_of_fistula = ["Obstructed Labor", "Caesarean Section", "Other Surgery", "Hysterectomy", "Hysterectomy Related To Caesarean Section", "Sexual Violence", "Trauma", "Don't Know/Other"];
const patient_symptoms = ["Leaking Urine", "Leaking Feces", "Leaking Urine and Feces"];
const length_of_labor = ["between 13 and 24 hours", "between 24 hours and 2 days", "between 2 and 3 days", "more than 4 days", "don't know/not available"];
const location_of_delivery = ["community health centre", "government hospital", "home", "home of traditional birth attendant", "private hospital", "Roadside on the way to hospital", "not available"];
const outcome_of_delivery = ["stillbirth", "live birth", "early neonatal death", "not available"];


wrapper.append("rect")
    .attr("x", 30)
    .attr("y", 0)
    .attr("class", "item-legend");

wrapper.append("text")
    .attr("x", 55)
    .attr("y", 12)
    .attr("class", "label-legend")
    .text(" = 1 woman");


bounds.selectAll("div.item")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => (i%60) * 16)
    .attr("y", -20)
    // .attr("y", (d, i) => Math.floor(i/60) * 16 + 20)
    .attr("class", "item");

// d3.select("button").on("click", () => {
//     UpdateChart("age_group", age_group);
// });

// UpdateChart("age_group", age_group);

radios.forEach(radio => {
    radio.addEventListener("change", () => {
        col = document.querySelectorAll("input[name=radioStats]:checked")[0].value;
        
        switch (col) {
            case 'All':
                UpdateChart(col, ["All"]);
                break;
            case 'age_group':
                UpdateChart(col, age_group);
                break;
            case 'education_level':
                UpdateChart(col, education_level);
                break;
            case 'cause_of_fistula':
                UpdateChart(col, cause_of_fistula);
                break;
            case 'patient_symptoms':
                UpdateChart(col, patient_symptoms);
                break; 
            case 'length_of_labor':
                UpdateChart(col, length_of_labor);
                break;
            case 'location_of_delivery':
                UpdateChart(col, location_of_delivery);
                break;
            case 'outcome_of_delivery':
                UpdateChart(col, outcome_of_delivery);
                break;
            
            default:
                UpdateChart("All", ["All"]);
        }
    })
})

UpdateChart("All", ["All"]);

function UpdateChart(column, values) {
    let itemCount = {};
    let i = 0, y2 =0, ypos = 0;

    values.forEach(item => {
        itemCount[item] = data.filter(d => d[column] === item).length;
    })

    d3.selectAll(".label")
        .remove();
    d3.selectAll(".value-label")
        .remove();

    values.forEach((el, j) => {
        ypos = d3.max(data, d => d.y) + 60;
        i = 0
        
        const text = bounds.append("text")
            .attr("x", (i%60) * 16)
            .attr("y", (Math.floor(i/60) * 16) + ypos-8)
            .text(el)
            .attr("class", "label")
            .style("opacity", 0);

        bounds.append("text")
            .attr("x", (i%60) * 16 + text.node().getBBox().width + 10)
            .attr("y", (Math.floor(i/60) * 16) + ypos-8)
            .text(itemCount[el])
            .attr("class", "value-label")
            .style("opacity", 0);

        data.forEach(d => {
            if (d[column] === el) {
                d.x = (i%60) * 16;
                d.y = (Math.floor(i/60) * 16) + ypos;
                i += 1;
            }
        });
    })

    d3.selectAll(".item")
        .transition()
        .duration(1000)
        .ease(d3.easeSin)
        .attr("x", d => d.x)
        .attr("y", d => d.y)
        .on("end", e => {
            d3.selectAll(".label")
                .style("opacity", 1);
            d3.selectAll(".value-label")
                .style("opacity", 1);                
        });

    data.forEach(d => {
            d.x = 0;
            d.y = 0;
        });
}



