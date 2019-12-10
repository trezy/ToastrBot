export default function (array, options = {}) {
  const {
    combinator = 'and',
    transformer = item => item,
  } = options

  let arrayClone = [...array].map(transformer)

  if (arrayClone.length > 1) {
    const lastItemIndex = arrayClone.length - 1

    arrayClone[lastItemIndex] = `${combinator} ${arrayClone[lastItemIndex]}`
  }

  if (arrayClone.length === 2) {
    return arrayClone.join(' ')
  } else {
    return arrayClone.join(', ')
  }
}
