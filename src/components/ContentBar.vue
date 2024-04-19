<template>
	<div>
        <div
          v-for="itemId in props.items"
          :key="itemId"
          :class="{
            'item-choice' : true,
            'active' : itemId === props.active
          }"
          @click="$emit('active', itemId)"
        >
          <Suspense>
            <ItemName :id="itemId"
              draggable="true"
              style="cursor: grab;"
              @dragstart="$event.dataTransfer.setData('text', itemId)"  
            />
          </Suspense>
          <span
            class="remove-symbol"
            @click.stop="$emit('removeContent', itemId)"
          >&#x2715;</span>
        </div>
      </div>
</template>

<script setup>
import ItemName from './ItemName.vue'

const props = defineProps({
	items: {
		type: Array,
		required: true
	},
	active: {
		type: [ String, null ],
		required: true
	}
})

</script>

<style scoped>
.item-choice {
  font-family: monospace;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item-choice:hover {
  background: lightyellow;
}
.item-choice.active {
  background: yellow;
}
.item-choice .remove-symbol {
  font-size: 1rem;
  font-weight: bolder;
  padding-right: 4px;
  color: red;
  cursor: pointer ;
  opacity: 0.2;
}
.item-choice .remove-symbol:hover {
  opacity: 1;
}

</style>