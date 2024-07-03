<template>
    <div
        class="markdown"
        v-html="sanitizedMarkdown"
        style="
            text-align: initial;
            list-style-position: inside;
        "
    ></div>
</template>

<script setup>
import { ref, watch } from 'vue'

import { marked } from 'marked'
import DOMPurify from 'DOMPurify'
import renderLatex from './renderLatex.js'
import replaceUUIDs from './replaceUUIDs.js'


const props = defineProps({
    userInput: {
        required: true,
        type: String
    }
})

const sanitizedMarkdown = ref('')

watch(
    () => props.userInput,
    async val => {
        const withIDsReplaced = await replaceUUIDs(val, replacer)
        const katex = renderLatex(withIDsReplaced)
        const md = marked.parse(katex)
        sanitizedMarkdown.value = DOMPurify.sanitize(md)
    },
    { immediate: true }
)

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
        if (!typeName) return uuid // return uuid if type match not found

        // TODO: make a dictionary of uuids to url to prevent refecthing on each keystroke

        const res = await Promise.race([
            Agent.download(uuid),
            new Promise((resolve, reject) => {
                setTimeout(() => reject(new Error('Timeout')), 2000);
            })
        ])
        if (typeName === 'image') {
            const height = options.height ? options.height + 'px' : '100px'
            const width = options.width ? options.width + 'px' : '100px'
            return `\n\n<img height="${height};" width="${width};" src="${res?.url}">`
        } else if (typeName === 'audio' || typeName === 'video') {
            const height = options.height || '225px'
            const width = options.width || '300px'
            return `\n\n<${typeName} height="${height};" width="${width};" controls controlsList="nodownload noplaybackrate">\n<source src="${res?.url}" type="${active_type}">\nYour browser does not support the ${typeName} element.\n</${typeName}>`
        }
    } catch {
        console.warn('catching!!')
    }
}

</script>