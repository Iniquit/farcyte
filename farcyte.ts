import { readdirSync } from 'fs';
import { Client, Intents, Collection, Interaction } from 'discord.js';
import { log } from './src/functions/utils';
import dotenv from 'dotenv';
import { Command } from './src/command';
import { CommandDeployer } from './deploy-commands';

class Farcyte {
  private commands = new Collection<string, Command>();

  commandFiles = readdirSync('./src/commands').filter((file: string) =>
    file.endsWith('.ts'),
  );

  constructor(_commandDeployer: CommandDeployer = new CommandDeployer()) {
    this.init();
  }

  client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.DIRECT_MESSAGES,
    ],
    partials: ['CHANNEL'],
  });

  init() {
    dotenv.config();

    if (process.env.REST_REQUEST_TIMEOUT_MS) {
      this.client.restRequestTimeout = parseInt(
        process.env.REST_REQUEST_TIMEOUT_MS,
      );
    }

    this.client.once('ready', () => {
      console.log('Farcyte is awake!');
      this.client.user?.setActivity('/find');
    });

    for (const file of this.commandFiles) {
      const command = require(`./src/commands/${file}`);
      this.commands.set(command.data.name, command);
    }

    this.client.on('interactionCreate', async (interaction: Interaction) => {
      if (!interaction.isApplicationCommand()) {
        return;
      }

      const command = this.commands.get(interaction.commandName);

      if (!command) {
        return;
      }

      try {
        command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        });
      }
    });
    this.client.login(process.env.TOKEN);
  }
}

new Farcyte();
