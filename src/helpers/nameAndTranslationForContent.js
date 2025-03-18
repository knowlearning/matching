import { validate as isUUID } from 'uuid'
import translateScopeId from './translateScopeId.js'

const KAREL_TRANSLATION_DOMAIN = 'translate-karel-alpha.netlify.app'
const isBettyURL = url => url?.startsWith?.('https://bettysbrain.knowlearning.systems/')

export default async function displayTranslatedContent(
    content,
    lang
) {
    if (isBettyURL(content)) {
        const name = nameFromBettyURL(content)
        // LEGACY :: We were using the Karel Translation Domain to Translate Random UUIDs for Betty??
        const domain = KAREL_TRANSLATION_DOMAIN
        return isUUID(name) ? (await translateId(name, lang, domain)) : name
    } else { // content is task
        return translateNameFromTaskId(content, lang)
    }
}

async function nameFromBettyURL(url) {
    if (!isBettyURL(url)) {
        console.warn('non-betty url', url)
        return `betty url name not found: ${url}`
    }
    const bettyId = url.split('/')[4]
    if (!isUUID(bettyId)) {
        console.warn('unfound id in betty url', bettyId)
        return `betty url id not id ${bettyId}`
    }
    const { name } = await Agent.metadata(bettyId)
    if (!name) {
        console.warn('name from metadata not found for betty url, id', url, bettyId)
        return `betty md name not found ${bettyId}`
    }
    return name
}

async function translateNameFromTaskId (
    taskId,
    lang
) {
    const { name } = await Agent.state(taskId)
    return name
    // TODO: Audit and Turn Back On
    // if (!name) {
    //     console.warn(`task name not found for ${taskId}`)
    //     return `task name not found for ${taskId}`
    // } else if (isUUID(name)) { // we're in old translation system
    //     const domain = KAREL_TRANSLATION_DOMAIN
    //     return await translateId(name, lang, domain)
    // } else {
    //     const translatedItem = await translateScopeId(taskId, lang)
    //     return translatedItem.name
    // }
}

async function translateId(id, lang, domain) {
    // order of return preference is this:
    // - no translation needed, return source_string (breadcrumb)
    // - translation in lang found, return
    // - translation in lang NOT found, return fallback with warning if exists
    // - neither translation nor fallback, return something is wrong
    const {
        source_string: fallback,
        language: srcLanguage
    } = await Agent.state(id)
    if (lang === srcLanguage && fallback) return fallback 
    const translation = await attemptTranslation(id, lang, domain)
    if (translation) return translation // translation found
    if (fallback) { // no translation found, use fallback with warning
        console.warn(`translation for ${id} in ${lang} not found, using fallback`)
        return fallback 
    }
    console.warn(`neither translation nor fallback found for ${id}found`)
    return undefined
}

async function attemptTranslation(id, lang, domain) {
    const r = await Agent.query('translate', [ id, lang ], domain)
    return r?.[0]?.value
}