<script setup>
  import { reactive } from 'vue'
  const width = 700
  const height = 800
  const cardHeight = 150
  const cardWidth = 200
  const padding = 10

  const data = reactive({
    fromChoices: [ 'a', 'b', 'c' ],
    workingLine: null, // { to, from }
    toChoices: [ 1 , 2 , 3, 4],
    connections: [ [0,0], [2,0] ],
  })


  function handleMousedown(e) {
    const pos = getSvgCoordinatesFromEvent(e)
    data.workingLine = {
      from: pos,
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
  <h1>Match Y'all</h1>
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
    <g
      v-for="c,i in data.fromChoices"
      :key="`from-choice-{i}`"
      :transform="`translate(0, ${i*(cardHeight+padding)})`"
    >
      <rect
        class="from-choice"
        :width="cardWidth"
        :height="cardHeight"
      />
      <circle :cx="cardWidth" :cy="cardHeight/2" :r="width/140" />
    </g>

    <g
      v-for="c,i in data.toChoices"
      :key="`to-choice-{i}`"
      :transform="`translate(${width-cardWidth}, ${i*(cardHeight+padding)})`"
    >
      <rect
        class="to-choice"
        :width="cardWidth"
        :height="cardHeight"
      />
      <circle cx="0" :cy="cardHeight/2" :r="width/140" />
    </g>

    <!-- Fixed Connection -->
    <line
      v-for="[from, to],i in data.connections"
      :key="`connection-${i}`"
      :x1="cardWidth"
      :y1="cardHeight/2 + from*(padding+cardHeight)"
      :x2="width - cardWidth"
      :y2="cardHeight/2 + to*(padding+cardHeight)"
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
  background: pink;
}
.from-choice, .to-choice {
  fill: chartreuse;
}
svg {
  background: yellow;
}
</style>