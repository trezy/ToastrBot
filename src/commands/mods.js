export default async ({ channel, userstate }) => ({
  say: `@${userstate['display-name']}: The mods on this channel are ${(await channel.getModerators()).join(', ')}`,
  success: true,
})
