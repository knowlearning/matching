<template>
  <div class="player">
    <h3 v-if="item?.instructions">{{ item.instructions }}</h3>
    <MatchSvg
      :toChoices="item.toChoices"
      :fromChoices="item.fromChoices"
      :connections="data.studentConnections"
      :textIsPlayable="item.textIsPlayable"
      @updateConnections="data.studentConnections = $event"
    />
    <button class="submit" @click="handleSubmit"> {{ t('next') }} </button>
  </div>
</template>

<script setup>
  import { reactive } from 'vue'
  import MatchSvg from './MatchSvg/index.vue'
  import { sameConnection } from '../../helpers/mathHelpers.js'
  import { useStore } from 'vuex'
  
  const store = useStore()
  function t(slug) { return store.getters.t(slug) }

  const props = defineProps(['id'])
  let item = null
  item = await Agent.state(props.id)  

  const data = reactive({
    studentConnections: [], // each connection is [ nodeId, nodeId ]
  })

  function handleSubmit() {
    if (Agent.embedded) Agent.close({ success: isCorrect() })
    else window.alert( isCorrect() ? 'woo' : 'boo' )
  }

  function isCorrect() {
    const every = data.studentConnections.every(c1 => item.answerConnections.some(c2 => sameConnection(c1, c2)))
    const only = item.answerConnections.every(c1 => data.studentConnections.some(c2 => sameConnection(c1, c2)))
    return every && only
  }
</script>
