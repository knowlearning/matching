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
      :connections="runstate.studentConnections"
      :textIsPlayable="item.textIsPlayable"
      @updateConnections="runstate.studentConnections = $event"
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
  import translateScopeId from '../../helpers/translateScopeId.js'
  import { useStore } from 'vuex'

  const store = useStore()
  function t(slug) { return store.getters.t(slug) }

  const props = defineProps(['id'])
  
  const language = store.getters.language()
  const item = await translateScopeId(props.id, language)
  const { auth: { user } } = await Agent.environment()

  const runstate = reactive(await Agent.state(`runstate-${props.id}`))
  if (!runstate.studentConnections) runstate.studentConnections = [] // each connection is [ nodeId, nodeId ]

  setTimeout(() => {
    runstate.xapi = {
      actor: props.id,
      verb: 'initialized',
      object: props.id,
      extensions: { language }
    }
  })

  async function handleSubmit() {
    const success = isCorrect()
    const message = getMessage(success)
    if (Agent.embedded) {
      runstate.xapi = {
        actor: user,
        authority: user,
        verb: 'submitted',
        object: props.id,
        result: { success },
        extensions: { message }
      }
    }

    const notInWrapper = (await Agent.environment()).context.length === 1
    if (notInWrapper) await itemFeedbackSwal(t, success, message)
  }

  function isCorrect() {
    const every = runstate.studentConnections.every(c1 => item.answerConnections.some(c2 => sameConnection(c1, c2)))
    const only = item.answerConnections.every(c1 => runstate.studentConnections.some(c2 => sameConnection(c1, c2)))
    return every && only
  }
  function getMessage(isCorrect) {
    if (isCorrect && item.feedback?.correct) return item.feedback.correct 
    else if (!isCorrect && item.feedback?.incorrect) return item.feedback.incorrect
    else return undefined
  }
</script>

<style scoped>
  .player { padding: 0 8px; }
</style>