import { SlashCommandBuilder } from "@discordjs/builders";
import { Indexer } from "../functions/indexer";
import { EmbedBuilder } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("random")
    .setDescription("Get a random page from Unsounded.")
    .addBooleanOption((option) =>
      option
        .setName("quote")
        .setDescription(
          "Returns a random quote from the page instead of a page preview."
        )
        .setRequired(false)
    ),

  async execute(interaction: any) {
    const indexer = new Indexer();
    await indexer.populateIndex();

    const randomLine =
      indexer.allPageLines[
        Math.floor(Math.random() * indexer.allPageLines.length)
      ];

    const targetPage = randomLine.page;

    const currentPage = processPage(targetPage);

    if (interaction.options.getBoolean("quote")) {
      await interaction.reply(
        `**${randomLine.speaker}**: "${randomLine.dialogue.trim()}" [(${randomLine.page} ↗)](${currentPage.pageURL})`
      );
      return;
    }

    const pageEmbed = new EmbedBuilder()
      .setColor(5793266)
      .setTitle(`**${targetPage} | ${currentPage.descriptionNoLink}**`)
      .setURL(currentPage.pageURL)
      .setImage(currentPage.imageURL);

    await interaction.reply({ embeds: [pageEmbed] });

    function processPage(pageToProcess: string) {
      const chapterNumber = String(pageToProcess.match(/\d+(?=\.)/));
      const chapter = chapterNumber.padStart(2, "0");

      const pageNumber = String(pageToProcess.match(/(?<=\.)\d+/));
      const page = pageNumber.padStart(2, "0");

      let pageURL = `https://www.casualvillain.com/Unsounded/comic/ch${chapter}/ch${chapter}_${page}.html`;
      let imageURL = `https://www.casualvillain.com/Unsounded/comic/ch${chapter}/pageart/ch${chapter}_${page}.jpg`;
      const desc = `[Unsounded Chapter ${chapterNumber}, Page ${pageNumber} ↗](${pageURL})`;
      const descriptionNoLink = `Chapter ${chapterNumber}, Page ${pageNumber} ↗`;

      return {
        pageURL: pageURL,
        imageURL: imageURL,
        description: desc,
        descriptionNoLink: descriptionNoLink,
      };
    }
  },
};
