export default function (array, combinator = 'and') {
  let arrayClone = [...array]

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
