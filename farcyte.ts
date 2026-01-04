import { readdirSync } from "fs";
import {
  Client,
  Collection,
  Interaction,
  Partials,
  GatewayIntentBits,
  Events,
  MessageFlags,
} from "discord.js";
import dotenv from "dotenv";
import { Command } from "./src/command";
import { CommandDeployer } from "./deploy-commands";
import { Indexer } from "./src/functions/indexer";

class Farcyte {
  private commands = new Collection<string, Command>();
  private indexer = new Indexer();

  commandFiles = readdirSync("./src/commands").filter((file: string) =>
    file.endsWith(".ts")
  );

  constructor(_commandDeployer: CommandDeployer = new CommandDeployer()) {
    this.init();
  }

  client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.DirectMessages,
    ],
    partials: [Partials.Channel],
  });

  init() {
    dotenv.config();
    this.indexer.populateIndex();

    if (process.env.REST_REQUEST_TIMEOUT_MS) {
      this.client.restRequestTimeout = parseInt(
        process.env.REST_REQUEST_TIMEOUT_MS
      );
    }

    this.client.once("clientReady", () => {
      console.log("Farcyte is awake!");
      this.client.user?.setActivity("/find");
    });

    for (const file of this.commandFiles) {
      const command = require(`./src/commands/${file}`);
      this.commands.set(command.data.name, command);
    }

    this.client.on(
      Events.InteractionCreate,
      async (interaction: Interaction) => {
        if (!interaction.isCommand()) {
          return;
        }

        const command = this.commands.get(interaction.commandName);
        if (!command) {
          return;
        }

        try {
          command.execute(interaction, this.indexer);
        } catch (error) {
          console.error(error);
          await interaction.reply({
            content: "There was an error while executing this command!",
            flags: MessageFlags.Ephemeral,
          });
        }
      }
    );
    this.client.login(process.env.TOKEN);
  }
}

new Farcyte();
