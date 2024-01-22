<script setup>
  import { reactive } from 'vue'
  const width = 700
  const height = 800
  const cardHeight = 150
  const cardWidth = 200
  const padding = 10

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
      name: `from-node-${i}`,
      pos: {
        x: cardWidth,
        y: cardHeight/2 + i*(cardHeight + padding)
      }
    })
  }
  for (let i=0; i<toChoices; i++) {
    nodes.push({
      type: 'to',
      name: `to-node-${i}`,
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
    workingLine: null, // { to, from }
    connections: [ [0,4], [2,5] ],
  })


  function handleMousedown(e) {
    const pos = getSvgCoordinatesFromEvent(e)
    const closestNode = getClosestNode(pos)
    data.workingLine = {
      from: closestNode.pos,
      to: pos
    }
  }
  function handleMouseup(e) {
    data.workingLine = null
  }
  function handleMousemove(e) {
    if (data.workingLine) {
      data.workingLine.to = getSvgCoordinatesFromEvent(e)
    }
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
    class="main-wrapper"
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
    />

    <!-- Fixed Connection -->
    <line
      v-for="[from, to],i in data.connections"
      :key="`connection-${i}`"
      :x1="nodes[from].pos.x"
      :y1="nodes[from].pos.y"
      :x2="nodes[to].pos.x"
      :y2="nodes[to].pos.y"
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
</style>