export default async function traverseAndReplaceUUIDsAsync(str, asyncCallback) {
  const regex = /([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})(\s*\{[^\}]+\})?/g;
  const matches = [ ...str.matchAll(regex) ]
  // matches are of form: [
  //   "550e8400-e29b-41d4-a716-446655440000{ myKey: 42 }",
  //   '550e8400-e29b-41d4-a716-446655440000',
  //   "{ myKey: 42 }"
  // ]

  const promiseArray = matches.map(m => {
    const [ _, uuid, options ] = m
    return asyncCallback(uuid, options)
  })
  const replacements = await Promise.all(promiseArray)
  // m[0] is thefull uuid plus options string to be replaced
  matches.forEach((m,i) => str = str.replace(m[0], replacements[i]) )
  return str
}