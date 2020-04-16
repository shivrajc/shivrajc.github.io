const margin = {top: 40, right: 15, bottom: 20, left:15};
const width = 450 - margin.left - margin.right;
const height = 450 - margin.top - margin.bottom;

const squareWidth = (width/100)-2;

document.querySelector(".more-details").hidden=true;

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
  .on("end", () => {
    squares
      .enter()
      .append("rect")
      .classed("square", true)
      .attr("x", d => d.x)
      .attr("y", d => d.y-d.height)
      .transition()
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
  .attr("y", -2)
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
      .delay((d,i) => i)
      .attr("fill", (d, i) => (i+1)<=1600 ? "white" : "#EF3A49")
      .attr("stroke", (d, i) => (i+1)<=1600 ? "gray" : "#eee")
      .on("end", () => {
        index++;

        if (index === 1600) {
          svg.append("text")
          .classed("stat-label-1", true)
          .attr("x", width/2 - 60)
          .attr("y", (16*cellSize)/2+9)
          .text("Treated")
          .transition()
          .duration(500)
          .on("end", () => {
            svg.append("text")
            .classed("stat-label-1", true)
            .attr("x", width/2-60)
            .attr("y", (height/2)-30)
            .text("Not Treated")
            .transition()
            .duration(500);

            svg.append("text")
            .classed("source-label", true)
            .attr("x", 1)
            .attr("y", height - 50)
            .text("source: www.opfistula.org   |   design: @shivrajc")
          });                
        }
      })
}

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

function calcCellSize(w, h, ncol, nrow) {
  let gridWidth  = w - 2;
  let gridHeight = h - 2;
  let cellSize;

  let colWidth = Math.floor(gridWidth / ncol);
  let rowWidth = Math.floor(gridHeight / nrow);

  if (colWidth <= rowWidth) {
    cellSize = colWidth;
  } else {
    cellSize = rowWidth;
  }
  return cellSize;
}