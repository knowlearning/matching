<template>
    <div
        class="markdown"
        v-html="sanitizedMarkdown"
    ></div>
</template>

<script setup>
import { ref, watch, onUpdated } from 'vue'

import { marked } from 'marked'
import DOMPurify from 'dompurify'
import renderLatex from './renderLatex.js'
import replaceUUIDs from './replaceUUIDs.js'


const props = defineProps({
    userInput: {
        required: true,
        type: String
    }
})

const sanitizedMarkdown = ref('')

let uuidsForIframes = {}
const embeddingsToHookUp = []
const embeddings = []

watch(
    () => props.userInput,
    async val => {
        uuidsForIframes = {}
        while (embeddings.length) embeddings.shift().remove()

        const withIDsReplaced = await replaceUUIDs(val, replacer)
        const katex = renderLatex(withIDsReplaced)
        const md = marked.parse(katex)
        sanitizedMarkdown.value = insertEmbedIframes(DOMPurify.sanitize(md))
    },
    { immediate: true }
)

function insertEmbedIframes(markdown) {
    let md = markdown
    const scope = Math.random().toString(32).substring(2)
    Object.keys(uuidsForIframes).forEach(id => {
        const scopedId = scope + id
        md = md.replaceAll(id, `<iframe class="${scopedId}" style="width:100%; height:100%; border: none;"></iframe>`)
        embeddingsToHookUp.push({
            className: scopedId,
            id
        })
    })
    return md
}

onUpdated(() => {
    while (embeddingsToHookUp.length) {
        const { className, id } = embeddingsToHookUp.shift()
        document
            .getElementsByClassName(className)
            .forEach(iframe => {
                const embedding = Agent.embed({ id, mode: 'bla', namespace: undefined }, iframe)
                embedding.on('environment', e => Agent.environment(e)) // not sure if necessary, but gives a hook to modify child environment if desired
                embeddings.push(embedding)
            })
    }
})

async function replacer(uuid, optionsStr) {
    let options = {}
    try { options = JSON.parse(optionsStr) }
    catch (e) { }

    try {
        // metadata call is cached, fine to fetch on each keystroke
        const { active_type } = await Agent.metadata(uuid)
        let typeName = null
        const supportedTypePrefixes = [ 'audio', 'image', 'video' ]
        supportedTypePrefixes.forEach(type => {
            if (active_type.startsWith(type)) typeName = type
        })

        if (!typeName) {
          uuidsForIframes[uuid] = true
          return uuid // return uuid if type match not found
        }

        // TODO: make a dictionary of uuids to url to prevent refecthing on each keystroke

        const res = await Promise.race([
            Agent.download(uuid),
            new Promise((resolve, reject) => {
                setTimeout(() => reject(new Error('Timeout')), 2000);
            })
        ])
        const height = options.height ? options.height + 'px' : 'auto'
        const width = options.width ? options.width + 'px' : 'auto'
        if (typeName === 'image') {
            return `\n\n<img height="${height};" width="${width};" src="${res?.url}">`
        } else if (typeName === 'audio' || typeName === 'video') {
            return `\n\n<${typeName} height="${height};" width="${width};" controls controlsList="nodownload noplaybackrate">\n<source src="${res?.url}" type="${active_type}">\nYour browser does not support the ${typeName} element.\n</${typeName}>`
        }
    } catch {
        console.warn('catching!!')
    }
}

</script>

<style>
/*  namespace: scoped won't reach into marked and katex stuff  */
.markdown {
    text-align: initial;
    list-style-position: inside;
}
.markdown h1,
.markdown h2,
.markdown h3,
.markdown h4,
.markdown h5,
.markdown h6
{
    margin: 0.65em 0 0.1em 0;
}
.markdown ul,
.markdown li,
.markdown ol {
    padding: revert;
}
</style>