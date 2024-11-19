import katex from 'katex'

export default function renderLatex(content) {
    const latexPattern = /\$([^$]*?)\$/g;

    return content.replace(latexPattern, (match, p1, p2) => {
        const latex = p1 || p2;
        try {
            return katex.renderToString(latex, {
                throwOnError: false,
            })
        } catch (e) {
            return match
        }
    })
}