<script setup>
  import { reactive, computed } from 'vue'
  import { v4 as uuid } from 'uuid'
  import Player from './components/Player.vue'
  import Customizer from './components/Customizer.vue'
  import newItemSchema from './helpers/newItemSchema.js'
  const copy = x => JSON.parse(JSON.stringify(x))

  const data = reactive({
    mode: 'player', // or 'customizer'
    content: {},
    active: null
  })

  function addNew() {
    const id = uuid()
    data.content[id] = copy(newItemSchema)
    data.active = id
  }



</script>

<template>
  <div class="main-wrapper">
    <div class="left-col">
      <div class="toggle-mode-wrapper">
        <div
          :class="data.mode==='player' ? 'active' : ''"
          @click="data.mode = 'player'"
        >Player</div>
        <div
          :class="data.mode==='customizer' ? 'active' : ''"
          @click="data.mode = 'customizer'"
        >Customizer</div>
      </div>

      <button class="new" @click="addNew">+ Add New</button>
      <div
        v-for="item, itemId in data.content"
        :key="itemId"
        :class="{
          'item-choice' : true,
          'active' : itemId === data.active
        }"
        @click="data.active = itemId"
      >
        {{ itemId }}
      </div>
    </div>

    <div class="right-col">
      <Player
        v-if="data.active && data.mode === 'player'"
        :id="data.active"
      />
      <Customizer
        v-if="data.active && data.mode === 'customizer'"
        :id="data.active"
      />

    </div>

  </div>

</template>

<style scoped>
.main-wrapper {
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: 300px 1fr;
}
.left-col, .right-col {
  display: flex;
  flex-direction: column;
  padding: 4px;
}
.left-col {
  text-align: left;
  border-right: 1px solid slategray;
}
.left-col .toggle-mode-wrapper {
  display: flex;
  justify-content: space-around;
}
.left-col .toggle-mode-wrapper div {
  cursor: pointer;
  font-weight: lighter;
}
.left-col .toggle-mode-wrapper div.active {
  font-weight: bolder;
}
.left-col button.new {
  background: green;
  color: white;
  opacity: 0.7;
}
.left-col button.new:hover {
  opacity: 1;
  transition: 100ms;
}
.left-col .item-choice {
  font-family: monospace;
  cursor: pointer;
}
.left-col .item-choice:hover {
  background: lightyellow;
}
.left-col .item-choice.active {
  background: yellow;
}

.right-col {
  display: flex;
  justify-content: space-around;

}
</style>