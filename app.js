// Chart size
var margin = {top: 100, right: 100, bottom: 100, left: 100};
var width = Math.min(1000, window.innerWidth - 10) - margin.left - margin.right;
var height = Math.min(width, window.innerHeight - margin.top - margin.bottom);

// Colors
var color = d3.scaleOrdinal(["#012E40", "#03658C","#F26D78"]);

// Radar Chart options
var radarChartOptions = {
  width: width,
  height: height,
  margin: margin,
  maxValue: 0.2,
  levels: 6,
  roundStrokes: true,
  color: color,
  glow: true
};

// Call Radar Chart function
radarChart("#radar-chart", dataPerAxis, radarChartOptions);
