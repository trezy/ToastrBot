export default (template, options) => {
  const regex = new RegExp(`{{(${Object.keys(options).join('|')})}}`, 'gi')

  return template.replace(regex, (match, replaceKey) => (options[replaceKey] || match))
}
