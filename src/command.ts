import { Collection, Interaction } from 'discord.js';

declare module 'discord.js' {
  export interface Client {
    commands: Collection<unknown, any>;
    restRequestTimeout: number;
  }
}

export interface Command {
  name: string;
  description: string;
  execute(interaction: Interaction): void;
}
