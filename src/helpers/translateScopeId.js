export default async function translateScopeId(id, lang) {
    // const TRANSLATION_DOMAIN = 'f74e9cb3-2b53-4c85-9b0c-f1d61b032b3f.localhost:5889'
    const TRANSLATION_DOMAIN = 'translations.pilaproject.org'
    const translations =
        await Agent.query('translate-item', [id, [lang]], TRANSLATION_DOMAIN)
        .catch(err => {
            console.log(err)
            return []
        })

    console.log('found translations')
    console.log(translations)

    // fields will be progressively overwritten, when possible, the returned
    let translated = JSON.parse(JSON.stringify(await Agent.state(id)))

    console.log('expected translation paths', translated.translations)

    translations
        .forEach(({ path, value }) => {
            let ref = translated
            const p = path.slice(1)
            while (p.length > 1 && ref[p[0]]) ref = ref[p.shift()]
            if (p.length === 1) ref[p[0]] = value
        })

    return translated
}