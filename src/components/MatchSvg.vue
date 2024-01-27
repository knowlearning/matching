<template>
	<div class="match-svg">
		<svg
      :viewBox="`0 0 ${width} ${height}`"
      :class="{
        pointer: !!hoverNode
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
        v-for="c,i in fromChoices"
        :key="`from-choice-${i}`"
        :is="getComponentForChoice(c)"
        v-bind="c"
        :x="padding"
        :y="i*cardHeight + (i+1)*padding"
        :width="cardWidth"
        :height="cardHeight"
      />

      <component class="to-choice"
        v-for="c,i in toChoices"
        :key="`to-choice-${i}`"
        :is="getComponentForChoice(c)"
        v-bind="c"
        :x="width-cardWidth - padding"
        :y="i*cardHeight+ (i+1)*padding"
        :width="cardWidth"
        :height="cardHeight"
      />

      <!-- NODES -->
      <circle
        v-for="n,i in nodes"
        :key="`node-${n.id}`"
        :cx="n.pos.x"
        :cy="n.pos.y"
        :r="width/140"
        :fill="hoverNode?.id === n.id ? 'blue' : 'black' "
      />

      <!-- Fixed Connection -->
      <line
        v-for="[A, B],i in segments"
        :key="`connection-${i}`"
        :x1="A.x"
        :y1="A.y"
        :x2="B.x"
        :y2="B.y"
        :stroke="selectedConnectionIndex === i ? 'red' : 'black'"
        :stroke-width="width/220"
      />

      <!-- working connection -->
      <line v-if="workingLine?.from"
        :x1="workingLine.from.x"
        :y1="workingLine.from.y"
        :x2="workingLine.to.x"
        :y2="workingLine.to.y"
        stroke="grey"
        :stroke-width="width/220"
      />

    </svg>
	  <button class="remove"
			:disabled="selectedConnectionIndex === null"
			@click="removeConnectionByIndex(selectedConnectionIndex)"
		>
			Remove Connection
		</button>
	</div>
</template>

<script>
import ImageChoice from './ImageChoice.vue'
import TextChoice from './TextChoice.vue'
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
} from '../helpers/mathHelpers.js'

const copy = x => JSON.parse(JSON.stringify(x))

export default {
	name: 'match-svg',
	components: { ImageChoice, TextChoice },
	props: {
		cardHeight: {
			type: Number,
			required: false,
			default:  100
		},
		cardWidth: {
			type: Number,
			required: false,
			default:  140
		},
		padding: {
			type: Number,
			required: false,
			default:  8
		},
		width: {
			type: Number,
			required: false,
			default:  560
		},
		cardHeight: {
			type: Number,
			required: false,
			default:  100
		},
		tolerance: {
			type: Number,
			required: false,
			default:  40
		},
		toChoices: {
			type: Array,
			required: true
		},
		fromChoices: {
			type: Array,
			required: true
		},
		connections: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			workingLine: null, // { toPos, fromPos } 
			workingStartNode: null, 
			hoverNode: null,
    	selectedConnectionIndex: null
		}
	},
	computed: {
		l() {
			return Math.max(this.fromChoices.length, this.toChoices.length)
		},
		height() {
			return this.l*this.cardHeight + (this.l+1)*this.padding
		},
		segments() {
    	return this.connections.map(([fromId, toId]) => ([ this.getNodeById(fromId).pos, this.getNodeById(toId).pos ]))
		},
		nodes() {
			let nodes = []
			this.fromChoices.forEach((c,i) => {
	      nodes.push({
	      type: 'from',
		      id: c.nodeId,
		      pos: {
		        	x: this.padding + this.cardWidth,
		        	y: this.cardHeight/2 + i*(this.cardHeight + this.padding)
		      }
	    	})
  		})
			this.toChoices.forEach((c,i) => {
				nodes.push({
					type: 'to',
					id: c.nodeId,
					pos: {
						x: this.width - this.cardWidth - this.padding,
						y: this.cardHeight/2 + i*(this.cardHeight + this.padding)
					}
				})
			})
			return nodes
		}
	},

	methods: {
		getComponentForChoice(choice) {
			if (choice.type === 'image') return ImageChoice
 			else if (choice.type === 'text') return TextChoice
			else return undefined
  	},
		handleMousedown(e) {
			const pos = getSvgCoordinatesFromEvent(e)
			const node = getClosestNodeWithinTolerance(pos, this.tolerance, this.nodes)
			const closeSegmentIndex = getClosestSegmentWitinToleranceIndex(pos, this.tolerance, this.segments)
			if (node) {
				this.workingStartNode = node
				this.workingLine = {
					from: node.pos,
					to: pos
				}
			} else if (closeSegmentIndex !== null) {
				this.selectedConnectionIndex = closeSegmentIndex  
			} else { // closeSegmentIndex is null
				this.selectedConnectionIndex = null
			}
		},
		removeConnectionByIndex(i) {
			let newConnections = copy(this.connections)
			newConnections.splice(i,1)
			this.$emit('updateConnections', newConnections)
			this.selectedConnectionIndex = null
		},
		handleMouseup(e) {
			if (!this.workingLine) return // ensure in "draw" mode

			const pos = getSvgCoordinatesFromEvent(e)
			const node = getClosestNodeWithinTolerance(pos, this.tolerance, this.nodes)
			// if node and node is distinct from start, snap to it
			if (node && nodesConnectable(node, this.workingStartNode, this.connections)) {
				const newConnection = [ node.id, this.workingStartNode.id ]
				this.$emit('updateConnections', [ ...this.connections, newConnection ])
			}
			this.workingLine = null
			this.workingStartNode = null
		},
		handleMousemove(e) {
			this.hoverNode = null
			const pos = getSvgCoordinatesFromEvent(e)
			const node = getClosestNodeWithinTolerance(pos, this.tolerance, this.nodes)

			if (this.workingLine) {
				if (node && this.workingStartNode && nodesConnectable(node, this.workingStartNode, this.connections)) { // if there's a target node
					this.workingLine.to = node.pos
					this.hoverNode = node
				}
				else this.workingLine.to = pos
			} else if (node) { // preview mode
				this.hoverNode = node
			}
		},
		getNodeById(id) {
			return this.nodes.find(n => n.id === id)
		},

	}, // end methods
}

</script>


<style scoped>
.match-svg {
	display: flex;
	flex-direction: column;
	align-items: center;
}
svg {
  background: #eee;
  position: relative;
  border-radius: 8px;
}
svg.pointer:hover {
  cursor: pointer;
}
.from-choice, .to-choice {
  fill: transparent;
}
button.remove:not([disabled]) {
	color:white;
	background: red;
	opacity: 0.6;
}
button.remove:not([disabled]):hover {
	opacity: 0.8;
}
</style>