export default async ({ channel, user }) => ({
  say: `@${user.atName}: The mods on this channel are ${(await channel.getModerators()).join(', ')}`,
  success: true,
})
