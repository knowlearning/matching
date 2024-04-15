<script setup>
  import { reactive, computed } from 'vue'
  import PlayOrCustomizeByTypeSwitcher from './components/PlayOrCustomizeByTypeSwitcher.vue'
  import ItemName from './components/ItemName.vue'
  import { chooseTypeSwal, copyItemSwal, areYouSureSwal } from './helpers/swallows.js'
  import questionTypes from './helpers/questionTypes.js'
  import { useStore } from 'vuex'
  const store = useStore()
  function t(slug) {
    return store.getters.t(slug)
  }

  const copy = x => JSON.parse(JSON.stringify(x))
  const MY_CONTENT_TAG = '8e6cb070-ec84-11ee-825b-edbc0a87ecf3'

  const data = reactive({
    mode: 'player', // or 'customizer'
    content: null,
    active: null,
    tags: null
  })

  async function fetchMyContent() {
    const { auth: { user } } = await Agent.environment()
    data.content = (await Agent.query(
      'taggings-for-tag',
      [ user, MY_CONTENT_TAG ],
      'tags.knowlearning.systems'
    )).map(obj => obj.target)
  }
  fetchMyContent()


  Agent
    .state('tags')
    .then(state => {
      data.tags = state
      if (!data.tags[MY_CONTENT_TAG]) {
        data.tags[MY_CONTENT_TAG] = { value: true }
      }
    })

  async function addNew() {      
    const { value: active_type, isConfirmed } = await chooseTypeSwal(t)
    if (!active_type || !isConfirmed) return

    // get demo question for active language
    const lang = store.getters.language()
    const itemToCopy = questionTypes[active_type].newItemSchemas[lang] || questionTypes[active_type].newItemSchemas['default']

    createContent(
      active_type,
      copy(itemToCopy)
    )

  }
  async function copyExisting() {
    const { value: idToCopy } = await copyItemSwal(t) // validates id and type 
    if (!idToCopy) return
    const { active_type } = await Agent.metadata(idToCopy)
    const stateToCopy = await Agent.state(idToCopy)
    createContent(active_type, copy(stateToCopy))
  }
  async function createContent(active_type, active) {
    const newItemId = await Agent.create({ active_type, active })
    data.content.push(newItemId)
    data.active = newItemId
    data.mode = 'customizer'
    data.tags[MY_CONTENT_TAG][newItemId] = { value: true }
  }
  async function removeContent(id) {
    const { isConfirmed } = await areYouSureSwal(t)
    if (!isConfirmed) return

    if (data.active === id) data.active = null
    data.content = data.content.filter(content => content !== id)
    data.tags[MY_CONTENT_TAG][id] = { value: null }
  }
  function handleDragStart(event, id) {
    event.dataTransfer.setData('text', id)
  }
</script>

<template>
  <div class="main-wrapper">
    <div class="left-col">

      <!-- TEMP FOR DISPLAY TODO::: REMOVE -->
      <div class="toggle-mode-wrapper" style="margin-bottom: 30px;">
        <div
          :class="store.getters.language() ==='en' ? 'active' : ''"
          @click="store.dispatch('language', 'en')"
        >English (อังกฤษ)</div>
        <div
          :class="store.getters.language() ==='th' ? 'active' : ''"
          @click="store.dispatch('language', 'th')"
        >ไทย (Thai)</div>
      </div>
      <!-- TODO::: END TEMP AREA TO REMOVE -->

      <div class="toggle-mode-wrapper">
        <div
          :class="data.mode==='player' ? 'active' : ''"
          @click="data.mode = 'player'"
        >{{ t('player' )}}</div>
        <div
          :class="data.mode==='customizer' ? 'active' : ''"
          @click="data.mode = 'customizer'"
        >{{ t('customizer' )}}</div>
      </div>

      <button class="new" @click="addNew">+ {{ t('add-new' )}}</button>
      <button class="new" @click="copyExisting()">+ {{ t('copy-existing') }}</button>
      <div v-if="data.content">
        <div
          v-for="itemId in data.content"
          :key="itemId"
          :class="{
            'item-choice' : true,
            'active' : itemId === data.active
          }"
          @click="data.active = itemId"
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
  height: 100%;
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
    width: 100%;
    flex-grow: 1;
}
</style>