class Page {
  /***************************************************************************\
    Private Properties
  \***************************************************************************/


  // regex
  #ifMacroRegex = /<{2}if .*?>{2}[\S\s]*?<{2}\/if>{2}/gmu
  #includeMacroRegex = /<{2}include ['"]?([^'"]*)?['"]?>{2}/gmu
  #linkRegex = /\[{2}(.+?(?:\|.+)?)?\]{2}/gmu
  #setMacroRegex = /<{2}set (.*)? to (.*)?>{2}/gmu
  #unsetMacroRegex = /<{2}unset (.*)?>{2}/gmu

  #options = null





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  #parseBody = () => {
    return this.#options.body
      .replace(this.#setMacroRegex, '')
      .replace(this.#includeMacroRegex, (original, match) => this.story.getPage(match).body)
      .replace(this.#linkRegex, (original, match) => `**${match.split('|')[0]}**`)
  }

  #parseLinks = () => {
    let links = {}
    const matchedLinks = [...this.#options.body.matchAll(this.#linkRegex)]

    matchedLinks.forEach(([, match]) => {
      let [text, link] = match.split('|')
      link = link || text

      const linkedPageID = this.story.getPage(link).id

      links[text.toLowerCase()] = linkedPageID
    })

    return links
  }

  #parseVariables = () => {
    let body = this.#options.body
    const variables = {
      set: {},
      unset: [],
    }
    const sets = [...body.matchAll(this.#setMacroRegex)]
    const unsets = [...body.matchAll(this.#unsetMacroRegex)]

    sets.forEach(([original, variableName, variableValue]) => {
      let parsedValue = variableValue

      if ('true' === parsedValue) {
        parsedValue = true
      } else if ('false' === parsedValue) {
        parsedValue = false
      }

      variables.set[variableName] = parsedValue
    })

    unsets.forEach(([original, list]) => {
      variables.unset = [
        ...variables.unset,
        ...list.replace(/\s*,\s*/g, ',').split(','),
      ]
    })

    return variables
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (options) {
    this.#options = options
  }

  getLink = actionText => this.links[actionText?.toLowerCase()]





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get body () {
    return this.#parseBody()
  }

  get id () {
    return this.#options.id
  }

  get links () {
    return this.#parseLinks()
  }

  get name () {
    return this.#options.name
  }

  get variables () {
    return this.#parseVariables()
  }

  get story () {
    return this.#options.story
  }

  get tags () {
    return this.#options.tags
  }
}





export default Page
