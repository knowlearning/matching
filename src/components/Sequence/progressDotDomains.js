// Exact Agent.environment().domain values (the embedding PILA site, not the iframe).
// Only these domains use dots; all other domains keep the icons.
const progressDotDomains = new Set([
  'thailand.pilaproject.org',
  'app.pilaproject.org'
])

export default function usesProgressDots(domain) {
  return progressDotDomains.has(domain)
}
