var pattern = d3.select('#pattern');
var bounds = getBoundsInPixels(pattern.node()); 
var startAt = [bounds.x, bounds.y];
var drawTime = 500;
var prevColor = null;
var headingInDegrees = 30;

function getBoundsInPixels(element) {
  return {
    x: 0,
    y: 0,
    width: element.clientWidth,
    height: element.clientHeight
  };
}

function nextColor() {
  var teal = '#99FFD6';
  var mint = '#80E8A1';
  var green = '#8CFF90';
  var matteGreen = '#98F56E';
  var yellow = '#D3FF80';
  var matteMint = '#74E899';
  var lightNeon = '#73FF77';

  var colors = [teal, mint, matteMint, green, matteGreen, yellow, lightNeon];

  var newColor = _.reject(colors, c => c === prevColor)[_.random(0, colors.length - 2)];

  prevColor = newColor;

  return newColor;
}

function findEnd(startAt, baseLength) {
  var baseLength = baseLength || 60;
  var lineLength = _.random(baseLength - 30, baseLength + 30);
  var angleVariance = _.random(-30, 30);

  var headingInRadians = (headingInDegrees + angleVariance) * (Math.PI/180);
  var endingX = startAt[0] + lineLength * Math.cos(headingInRadians);
  var endingY = startAt[1] + lineLength * Math.sin(headingInRadians);

  var bounds = getBoundsInPixels(d3.select('#pattern').node());

  if (bounds.height > 0 && bounds.width > 0
    && (endingX > bounds.width || endingY > bounds.height || endingX < bounds.x || endingY < bounds.y)) {
    headingInDegrees += _.random(150, 210);

    if (endingX > bounds.width || endingY > bounds.height) {
      endingX = Math.min(endingX, bounds.width);
      endingY = Math.min(endingY, bounds.height);
    }

    if (endingX < 0 || endingY < 0) {
      endingX = Math.max(endingX, 0);
      endingY = Math.max(endingY, 0);
    }
  }

  return [endingX, endingY];
}

function drawLine() {
  var endAt = findEnd(startAt);

  pattern.append('line')
    .style('stroke', nextColor())
    .style('stroke-width', 5)
    .attr('x1', startAt[0])
    .attr('y1', startAt[1])
    .attr('x2', startAt[0])
    .attr('y2', startAt[1])
    .transition()
    .ease(d3.easeSinOut)
    .duration(drawTime)
    .attr('x2', endAt[0])
    .attr('y2', endAt[1]);

  startAt = endAt;
}

function drawDriver() {
  setTimeout(function() {
    drawLine();
    drawDriver();
  }, drawTime);
}

drawDriver();
