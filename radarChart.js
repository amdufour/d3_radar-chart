/////////////////////////////////////////////////////////
/////////////// The Radar Chart Function ////////////////
///////////// Written by Anne-Marie Dufour //////////////
//// Adapted from Nadieh Bremer, VisualCinnamon.com /////
/////////// Inspired by the code of alangrafu ///////////
/////////////////////////////////////////////////////////

function radarChart(selector, data, options) {
  // Default configuration
  var cfg = {
    width: 600, //Width of the circle
    height: 600, //Height of the circle
    margin: {top: 20, right: 20, bottom: 20, left: 20}, //Margins of the SVG element
    levels: 3, //How many levels of inner circles should be drawn
    maxValue: 1, //Value that the biggest circle will represent
    labelFactor: 1.25, //How much further for the outer circle the labels should be positioned
    wrapWidth: 60, //The number of pixels after which a label needs to be given a new line
    opacityArea: 0.35, //Opacity of the area of the blob
    dotRadius: 4, //Size of the circles representing each value
    opacityCircles: 0.1, //Opacity of the circles representing each value
    strokeWidth: 2, //Width of the stroke around each blob
    roundStrokes: false, //If true, teh area and stroke of the blobs will follow a round path (cardinal-closed interpolation)
    color: d3.scaleOrdinal(d3.schemeCategory10), //Color function
    glow: false, //If true, will add a glow effect to the data
  }

  // Populate cfg with options
  if (typeof options !== 'undefined') {
    for (var i in options) {
      if (typeof options[i] !== 'undefined') {
        cfg[i] = options[i];
      }
    }
  }
  
  // If the supplied maxValue is smaller than the max in the data, replace by the max in the data
  /* To refactor - not working properly */
  // var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i) {
  //   return d3.max(i.map(function(o) {
  //     return o.value;
  //   }))
  // }));
  maxValue = cfg.maxValue;
  
  // Base variables
  var allAxis = (data[0].map(function(i, j) { //Get the label of each axis
    return i.axis;
  }));
  var numberOfAxis = allAxis.length; //Get the number of axis
  var angleSlice = Math.PI * 2 / numberOfAxis; //Width of each slice (in radians)
  var outerRadius = Math.min(cfg.width / 2, cfg.height / 2) //Radius of the outermost circle
  /* Should also allow other formats */
  /* To refactor */
  var format = d3.format('.0%') //Format values as percentages
  /* To refactor -- end */

  // Scale for the radius
  var rScale = d3.scaleLinear()
    .range([0, outerRadius])
    .domain([0, maxValue]);

  
  /////////////////////////////////////////////////////////
	//////////// Create the container SVG and g /////////////
  /////////////////////////////////////////////////////////
  
  // Remove whaterver chart with the same id/class was present before
  d3.select(selector).select('svg').remove();

  // Initiate the radar chart SVG
  var svg = d3.select(selector).append('svg')
    .attr('width', cfg.width + cfg.margin.left + cfg.margin.right)
    .attr('height', cfg.height + cfg.margin.top + cfg.margin.bottom)
    .attr('class', 'radar-' + selector);
  
  // Append a g element
  var g = svg.append('g')
    .attr('transform', 'translate(' + (cfg.width/2 + cfg.margin.left) + ',' + (cfg.height/2 + cfg.margin.top) + ')');
  
  
  /////////////////////////////////////////////////////////
	////////// Glow filter for some extra pizzazz ///////////
  /////////////////////////////////////////////////////////
  
  // Filter for the outside glow
  if (cfg.glow) {
    var filter = g.append('defs').append('filter')
      .attr('class', 'glow');
    var feGaussianBlur = filter.append('feGaussianBlur')
      .attr('stdDeviation', '2.5')
      .attr('result', 'coloredBlur');
    var feMerge = filter.append('feMerge');
    var feMergeNode_1 = feMerge.append('feMergeNode')
      .attr('in', 'coloredBlur');
    var feMergeNode_2 = feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');
  }


  /////////////////////////////////////////////////////////
	/////////////// Draw the Circular grid //////////////////
  /////////////////////////////////////////////////////////
  
  // Wrapper for the grid & axes
  var axisGrid = g.append('g').attr('class', 'axisWrapper');

  // Draw the background circles
  axisGrid.selectAll('.grid-circle')
    .data(d3.range(1,(cfg.levels + 1)).reverse())
    .enter()
    .append('circle')
    .attr('class', 'grid-circle')
    .attr('r', function(d) {
      return outerRadius / cfg.levels * d;
    })
    .style('fill', '#CDCDCD')
    .style('stroke', '#CDCDCD')
    .style('fill-opacity', cfg.opacityCircles)
    /* To refactor, glow not working in chrome */
    .style('filter', function() {
      if (cfg.glow) {
        return 'url(#glow)';
      }
    });

  // Add labels to the circles
  axisGrid.selectAll('.axisLabel')
    .data(d3.range(1, cfg.levels + 1).reverse())
    .enter()
    .append('text')
    .attr('class', 'axisLabel')
    .attr('x', 4)
    .attr('y', function(d) {
      return -d * outerRadius / cfg.levels;
    })
    .attr('dy', '0.4rem')
    .style('font-size', '10px')
    .attr('fill', '#737373')
    .text(function(d) {
      return format(maxValue * d / cfg.levels);
    });

  
  /////////////////////////////////////////////////////////
	//////////////////// Draw the axes //////////////////////
  /////////////////////////////////////////////////////////
  
  // Draw the axes (lines radiating from the center)
  var axis = axisGrid.selectAll('.axis')
    .data(allAxis)
    .enter()
    .append('g')
    .attr('class', '.axis');

  // Append the lines to the groups
  axis.append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', function(d, i) {
      return rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr('y2', function(d, i) {
      return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2);
    })
    .attr('class', 'line')
    .style('stroke', 'white')
    .style('stroke-width', '2px');
  
  // Add labels to the axis
  

}