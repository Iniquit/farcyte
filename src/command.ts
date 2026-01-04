import { Collection, Interaction } from "discord.js";
import { Indexer } from "./functions/indexer";

declare module "discord.js" {
  export interface Client {
    commands: Collection<unknown, any>;
    restRequestTimeout: number;
  }
}

export interface Command {
  name: string;
  description: string;
  execute(interaction: Interaction, indexer: Indexer): void;
}
