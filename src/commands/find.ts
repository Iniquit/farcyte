import { SlashCommandBuilder } from "@discordjs/builders";
import { Indexer } from "../functions/indexer";
import { SearchResult } from "../../tests/exactPhrase.test";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("find")
    .setDescription("Find a phrase or page in the Unsounded transcript.")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription(
          "A phrase or page number to search for in the transcript."
        )
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("chapter")
        .setDescription(
          "The chapter to which your search should be restricted."
        )
    )
    .addBooleanOption((option) =>
      option
        .setName("quiet")
        .setDescription("Should the page preview should be hidden?")
        .setRequired(false)
    ),
  async execute(interaction: any) {
    let pageName = null;
    let foundPage = null;
    let query: string = interaction.options.getString("query");
    const chapterFilter: number = interaction.options.getInteger("chapter");
    const isQuiet: boolean = interaction.options.getBoolean("quiet");

    const indexer = new Indexer();
    const searchResult = await indexer.searchIndex(query, 5);
    const test = searchResult[0];

    const test2 = test?.result[0] as unknown as SearchResult;
    const test3 = test2?.doc?.page ?? "no page found";

    console.log(test.result);
    console.log("Best Match:", test2);
    console.log(test3);

    // if (chapterFilter) {
    //   foundPage = foundPage.filter(
    //     (page) => page.ref.split(".")[0] === chapterFilter.toString(),
    //   );
    // }

    //pageDoc.id;
    // console.log(
    //   `Found ${foundPage[0].ref} in transcript with certainty ${Math.round(
    //     foundPage[0].score,
    //   )}.`,
    // );

    //}

    //   catch(e) {
    //     console.error(e);
    //     if (/\d+\.\d+/.test(query) && !chapterFilter) {
    //       pageName = query;
    //       console.log(`Assuming '${pageName}' is valid chapter + page number.`);
    //     } else {
    //       interaction.reply({
    //         content:
    //           "No matches. Try removing punctuation or using a longer search query.",
    //         ephemeral: true,
    //       });
    //       console.log("Couldn't find a match.");
    //       return;
    //     }
    //   }

    //   function processPage(pageToProcess: string) {
    //     dotenv.config();

    //     // this should be done once on load

    //     const rewriteFileLocation = process.env.URL_REWRITE_FILE;
    //     let replaceArray: any[] = [];

    //     if (rewriteFileLocation) {
    //       try {
    //         replaceArray = JSON.parse(
    //           fs.readFileSync(rewriteFileLocation, "utf8")
    //         );
    //       } catch (e) {
    //         console.log(e);
    //       }
    //     }

    //     const chapterNumber = String(pageToProcess.match(/\d+(?=\.)/));
    //     const chapter = chapterNumber.padStart(2, "0");

    //     const pageNumber = String(pageToProcess.match(/(?<=\.)\d+/));
    //     const page = pageNumber.padStart(2, "0");

    //     let pageURL = `https://www.casualvillain.com/Unsounded/comic/ch${chapter}/ch${chapter}_${page}.html`;
    //     let imageURL = `https://www.casualvillain.com/Unsounded/comic/ch${chapter}/pageart/ch${chapter}_${page}.jpg`;
    //     const desc = `[Unsounded Chapter ${chapterNumber}, Page ${pageNumber} ↗](${pageURL})`;
    //     const descriptionNoLink = `Chapter ${chapterNumber}, Page ${pageNumber} ↗`;

    //     replaceArray.forEach((item) => {
    //       if (item.originalArt && imageURL.includes(item.originalArt)) {
    //         imageURL = imageURL.replace(item.originalArt, item.replacementArt);
    //       }

    //       if (item.originalURL && pageURL.includes(item.originalURL)) {
    //         pageURL = pageURL.replace(item.originalURL, item.replacementURL);
    //       }
    //     });

    //     return {
    //       pageURL: pageURL,
    //       imageURL: imageURL,
    //       description: desc,
    //       descriptionNoLink: descriptionNoLink,
    //     };
    //   }

    //   // const suggestionsList =
    //   //   foundPage
    //   //     ?.slice(1, 6)
    //   //     .map((x: any) => `[${x.ref}](${processPage(x.ref).pageURL})`)
    //   //     .join(", ") ?? "";
    //   const currentPage = processPage(pageName);

    //   const pageEmbed = new MessageEmbed()
    //     .setColor(5793266)
    //     .setTitle(`**${pageName} | ${currentPage.descriptionNoLink}**`)
    //     .setURL(currentPage.pageURL);
    //   // if (!isQuiet && suggestionsList.length > 9) {
    //   //   pageEmbed.setDescription(`Also try ${suggestionsList}`);
    //   // }

    //   if (!isQuiet) {
    //     pageEmbed.setImage(currentPage.imageURL);
    //   }

    //   if (chapterFilter) {
    //     query = `"\`${query}\`" in ch${chapterFilter}`;
    //   } else {
    //     query = `"\`${query}\`"`;
    //   }

    //   if (query.length > 0) {
    //     await interaction.reply({
    //       content: query,
    //       embeds: [pageEmbed],
    //     });
    //   } else {
    //     await interaction.reply({ embeds: [pageEmbed] });
    //   }
  },
};
