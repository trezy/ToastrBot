export default async ({ args, user }) => {
  const response = { success: true }

  if (args) {
    const magicResponse = await fetch(`https://8ball.delegator.com/magic/JSON/${args}`)
    const { magic } = await magicResponse.json()
    let emoji = null

    switch (magic.type) {
      case 'Affirmitive':
        emoji = '😁'
        break

      case 'Contrary':
        emoji = '😬'
        break

      case 'Neutral':
        emoji = '🤔'
        break
    }

    response.embed = {
      author: { name: '🔮 The Magic 8-ball says...' },
      color: 'purple',
      description: `${user.atName}: ${magic.answer}. ${emoji}`,
    }
    response.say = `${user.atName}: ${magic.answer}. ${emoji}`
  } else {
    response.say = `I'm sorry, ${user.atName}, but you must provide a query for the magic 8-ball to respond.`
    response.success = false
  }

  return response
}
