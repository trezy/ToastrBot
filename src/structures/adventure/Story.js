// Module imports
import cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'





// Local imports
import Page from './Page'





// Local constants
const storiesPath = path.resolve(__dirname, '..', '..', 'stories')





class Story {
  /***************************************************************************\
    Static Methods
  \***************************************************************************/

  static get = title => {
    const cachedStory = Story.stories[title]

    if (cachedStory) {
      return cachedStory
    }

    return new Story({ title })
  }

  static stories = {}





  /***************************************************************************\
    Private Properties
  \***************************************************************************/

  #options = null





  /***************************************************************************\
    Public Properties
  \***************************************************************************/

  name = 'Untitled Story'

  pages = []

  pagesByID = {}

  pagesByName = {}

  startNode = -1





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  #addPage = page => {
    this.pages.push(page)
    this.pagesByID[page.id] = page
    this.pagesByName[page.name.toLowerCase()] = page
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (options) {
    this.#options = options

    // Add this story to the collection
    Story.stories[this.title] = this

    // Load and parse the story file
    const storyFile = fs.readFileSync(path.resolve(storiesPath, `${this.title}.html`))
    const $ = cheerio.load(storyFile)

    // Remove unnecessary `script` and `style` tags to reduce the amount of data in memory
    $('script, style').remove()

    // Parse the main story data
    const $storydata = $('tw-storydata')

    this.name = $storydata.attr('name')
    this.startNode = $storydata.attr('startnode')

    // Retrieve all passages and convert them to pages
    $storydata.find('tw-passagedata').map((index, element) => {
      const $element = $(element)

      this.#addPage(new Page({
        body: $element.text(),
        id: $element.attr('pid'),
        name: $element.attr('name'),
        story: this,
        tags: $element.attr('tags'),
      }))
    })
  }

  getPage = pageIdentifier => {
    let page = this.pagesByName[pageIdentifier?.toLowerCase()]

    if (!page) {
      page = this.pagesByID[pageIdentifier]
    }

    return page
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get title () {
    return this.#options.title
  }
}





export default Story
