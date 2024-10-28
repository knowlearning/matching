<template>
  <div class="player">
    <div
      v-if="item?.instructions"
      class="instructions"
    >
      <span class="instructions-prefix">{{ t('instructions') }}:</span>
      {{ item.instructions }}
    </div>
    <MatchSvg
      :toChoices="item.toChoices"
      :fromChoices="item.fromChoices"
      :connections="data.studentConnections"
      :textIsPlayable="item.textIsPlayable"
      @updateConnections="data.studentConnections = $event"
    />
    <v-btn
      color="green"
      @click="handleSubmit"
    >
      {{ t('submit') }}
    </v-btn>
  </div>
</template>

<script setup>
  import { reactive } from 'vue'
  import MatchSvg from './MatchSvg/index.vue'
  import { sameConnection } from '../../helpers/mathHelpers.js'
  import { itemFeedbackSwal } from '../../helpers/swallows.js'
  import { useStore } from 'vuex'
  


  const store = useStore()
  function t(slug) { return store.getters.t(slug) }

  const props = defineProps(['id'])
  let item = null
  item = await Agent.state(props.id)  

  const data = reactive({
    studentConnections: [], // each connection is [ nodeId, nodeId ]
  })

  async function handleSubmit() {
    if (Agent.embedded) {
      Agent.close({ success: isCorrect() })
    } else {
      await itemFeedbackSwal(t, isCorrect())
    }
  }

  function isCorrect() {
    const every = data.studentConnections.every(c1 => item.answerConnections.some(c2 => sameConnection(c1, c2)))
    const only = item.answerConnections.every(c1 => data.studentConnections.some(c2 => sameConnection(c1, c2)))
    return every && only
  }
</script>

<style scoped>
  .player { padding: 0 8px; }
</style>