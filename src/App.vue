<script setup>
  import { reactive, computed } from 'vue'
  import Player from './components/Player.vue'
  import Customizer from './components/Customizer.vue'
  import MatchingItemName from './components/MatchingItemName.vue'
  import newItemSchema from './helpers/McdonaldsItemForReference.js'
  const copy = x => JSON.parse(JSON.stringify(x))

  const data = reactive({
    mode: 'player', // or 'customizer'
    content: null,
    active: null
  })

  Agent
    .state('content')
    .then(state => data.content = state)

  async function addNew() {
    const id = await Agent.create({
      active_type: 'application/json;type=matching',
      active: copy(newItemSchema)
    })
    data.content[id] = { added: Date.now() }
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
      <div v-if="data.content">
        <div
          v-for="item, itemId in data.content"
          :key="itemId"
          :class="{
            'item-choice' : true,
            'active' : itemId === data.active
          }"
          @click="data.active = itemId"
        >
          <Suspense>
            <MatchingItemName :id="itemId" />
          </Suspense>
        </div>
      </div>
      <div v-else>Loading Content...</div>
    </div>

    <div class="right-col">
      <Suspense
        v-if="data.active && data.mode === 'player'"
        :key="data.active"
      >
        <Player
          :id="data.active"
        />
      </Suspense>
      <Suspense>
        <Customizer
          v-if="data.active && data.mode === 'customizer'"
          :key="data.active"
          :id="data.active"
        />
      </Suspense>

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