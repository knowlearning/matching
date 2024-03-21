<script setup>
  import { reactive, computed } from 'vue'
  import PlayOrCustomizeByTypeSwitcher from './components/PlayOrCustomizeByTypeSwitcher.vue'
  import ItemName from './components/ItemName.vue'
  import { chooseTypeSwal, copyItemSwal } from './helpers/swallows.js'
  import questionTypes from './helpers/questionTypes.js'

  const TEST_CONTENT_TAG = 'd8bf5ec0-dfe1-11ee-bfb6-93dd9ff85ba9'

  const copy = x => JSON.parse(JSON.stringify(x))

  const data = reactive({
    mode: 'player', // or 'customizer'
    content: null,
    active: null,
    tags: null
  })

  Agent
    .state('content')
    .then(state => data.content = state)
  Agent
    .state('tags')
    .then(state => {
      data.tags = state
      //  initialize tags we want to manage
      if (!data.tags[TEST_CONTENT_TAG]) {
        data.tags[TEST_CONTENT_TAG] = {}
      }
    })

  async function addNew() {      
    const { value: active_type } = await chooseTypeSwal()
    if (active_type) {
      createContent(
        active_type,
        copy(questionTypes[active_type].newItemSchema)
      )
    }
  }
  async function copyExisting() {
    const { value: idToCopy } = await copyItemSwal() // validates id and type 
    if (!idToCopy) return

    const { active_type } = await Agent.metadata(idToCopy)
    const stateToCopy = await Agent.state(idToCopy)
    createContent(active_type, copy(stateToCopy))
  }
  async function createContent(active_type, active) {
    const newItemId = await Agent.create({ active_type, active })
    // add new to content, set to active in customizer
    data.content[newItemId] = { added: Date.now() }
    data.active = newItemId
    data.mode = 'customizer'
    data.tags[TEST_CONTENT_TAG][newItemId] = true
  }
  function removeContent(id) {
    if (!confirm(`Are you sure you want remove item?`)) return
    if (data.active === id) data.active = null
    delete data.content[id]
    data.tags[TEST_CONTENT_TAG][id] = false
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
      <button class="new" @click="copyExisting()">+ Copy Existing</button>
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
            <ItemName :id="itemId" />
          </Suspense>
          <span
            class="remove-symbol"
            @click.stop="removeContent(itemId)"
          >&#x2715;</span>
        </div>
      </div>
      <div v-else>Loading Content...</div>
    </div>

    <div class="right-col" v-if="data.active && data.mode">
      <Suspense>
        <PlayOrCustomizeByTypeSwitcher
          :key="`${data.active}-${data.mode}`"
          :id="data.active"
          :mode="data.mode"
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.left-col .item-choice:hover {
  background: lightyellow;
}
.left-col .item-choice.active {
  background: yellow;
}
.left-col .item-choice .remove-symbol {
  font-size: 1rem;
  font-weight: bolder;
  padding-right: 4px;
  color: red;
  cursor: pointer ;
  opacity: 0.2;
}
.left-col .item-choice .remove-symbol:hover {
  opacity: 1;
}

.right-col {
    max-width: 600px;
    margin: 0 auto;
}

.audio-button {
    background: blue;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
  }

  .audio-button:hover {
    background: darkblue;
  }
</style>