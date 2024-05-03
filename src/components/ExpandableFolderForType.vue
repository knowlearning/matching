<template>
	<div class="expandable-folder-for-type">
      <div
        class="select-type-row"
        @click="$emit('toggle')"
      >
        <h4>
          <i :class="{
            'fas' : true,
            'fa-folder-plus' : !show,
            'fa-folder-open' : show
          }"
        />
          <span>{{ displayName }}</span>
        </h4>
      </div>
      <div v-if="show"
      class="item-list"
      v-bind:style="{ maxHeight: '200px', overflowY: 'auto' }"
      >
      <div
        v-for="(itemId, index) in items"
        :key="`item-${itemId}`"
        :class="{
          'item-choice' : true,
          'active' : itemId === active
        }"
        @click.stop="$emit('active', itemId)"
        draggable="true"
        style="cursor: grab;"
        @dragstart="$event.dataTransfer.setData('text', itemId)"
      >
        <Suspense>
          <div class="item-content">
            <span>{{ index + 1}}) </span>
            <ItemName :id="itemId" />
          </div>
        </Suspense>
        <button
          class="remove-symbol"
          @click.stop="$emit('remove', itemId)"
        >
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ItemName from './ItemName.vue'
export default {
	name: 'expandable-folder-for-type',
  components: { ItemName },
	props: {
    active: {
      type: [ String, null ],
      required: true
    },
		displayName: {
			type: String,
			required: true
		},
		items: {
			type: Array,
			required: true
		},
		show: {
			type: Boolean,
			required: true
		}
	}
}
</script>

<style scoped>
.select-type-row {
  user-select: none;
  cursor: pointer;
  margin: 16px 0 0 0;
}
.select-type-row h4 {
  margin: 0;
}
.select-type-row i {
  margin-right: 8px;
}
.item-choice {
  font-family: monospace;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}
.item-choice:hover {
  background: rgba(255,255,0,0.1);
}
.item-choice.active {
  background: rgba(255,255,0,0.33);
}
.item-choice .remove-symbol {
  font-size: 0.9rem;
  font-weight: bolder;
  padding-right: 4px;
  color: #aaa;
  opacity: 0.4;
  cursor: pointer;

}
.item-choice .remove-symbol:hover {
  opacity: 0.7;
  color: red;
}
</style>