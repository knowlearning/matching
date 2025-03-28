<template>
    <div class="match-svg">
        <svg
            :viewBox="`0 0 ${width} ${height}`"
            :class="{
                pointer: !!hoverNode
            }"
            @mousemove.prevent="handleMove"
            @touchmove.prevent="handleMove"
            @mousedown="handleDown"
            @touchstart="handleDown"
            @mouseup="handleUp"
            @touchend="handleUp"
            :style="{
                'max-width': '100%',
                width: `${width}px`,
                height: `${height}px`,
            }"
        >
            <!-- RECTS / IMAGES -->
            <svg 
                v-for="c,i in [ ...fromChoices, ...toChoices ]"
                :key="`choice-${i}`"
                :x="xPosForJoinedChoiceIndex(i)"
                :y="yPosForJoinedChoiceIndex(i)"
                :width="cardWidth"
                :height="cardHeight"
            >
                <component
                    :is="getComponentForChoice(c)"
                    :key="`node=${c.nodeId}`"
                    v-bind="c"
                    :editMode="editMode"
                    :playable="textIsPlayable"
                    width="100%"
                    height="100%"
                    :pointer-events="editMode ? 'none' : 'all'"
                />
                <ChoiceEditOverlay v-if="editMode"
                    height="100%"
                    width="100%"
                    @edit="$emit('editChoice', c.nodeId)"
                    @remove="$emit('removeChoice', c.nodeId)"
                    @move="$emit('move', c.nodeId, $event)"
                />

            </svg>

            <!-- NODES -->
            <circle
                v-for="n in nodes"
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
                stroke="black"
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
    </div>
</template>

<script>
import ImageSvgChoice from './ImageSvgChoice.vue'
import TextChoice from './TextChoice.vue'
import AudioChoice from './AudioChoice.vue'
import ChoiceEditOverlay from './ChoiceEditOverlay.vue'
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
} from '../../../helpers/mathHelpers.js'

const copy = x => JSON.parse(JSON.stringify(x))

export default {
    name: 'match-svg',
    components: { ImageSvgChoice, TextChoice, ChoiceEditOverlay },
    props: {
        editMode: {
            type: Boolean,
            required: false,
            default: false
        },
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
        },
        textIsPlayable: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data() {
        return {
            workingLine: null, // { toPos, fromPos } 
            workingStartNode: null, 
            hoverNode: null,
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
        t(slug) {
            return this.$store.getters.t(slug)
        },
        getComponentForChoice(choice) {
            if (choice.type === 'image') return ImageSvgChoice
            else if (choice.type === 'text') return TextChoice
            else if (choice.type === 'audio') return AudioChoice
            else return undefined
        },
        handleDown(e) {
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
                this.removeConnectionByIndex(closeSegmentIndex)
            }
        },
        removeConnectionByIndex(i) {
            let newConnections = copy(this.connections)
            newConnections.splice(i,1)
            this.$emit('updateConnections', newConnections)
        },
        handleUp(e) {
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
        handleMove(e) {
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
        xPosForJoinedChoiceIndex(i) {
            return (i<this.fromChoices.length) ?
                this.padding :  this.width - this.cardWidth - this.padding
        },
        yPosForJoinedChoiceIndex(i) {
            if (i >= this.fromChoices.length) i = i - this.fromChoices.length
            return i*this.cardHeight + (i+1)*this.padding
            
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

.image-choice,
.text-choice {
    width: 100%;
    height: 100%;
}
.image-frame {
    width: 100%; 
    height: 100%; 
    fill: transparent; 
}


</style>