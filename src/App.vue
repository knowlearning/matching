<script setup>
  import { reactive } from 'vue'
  import { v4 as uuid } from 'uuid'

  const width = 700
  const height = 800
  const cardHeight = 150
  const cardWidth = 200
  const padding = 10
  const tolerance = 30

  // construct nodes. we need them "raw" for event handling.
  // the positioning of nodes is a convention. For every 'from' 
  // choice we look at the conventioal placemnt of the rect, and put
  // the node on the middle of the right side.  for the 'to' choices,
  // middse of the left side

  const fromChoices = 3
  const toChoices = 4
  let nodes = []
  for (let i=0; i<fromChoices; i++) {
    nodes.push({
      type: 'from',
      id: uuid(),
      pos: {
        x: cardWidth,
        y: cardHeight/2 + i*(cardHeight + padding)
      }
    })
  }
  for (let i=0; i<toChoices; i++) {
    nodes.push({
      type: 'to',
      id: uuid(),
      pos: {
        x: width - cardWidth,
        y: cardHeight/2 + i*(cardHeight + padding)
      }
    })
  }

  const data = reactive({
    fromChoices,
    toChoices,
    nodes,
    workingStartNode: null,
    workingLine: null, // { to, from }
    connections: [ ],
    hoverNode: null
  })

  function nodesConnectable(a,b) {
    // connectable if different types and not already connected
    if (a.type === b.type) return false
    if (nodesConnected(a,b)) return false
    return true
  }

  function nodesConnected(a,b) {
    // x and y are ids, not nodes
    return data.connections.some(([x,y]) => (a.id === x && b.id === y) || (a.id === y && b.id === x))
  }

  function handleMousedown(e) {
    const pos = getSvgCoordinatesFromEvent(e)
    const node = getClosestNodeWithinTolerance(pos, tolerance)
    if (!node) return
    data.workingStartNode = node
    data.workingLine = {
      from: node.pos,
      to: pos
    }
  }
  function handleMouseup(e) {
    if (!data.workingLine) return // ensure in "draw" mode

    const pos = getSvgCoordinatesFromEvent(e)
    const node = getClosestNodeWithinTolerance(pos, tolerance)
    // if node and node is distinct from start, snap to it
    if (node && nodesConnectable(node, data.workingStartNode)) {
      data.connections.push([ node.id, data.workingStartNode.id ])
    }
    data.workingLine = null
    data.workingStartNode = null
  }
  function handleMousemove(e) {
    const pos = getSvgCoordinatesFromEvent(e)
    const node = getClosestNodeWithinTolerance(pos, tolerance)

    if (data.workingLine) {
      if (node && data.workingStartNode && nodesConnectable(node, data.workingStartNode)) { // if there's a target node
        data.workingLine.to = node.pos
        data.hoverNode = node
      }
      else data.workingLine.to = pos
    } else if (node) { // preview mode
      // make node blue
      data.hoverNode = node
    }
  }

  function getNodeById(id) {
    return data.nodes.find(n => n.id === id)
  }

  function getClosestNode(pos, nodesArray = nodes) {
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

  function getClosestNodeWithinTolerance(pos, tolerance, nodesArray = nodes) {
    const closestNode = getClosestNode(pos, nodesArray)
    const withinTolerance = closestNode && d(pos, closestNode.pos) <= tolerance
    return withinTolerance ? closestNode : undefined
  }

  function d(pos1, pos2) {
    const dx = pos1.x - pos2.x
    const dy = pos1.y - pos2.y
    return Math.sqrt(dx*dx + dy*dy)
  }


  function getSvgCoordinatesFromEvent(e) {
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


</script>

<template>
  <svg
    :viewBox="`0 0 ${width} ${height}`"
    :class="{
      'main-wrapper': true,
      pointer: !!data.hoverNode
    }"
    @mousemove="handleMousemove"
    @mousedown="handleMousedown"
    @mouseup="handleMouseup"
    :style="{
      width: `${width}px`,
      height: `${height}px`,
    }"
  >

    <!-- RECTS / IMAGES -->
    <g
      v-for="n in data.fromChoices"
      :key="`from-choice-{n}`"
      :transform="`translate(0, ${(n-1)*(cardHeight+padding)})`"
    >
      <rect
        class="from-choice"
        :width="cardWidth"
        :height="cardHeight"
      />
      
    </g>

    <g
      v-for="n in data.toChoices"
      :key="`to-choice-{n}`"
      :transform="`translate(${width-cardWidth}, ${(n-1)*(cardHeight+padding)})`"
    >
      <rect
        class="to-choice"
        :width="cardWidth"
        :height="cardHeight"
      />
    </g>
    <!-- NODES -->
    <circle
      v-for="n,i in nodes"
      :key="`node-${i}`"
      :cx="n.pos.x"
      :cy="n.pos.y"
      :r="width/140"
      :fill="data?.hoverNode?.id === n.id ? 'blue' : 'black' "
    />

    <!-- Fixed Connection -->
    <line
      v-for="[idFrom, idTo],i in data.connections"
      :key="`connection-${i}`"
      :x1="getNodeById(idFrom).pos.x"
      :y1="getNodeById(idFrom).pos.y"
      :x2="getNodeById(idTo).pos.x"
      :y2="getNodeById(idTo).pos.y"
      stroke="black"
      :stroke-width="width/220"
    />

    <!-- working connection -->
    <line v-if="data.workingLine?.from"
      :x1="data.workingLine.from.x"
      :y1="data.workingLine.from.y"
      :x2="data.workingLine.to.x"
      :y2="data.workingLine.to.y"
      stroke="grey"
      :stroke-width="width/220"
    />

  </svg>

</template>

<style>
.main-wrapper {
  position: relative;
}
.from-choice, .to-choice {
  fill: grey;
}
svg {
  background: darkgrey;
}
svg.pointer:hover {
  cursor: pointer;
}
</style>