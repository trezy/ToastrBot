// Local constants
const MESSAGE_LENGTH_LIMIT = 2000





export default docs => {
  if (docs.length < MESSAGE_LENGTH_LIMIT) {
    return docs
  }

  const splitDocs = [docs]

  while (splitDocs[splitDocs.length - 1].length > MESSAGE_LENGTH_LIMIT) {
    const docsToChunk = splitDocs[splitDocs.length - 1]
    let nextChunk = docsToChunk.substring(0, MESSAGE_LENGTH_LIMIT)

    const reversedString = nextChunk.split('').reverse().join('')
    const paragraphEndIndex = reversedString.indexOf(`\n\n`)
    let splitIndex = nextChunk.length - paragraphEndIndex

    if (paragraphEndIndex !== -1) {
      splitDocs[splitDocs.length - 1] = docsToChunk.substring(0, splitIndex)
      splitDocs.push(docsToChunk.substring(splitIndex))

      continue
    }

    const {
      index: remainderToCut,
    } = /[\.!?]/gm.exec(reversedString)

    splitIndex = nextChunk.length - remainderToCut

    splitDocs[splitDocs.length - 1] = docsToChunk.substring(0, splitIndex)
    splitDocs.push(docsToChunk.substring(splitIndex))
  }

  return splitDocs
}
