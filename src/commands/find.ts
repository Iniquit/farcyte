import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import indexer from '../functions/indexer';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('find')
    .setDescription(
      'Look up a phrase or page number in the Unsounded transcript.',
    )
    .addStringOption((option) =>
      option
        .setName('query')
        .setDescription('A phrase or page number to search the transcript for.')
        .setRequired(true),
    )
    .addBooleanOption((option) =>
      option
        .setName('quiet')
        .setDescription('Whether or not the page preview should be displayed.')
        .setRequired(false),
    ),
  async execute(interaction: any) {
    let pageName = null;
    let foundPage = null;
    const query: string = interaction.options.getString('query');
    const isQuiet: boolean = interaction.options.getBoolean('quiet');

    try {
      foundPage = await indexer.find(query);
      pageName = foundPage[0].ref;
      console.log(
        `Found ${foundPage[0].ref} in transcript with certainty ${Math.round(
          foundPage[0].score,
        )}.`,
      );
    } catch {
      if (/^[0-9]+\.[0-9]+$/.test(query)) {
        pageName = query;
        console.log(`Assuming '${pageName}' is valid chapter + page number.`);
      } else {
        interaction.reply({
          content:
            'No matches. Try removing punctuation or using a longer search query.',
          ephemeral: true,
        });
        console.log("Couldn't find a match.");
        return;
      }
    }

    function processPage(pageToProcess: string) {
      const chapterNumber = String(pageToProcess.match(/\d+(?=\.)/));
      const chapter = chapterNumber.padStart(2, '0');

      const pageNumber = String(pageToProcess.match(/(?<=\.)\d+/));
      const page = pageNumber.padStart(2, '0');

      const pageURL = `https://www.casualvillain.com/Unsounded/comic/ch${chapter}/ch${chapter}_${page}.html`;
      const imageURL = `https://www.casualvillain.com/Unsounded/comic/ch${chapter}/pageart/ch${chapter}_${page}.jpg`;
      const desc = `[Unsounded Chapter ${chapterNumber}, Page ${pageNumber} ↗](${pageURL})`;
      const descriptionNoLink = `Chapter ${chapterNumber}, Page ${pageNumber} ↗`;

      return {
        pageURL: pageURL,
        imageURL: imageURL,
        description: desc,
        descriptionNoLink: descriptionNoLink,
      };
    }

    const suggestionsList =
      foundPage
        ?.slice(1, 6)
        .map((x: any) => `[${x.ref}](${processPage(x.ref).pageURL})`)
        .join(', ') ?? '';
    const currentPage = processPage(pageName);

    const pageEmbed = new MessageEmbed()
      .setColor(5793266)
      .setTitle(`**${pageName} | ${currentPage.descriptionNoLink}**`)
      .setURL(currentPage.pageURL);
    if (!isQuiet && suggestionsList.length > 9) {
      pageEmbed.setDescription(`Also try ${suggestionsList}`);
    }

    if (!isQuiet) {
      pageEmbed.setImage(currentPage.imageURL);
    }

    await interaction.reply({ embeds: [pageEmbed] });
  },
};
