const margin = {top: 60, right: 20, bottom: 20, left:45};
const width = 800 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

const squareWidth = (width/100)-2;

const svg = d3.select(".container")
                .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let cellSize = calcCellSize(width, height, 100, 100);

let gridD = gridData(100, 100, cellSize);

let squares = svg.selectAll(".square")
                    .data(gridD, d => d.id);

const legend =  svg.append("g")
                    .attr("transform", "translate(0, -13)");  

let el = 0;                    

d3.select(".text-content")
  .classed("invisible", false)
  .classed("fade-in", true)
  .transition()
  // .duration(250)
  .on("end", () => {
    squares
      .enter()
      .append("rect")
      .classed("square", true)
      .attr("x", d => d.x)
      .attr("y", d => d.y-d.height)
      .transition()
        // .delay((d,i) => d.y+1000)
        // .duration(250)
        .ease(d3.easeLinear)
        .attr("fill", "#EF3A49")
        .attr("stroke", "#eee")
        .attr("width", d => d.width)
        .attr("height", d => d.height)
      .on("end", () => {
        el++;
        if (el == 10000) {
          addLegend();
        }        
      })
    })      

function addLegend() {
  let index = 0;

  legend.append("rect")
  .classed("legend-square", true)
  .attr("x", 1)
  .attr("y", -5)
  .attr("width", cellSize)
  .attr("height", cellSize);

  legend.append("text")
  .classed("legend-text", true)
  .attr("x", 13)
  .attr("y", 2)
  .text("= 100 women");

  d3.selectAll(".square")
      .data(gridD.filter(d => d.id <= 1600))
      .transition()
      .delay((d,i) => i )
      // .duration(1000)
      .attr("fill", (d, i) => (i+1)<=1600 ? "white" : "#EF3A49")
      .attr("stroke", (d, i) => (i+1)<=1600 ? "gray" : "#eee")
      .on("end", () => {
        index++;

        if (index === 1600) {
          svg.append("text")
          .classed("stat-label-1", true)
          .attr("x", width/2)
          .attr("y", (16*cellSize)/2+15)
          .text("Treated")
          .transition()
          .duration(500)
          .on("end", () => {
            svg.append("text")
            .classed("stat-label-1", true)
            .attr("x", width/2)
            .attr("y", (height/2))
            .text("Not Treated")
            .transition()
            .duration(500)
          });                
        }
      })
}




                  // .transition()
                  // // .delay(d => d.y)
                  // .delay((d,i) => i+20)
                  // .duration(250)
                  // .ease(d3.easeLinear)
                  // .attr("fill", (d, i) => (i+1)<=1600 ? "white" : "#f85168")
                  // .attr("stroke", (d, i) => (i+1)<=1600 ? "gray" : "#eee")
                  // .style("opacity", 1.0)
                  // .attr("x", d => d.x)
                  // .attr("y", d => d.y);

    
    
  console.log(el);




                    


// squares
//   .enter()
//   .append("rect")
//   .classed("square", true)
//   .attr("x", d => d.x)
//   .attr("y", d => d.y-d.height)
//   .attr("width", d => d.width)
//   .attr("height", d => d.height)
//   .attr("fill", "gray")
//   .attr("stroke", (d, i) => (i+1)<=1600 ? "gray" : "#eee")
//   // .style("opacity", 0.0)
//   .transition()
//   .delay((d,i) => i+20)
//   .duration(250)
//   .ease(d3.easeLinear)
//     .attr("fill", (d, i) => (i+1)<=1600 ? "white" : "#f85168")
//     .style("opacity", 1.0)
//     .attr("x", d => d.x)
//     .attr("y", d => d.y);
    // .transition()



// function that generates a nested array for square grid
function gridData(ncol, nrow, cellsize) {
  let gridData = [];
  let xpos = 1;  
  let ypos = 1;
  let index = 1;

  let cellSize = cellsize;

  for (var row = 0; row < nrow; row++) {
    for (var col = 0; col < ncol; col++) {

      gridData.push({
        id: index,
        x: xpos,
        y: ypos,
        width: cellSize,
        height: cellSize
      });
      
      xpos += cellSize;
      index++;
    }
    
    xpos = 1;
    ypos += cellSize;
  }
  return gridData;
}

// function to calculate grid cell size based on width and height of svg
function calcCellSize(w, h, ncol, nrow) {
  // leave tiny space in margins
  var gridWidth  = w - 2;
  var gridHeight = h - 2;
  var cellSize;

  // calculate size of cells in columns across
  var colWidth = Math.floor(gridWidth / ncol);
  // calculate size of cells in rows down
  var rowWidth = Math.floor(gridHeight / nrow);

  // take the smaller of the calculated cell sizes
  if (colWidth <= rowWidth) {
    cellSize = colWidth;
  } else {
    cellSize = rowWidth;
  }
  return cellSize;
}