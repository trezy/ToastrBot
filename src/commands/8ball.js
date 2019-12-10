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
    response.say = `${user.atName}: ${fortunes[Math.floor(Math.random() * fortunes.length)]}`
  } else {
    response.say = `I'm sorry, ${user.atName}, but you must provide a query for the magic 8-ball to respond.`
    response.success = false
  }

  return response
}
