import { EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import { Indexer } from "../functions/indexer";
import * as fs from "fs";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("find")
    .setDescription("Search the Unsounded transcript for a comic page.")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription(
          "The phrase or page number you're searching for (e.g. '7.87' or 'reluctant escort')."
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("speaker")
        .setDescription(
          "Restrict results to a specific speaker (e.g. 'Sette' or 'Mikaila')."
        )
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName("chapter")
        .setDescription(
          "Restrict results to a specific chapter (e.g. '7' for chapter 7)."
        )
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName("limit")
        .setDescription("Number of suggestions to provide (default 5, max 20).")
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("quiet")
        .setDescription("Provide a text-only response without a page preview.")
        .setRequired(false)
    ),

  async execute(interaction: any, indexer: Indexer) {
    let query: string = interaction.options.getString("query");
    const chapterFilter: number = interaction.options.getInteger("chapter");
    const speakerFilter: string = interaction.options.getString("speaker");
    const limit: number = interaction.options.getInteger("limit") ?? 5;
    const isQuiet: boolean = interaction.options.getBoolean("quiet");

    const convertedChapterFilter = chapterFilter
      ? (chapterFilter.toString() ?? null)
      : null;

    const isPageNumberSearch = isPageNumberQuery(query);

    let targetPage: string | null;
    let searchResult;

    if (isPageNumberSearch) {
      targetPage =
        indexer.allPageLines.find((line) => line.page === query)?.page ?? null;
    } else {
      searchResult = await indexer.searchIndex(
        query,
        limit,
        speakerFilter,
        convertedChapterFilter
      );

      console.log(
        `query: ${query}\nresults: `,
        searchResult.slice(0, limit + 1).map((r) => {
          return { page: r.doc?.page, dialogue: r.doc?.dialogue };
        })
      );

      targetPage = (searchResult[0]?.doc?.page as string) ?? null;
    }

    if (targetPage === null) {
      interaction.reply({
        content: "Couldn't find a match. Try again?",
        ephemeral: true,
      });
      console.log("Couldn't find a match.");
      return;
    }

    const currentPage = processPage(targetPage);

    const pageEmbed = new EmbedBuilder()
      .setColor(5793266)
      .setTitle(`**${targetPage} | ${currentPage.descriptionNoLink}**`)
      .setURL(currentPage.pageURL);

    if (!isQuiet) {
      pageEmbed.setImage(currentPage.imageURL);
    }

    const suggestionsList: string =
      searchResult
        ?.slice(1, limit + 1)
        .map(
          (x) =>
            `[${x.doc?.page}](${processPage(x.doc?.page as string).pageURL})`
        )
        .join(", ") ?? "";

    if (!isQuiet && !isPageNumberQuery(query) && suggestionsList.length > 9) {
      pageEmbed.setDescription(`Also try ${suggestionsList}`);
    }

    let additionalQueryParams = "";

    if (query.length > 0) {
      if (speakerFilter) {
        additionalQueryParams += ` spoken by ${speakerFilter}`;
      }

      if (chapterFilter) {
        additionalQueryParams += ` in ch${chapterFilter}`;
      }

      await interaction.reply({
        content: `${`\`"${query}"\``}${additionalQueryParams}`,
        embeds: [pageEmbed],
      });
    } else {
      await interaction.reply({ embeds: [pageEmbed] });
    }

    function isPageNumberQuery(query: string): boolean {
      query = query.trim();
      let isPageNumber = false;
      isPageNumber = /^\d+(\.\d+)?$/.test(query);
      return isPageNumber;
    }

    function processPage(pageToProcess: string) {
      const rewriteFileLocation = process.env.URL_REWRITE_FILE;
      let replaceArray: any[] = [];

      if (rewriteFileLocation) {
        try {
          replaceArray = JSON.parse(
            fs.readFileSync(rewriteFileLocation, "utf8")
          );
        } catch (e) {
          console.log(e);
        }
      }

      const chapterNumber = String(pageToProcess.match(/\d+(?=\.)/));
      const chapter = chapterNumber.padStart(2, "0");

      const pageNumber = String(pageToProcess.match(/(?<=\.)\d+/));
      const page = pageNumber.padStart(2, "0");

      let pageURL = `https://www.casualvillain.com/Unsounded/comic/ch${chapter}/ch${chapter}_${page}.html`;
      let imageURL = `https://www.casualvillain.com/Unsounded/comic/ch${chapter}/pageart/ch${chapter}_${page}.jpg`;
      const desc = `[Unsounded Chapter ${chapterNumber}, Page ${pageNumber} ↗](${pageURL})`;
      const descriptionNoLink = `Chapter ${chapterNumber}, Page ${pageNumber} ↗`;

      replaceArray.forEach((item) => {
        if (item.originalArt && imageURL.includes(item.originalArt)) {
          imageURL = imageURL.replace(item.originalArt, item.replacementArt);
        }

        if (item.originalURL && pageURL.includes(item.originalURL)) {
          pageURL = pageURL.replace(item.originalURL, item.replacementURL);
        }
      });

      return {
        pageURL: pageURL,
        imageURL: imageURL,
        description: desc,
        descriptionNoLink: descriptionNoLink,
      };
    }
  },
};
