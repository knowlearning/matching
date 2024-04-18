<template>
  <div class="main-wrapper">
    <Modal
      v-if="store.getters.previewContent() && data.active"
      @close="store.dispatch('previewContent', null)"
    >
      <template v-slot:body>
        <Suspense>
          <PlayOrCustomizeByTypeSwitcher
            :key="`preview-${data.active}`"
            :id="data.active"
            mode="player"
          />
        </Suspense>
      </template>
    </Modal>

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

      <ContentBar v-if="data.content"
        :items="data.content"
        :active="data.active"
        @removeItem="removeItem"
        @active="data.active = (data.active === $event ? null : $event)"
      />
      <div v-else>Loading...</div>

    </div>

    <div class="right-col" v-if="data.active">
      <Suspense>
        <PlayOrCustomizeByTypeSwitcher
          :key="`customize-${data.active}`"
          :id="data.active"
          mode="customizer"
        />
      </Suspense>
    </div>
    <div class="right-col" v-else>
      <Welcome @addNew="addNew" @copy="copyExisting" />
    </div>

  </div>
</template>

<script setup>
  import { reactive, computed } from 'vue'
  import Modal from './components/Modal.vue'
  import ContentBar from './components/ContentBar.vue'
  import Welcome from './components/Welcome.vue'
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
    data.tags[MY_CONTENT_TAG][newItemId] = { value: true }
  }
  async function removeItem(id) {
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
.right-col {
    width: 100%;
    flex-grow: 1;
}
</style>