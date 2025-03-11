<template>
  <div class="expandable-folder-for-type">
      <div class="select-type-row">
        <div @click="$emit('toggle')">
          <h4>
            <i :class="{
              'fas' : true,
              'fa-folder-plus' : !props.show,
              'fa-folder-open' : props.show
            }"
          />
            <span>{{ props.displayName }}</span>
          </h4>
        </div>
        <div>
          <v-btn
            icon="fa-solid fa-plus"
            size="x-small"
            class="mb-2 ml-2"
            @click="$emit('addNew')"
          />
        </div>
      </div>

      <div v-if="props.show" class="item-list">
        <div
          v-for="(itemId, index) in props.items"
          :key="`item-${itemId}`"
          :class="{
            'item-choice' : true,
            'active' : itemId === props.active
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

<script setup>
import ItemName from './ItemName.vue'

const emits = defineEmits([ 'addNew', 'toggle', 'remove', 'active' ])

const props = defineProps({
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
})

</script>

<style scoped>
.select-type-row {
  display: flex;
  justify-content: space-between;
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