// Local constants
const fortunes = [
  'It is certain.',
  'It is decidedly so.',
  'Without a doubt.',
  'Yes - definitely.',
  'You may rely on it.',
  'As I see it, yes.',
  'Most likely.',
  'Outlook good.',
  'Yes.',
  'Signs point to yes.',
  'Reply hazy, try again.',
  'Ask again later.',
  'Better not tell you now.',
  'Cannot predict now.',
  'Concentrate and ask again.',
  'Don\'t count on it.',
  'My reply is no.',
  'My sources say no.',
  'Outlook not so good.',
  'Very doubtful.',
]





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
      color: 14433988,
      description: `${user.atName}: ${magic.answer}. ${emoji}`,
    }
  } else {
    response.say = `I'm sorry, ${user.atName}, but you must provide a query for the magic 8-ball to respond.`
    response.success = false
  }

  return response
}
