import { SlashCommandBuilder } from "@discordjs/builders";
import { Indexer } from "../functions/indexer";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("index")
    .setDescription("Check the pages currently indexed."),

  async execute(interaction: any) {
    const indexer = new Indexer();
    await indexer.populateIndex();

    interaction.reply(
      `Index status: loaded ${indexer.linesLoaded} lines from ${indexer.pagesLoaded} pages across ${indexer.chaptersLoaded} chapters. Last page loaded is ${indexer.lastLoadedPage}.`
    );
  },
};
