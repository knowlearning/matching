import th from './th.js'

export default function translate(sourceString, language) {
  if (language === 'th' && th[sourceString.toLowerCase()]) {
    return th[sourceString.toLowerCase()]
  } else {
    return sourceString
  }
}