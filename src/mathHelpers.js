export function pDistanceToSegment([x,y], [x1, y1], [x2, y2]) {

    var A = x - x1;
    var B = y - y1;
    var C = x2 - x1;
    var D = y2 - y1;

    var dot = A * C + B * D;
    var len_sq = C * C + D * D;
    var param = -1;
    if (len_sq != 0) //in case of 0 length line
        param = dot / len_sq;

    var xx, yy;

    if (param < 0) {
        xx = x1;
        yy = y1;
    }
    else if (param > 1) {
        xx = x2;
        yy = y2;
    }
    else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    var dx = x - xx;
    var dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
}

export function nodesConnectable(a,b, connections) {
	// connectable if different types and not already connected
	if (a.type === b.type) return false
	if (nodesConnected(a,b, connections)) return false
	return true
}

export function nodesConnected(a,b, connections) {
	// x and y are ids, not nodes
	return connections.some(([x,y]) => (a.id === x && b.id === y) || (a.id === y && b.id === x))
}

export function sameConnection([A,B], [C,D]) {
  return (A === C && B === D) || (A === D && B === C)
}

export function getClosestNode(pos, nodesArray) {
  if (!nodesArray.length) return undefined
  let closestDistance = Infinity
  return nodesArray.reduce((acc,node) => {
    const dist = d(pos, node.pos)
    if (dist < closestDistance) {
      closestDistance = dist
      return node
    } else {
      return acc
    }
  }, nodesArray[0])
}

export function getClosestNodeWithinTolerance(pos, tolerance, nodesArray) {
  const closestNode = getClosestNode(pos, nodesArray)
  const withinTolerance = closestNode && d(pos, closestNode.pos) <= tolerance
  return withinTolerance ? closestNode : undefined
}

export function d(pos1, pos2) {
  const dx = pos1.x - pos2.x
  const dy = pos1.y - pos2.y
  return Math.sqrt(dx*dx + dy*dy)
}

export function getSvgCoordinatesFromEvent(e) {
  // Get the target SVG element
  var svgElement = e.target.ownerSVGElement || e.target

  // Create an SVGPoint representing the pointer coordinates
  var point = svgElement.createSVGPoint();
  point.x = e.clientX;
  point.y = e.clientY;

  // Apply the transformation from screen coordinates to SVG coordinates
  var svgPoint = point.matrixTransform(svgElement.getScreenCTM().inverse());

  // Return the SVG coordinates
  return { x: svgPoint.x, y: svgPoint.y };
}

export function getClosestSegmentWitinToleranceIndex(e, tolerance, segments) {
  const pos = getSvgCoordinatesFromEvent(e)
  let closestDistance = Infinity
  return segments.reduce((acc,[A,B], i) => {
    const dist = pDistanceToSegment([pos.x,pos.y], [A.x, A.y], [B.x, B.y])
    if (dist < closestDistance && dist < tolerance) {
      closestDistance = dist
      return i
    } else {
      return acc
    }
  }, null)
}