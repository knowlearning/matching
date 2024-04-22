<template>
  <div class="main-wrapper">
    
    <Modal
      v-if="previewContent"
      @close="store.dispatch('previewContent', null)"
    >
      <template v-slot:body>
        <Suspense>
          <PlayOrCustomizeByTypeSwitcher
            :key="`preview-${previewContent}`"
            :id="previewContent"
            mode="player"
          />
        </Suspense>
      </template>
      <template v-slot:footer><div></div></template>
    </Modal>

    <div class="left-col">
      <div class="logo-line">
        <div class="logo-and-name">
          <img id="logo" src="./assets/pila.png" @click="toggleLanguage" >
          <h2>Pila {{ t('create') }}</h2>
        </div>
        <div class="button-area">
          <button @click="addNew">
            <i class="fas fa-plus" />
          </button>
          <button @click="copyExisting">
            <i class="fas fa-copy" />
          </button>
        </div>
      </div>
      <Suspense>
        <ContentBar v-if="data.content"
          :items="data.content"
          :active="data.active"
          @removeItem="removeItem"
          @active="data.active = (data.active === $event ? null : $event)"
        />
      </Suspense>
      <div v-if="!data.content">Loading...</div>

    </div>

    <div class="right-col">
      <div class="header">
        <button @click="logout">
          <span>{{ t('logout') }}</span>
          <i class="fas fa-sign-out-alt" />
        </button>
        <img class="user-avatar" :src="data.userAvatarPath" >
      </div>
      <div class="right-inner" v-if="data.active">
        <Suspense>
          <PlayOrCustomizeByTypeSwitcher
            :key="`customize-${data.active}`"
            :id="data.active"
            mode="customizer"
          />
        </Suspense>
      </div>
      <div class="right-inner" v-else>
        <Welcome @addNew="addNew" @copy="copyExisting" />
      </div>
    </div>

  </div>
</template>

<script setup>
  import { reactive, computed } from 'vue'
  import Modal from './components/Modal.vue'
  import ContentBar from './components/ContentBar.vue'
  import Welcome from './components/Welcome.vue'
  import PlayOrCustomizeByTypeSwitcher from './components/PlayOrCustomizeByTypeSwitcher.vue'
  import { chooseTypeSwal, copyItemSwal, areYouSureSwal } from './helpers/swallows.js'
  import questionTypes from './helpers/questionTypes.js'
  import { useStore } from 'vuex'
  const store = useStore()
  const t = slug => store.getters.t(slug)

  const copy = x => JSON.parse(JSON.stringify(x))
  const MY_CONTENT_TAG = '8e6cb070-ec84-11ee-825b-edbc0a87ecf3'

  const userImagePath = reactive(null)
  const data = reactive({
    content: null,
    active: null,
    tags: null,
    userAvatarPath: null
  })

  async function fetchMyContentAndUserInfo() {
    const { auth: { user, info: { picture } } } = await Agent.environment()
    data.userAvatarPath = picture
    data.content = (await Agent.query(
      'taggings-for-tag',
      [ user, MY_CONTENT_TAG ],
      'tags.knowlearning.systems'
    )).map(obj => obj.target)
  }
  fetchMyContentAndUserInfo()

  Agent
    .state('tags')
    .then(state => {
      data.tags = state
      if (!data.tags[MY_CONTENT_TAG]) {
        data.tags[MY_CONTENT_TAG] = { value: true }
      }
    })

  const previewContent = computed(() => store.getters.previewContent())

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
  function toggleLanguage(e) {
    if (e.shiftKey && e.offsetX < 10 && e.offsetY < 10) {
      const lang = store.getters.language()
      const newLang = (lang === 'en' ? 'th' : 'en')
      store.dispatch('language', newLang)
    }
  }
  function logout() {
    Agent.logout()
  }
</script>

<style scoped>
.main-wrapper {
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: 330px 1fr;
}
.left-col, .right-col {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.left-col {
  padding: 0 12px;
  text-align: left;
  border-right: 1px solid slategray;
}
.left-col .logo-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 4px 0;
}
.left-col .logo-and-name {
  display: flex;
  align-items: center;
}
.left-col .logo-line h2 {
  margin: 0 0 0 12px;
}
.left-col .logo-line #logo {
  width: 30px;
  height: 30px;
}
.left-col .logo-line button {
  font-size: 0.8rem;
}
.left-col .logo-line button:hover {
  background: #eee;
}
.right-col {
    width: 100%;
    flex-grow: 1;
}
.right-col .header {
  justify-content: flex-end;
  align-items: center;
  display: flex;
  background: rgb(43,46,211);
}
.right-col .header button {
  font-size: 0.7rem;
}
.right-col .header button i {
  padding-left: 10px;
}
.right-col .header img.user-avatar {
  border-radius: 1000px;
  width: 38px;
  padding: 6px;
}
</style>