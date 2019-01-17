export default async ({ commands }) => ({
  say: `This is a list of all available commands: ${Object.keys(commands).sort().join(', ')}`,
  success: true,
})
