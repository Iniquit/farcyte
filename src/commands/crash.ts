import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('crash')
    .setDescription('Restarts Farcyte'),
  async execute(interaction: any) {
    interaction.client.user.setPresence({
      activities: [{ name: 'Restarting...' }],
      status: 'idle',
    });
    setTimeout(() => {
      process.exit();
    }, 0);
  },
};
