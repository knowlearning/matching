<script setup>
  import { reactive, computed } from 'vue'
  import { v4 as uuid } from 'uuid'
  import {
    pDistanceToSegment,
    nodesConnectable,
    nodesConnected,
    getClosestNode,
    getClosestNodeWithinTolerance,
    d,
    getSvgCoordinatesFromEvent,
    getClosestSegmentWitinToleranceIndex,
    sameConnection
  } from './mathHelpers.js'

  const width = 700
  const height = 500
  const cardHeight = 150
  const cardWidth = 200
  const padding = 10
  const tolerance = 30

  // construct nodes. we need them "raw" for event handling.
  // the positioning of nodes is a convention. For every 'from' 
  // choice we look at the conventioal placemnt of the rect, and put
  // the node on the middle of the right side.  for the 'to' choices,
  // middse of the left side

  const fromChoices = [
    // picure images
    { component: 'image', id: 'a3855dc0-b99b-11ee-94ca-d301122f8933' },
    { component: 'image', id: 'afdb2c30-b99b-11ee-94ca-d301122f8933' },
    { component: 'image', id: 'a63a1d80-b99b-11ee-94ca-d301122f8933' },
  ]
  const toChoices = [
    // text images
    { component: 'image', id: '53ddd360-b99b-11ee-94ca-d301122f8933' },
    { component: 'image', id: '690be240-b99b-11ee-94ca-d301122f8933' },
    { component: 'image', id: '6c4f2660-b99b-11ee-94ca-d301122f8933' },
  ]  

  let nodes = []
  for (let i=0; i<fromChoices.length; i++) {
    nodes.push({
      type: 'from',
      id: uuid(),
      pos: {
        x: cardWidth,
        y: cardHeight/2 + i*(cardHeight + padding)
      }
    })
  }
  for (let i=0; i<toChoices.length; i++) {
    nodes.push({
      type: 'to',
      id: uuid(),
      pos: {
        x: width - cardWidth,
        y: cardHeight/2 + i*(cardHeight + padding)
      }
    })
  }
  // TODO: answers from customizer!
  const answerConnections = [
    [ nodes[0].id, nodes[4].id ],
    [ nodes[1].id, nodes[3].id ],
    [ nodes[2].id, nodes[5].id ],
  ]

  const data = reactive({
    files: { },
    fromChoices,
    toChoices,
    nodes,
    workingStartNode: null,
    workingLine: null, // { to, from }
    connections: [ ], // each connection is [ nodeId, nodeId ]
    answerConnections,
    hoverNode: null,
    selectedConnectionIndex: null
  })


  getFiles([ ...toChoices, ...fromChoices].filter(choice => choice.id).map(choice => choice.id))

  function getFiles(ids) {
    ids.forEach(async id => {
        data.files[id] = { downloadUrl: null }
        data.files[id].downloadUrl = await Agent.download(id).url()
    })
  }

  const segments = computed(() => {
    return data.connections.map(([fromId, toId]) => ([ getNodeById(fromId).pos, getNodeById(toId).pos ]))
  })

  function isCorrect() {
    const every = data.connections.every(c1 => data.answerConnections.some(c2 => sameConnection(c1, c2)))
    const only = data.answerConnections.every(c1 => data.connections.some(c2 => sameConnection(c1, c2)))
    return every && only
  }

  function handleSubmit() {
    window.alert( isCorrect() ? 'woo' : 'boo' )
  }

  function handleMousedown(e) {
    const pos = getSvgCoordinatesFromEvent(e)
    const node = getClosestNodeWithinTolerance(pos, tolerance, data.nodes)
    const closeSegmentIndex = getClosestSegmentWitinToleranceIndex(e, tolerance, segments.value)
    if (node) {
      data.workingStartNode = node
      data.workingLine = {
        from: node.pos,
        to: pos
      }
    } else if (closeSegmentIndex !== null) {
      data.selectedConnectionIndex = closeSegmentIndex  
    } else { // closeSegmentIndex is null
      data.selectedConnectionIndex = null
    }
  }
  function removeConnectionByIndex(i) {
    data.connections.splice(i,1)
    data.selectedConnectionIndex = null
  }
  function handleMouseup(e) {
    if (!data.workingLine) return // ensure in "draw" mode

    const pos = getSvgCoordinatesFromEvent(e)
    const node = getClosestNodeWithinTolerance(pos, tolerance, data.nodes)
    // if node and node is distinct from start, snap to it
    if (node && nodesConnectable(node, data.workingStartNode, data.connections)) {
      data.connections.push([ node.id, data.workingStartNode.id ])
    }
    data.workingLine = null
    data.workingStartNode = null
  }
  function handleMousemove(e) {
    data.hoverNode = null
    const pos = getSvgCoordinatesFromEvent(e)
    const node = getClosestNodeWithinTolerance(pos, tolerance, data.nodes)

    if (data.workingLine) {
      if (node && data.workingStartNode && nodesConnectable(node, data.workingStartNode, data.connections)) { // if there's a target node
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
 
    <component class="from-choice"
      v-for="c,i in data.fromChoices"
      :key="`from-choice-{i}`"
      :is="c.component"
      :href="data.files[c.id]?.downloadUrl"
      :transform="`translate(0, ${i*(cardHeight+padding)})`"
      :width="cardWidth"
      :height="cardHeight"
    />

    <component class="to-choice"
      v-for="c,i in data.toChoices"
      :key="`to-choice-{i}`"
      :is="c.component"
      :href="data.files[c.id]?.downloadUrl"
      :transform="`translate(${width-cardWidth}, ${i*(cardHeight+padding)})`"
      :width="cardWidth"
      :height="cardHeight"
    >
      {{ c.textContent ? c.textContent : '' }}
    </component>

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
      v-for="[A, B],i in segments"
      :key="`connection-${i}`"
      :x1="A.x"
      :y1="A.y"
      :x2="B.x"
      :y2="B.y"
      :stroke="data.selectedConnectionIndex === i ? 'red' : 'black'"
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
  <button
    :disabled="data.selectedConnectionIndex === null"
    @click="removeConnectionByIndex(data.selectedConnectionIndex)"
  >
    Remove Connection
  </button>
  <button @click="handleSubmit">
    Submit
  </button>

</template>

<style>
.main-wrapper {
  position: relative;
}
.from-choice, .to-choice {
  fill: transparent;
}
svg {

}
svg.pointer:hover {
  cursor: pointer;
}
</style>