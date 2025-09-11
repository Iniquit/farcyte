import fs from "node:fs";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import dotenv from "dotenv";
import path from "path";

export class CommandDeployer {
  constructor() {
    this.init();
  }

  async init() {
    dotenv.config();

    const token = process.env.TOKEN ?? "null";
    const clientId = process.env.CLIENT_ID ?? "null";
    const guildId = process.env.GUILD_ID ?? "null";

    const dirPath = path.resolve(__dirname, "./src/commands");

    const commands: any[] = [];
    const commandFiles = fs
      .readdirSync(dirPath)
      .filter((file: string) => file.endsWith(".ts"));

    for (const file of commandFiles) {
      const command = await import(`${dirPath}/${file}`);
      commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: "9" }).setToken(token);

    rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: [],
    });

    rest
      .put(Routes.applicationCommands(clientId), {
        body: commands,
      })
      .then(() =>
        console.log(
          "Registered commands:",
          commands.map((c) => c.name)
        )
      )
      .catch(console.error);
  }
}
