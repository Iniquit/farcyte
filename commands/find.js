import { MessageEmbed } from 'discord.js';
import indexer from '../functions/indexer.js';

export const name = 'find';
export const description = 'Look something up in the Unsounded transcript';
export const usage = '<text>';
export async function execute(message, args, isQuiet) {

	let pageName, foundPage = null;

	try {
		foundPage = await indexer.Find(args.join(' '));
		pageName = foundPage[0].ref;
		console.log(`Found ${foundPage[0].ref} in transcript with certainty ${Math.round(foundPage[0].score)}.`);
	}
	catch {
		const fullArg = args.join('');
		if (/^[0-9]+\.[0-9]+$/.test(fullArg)) {
			pageName = fullArg;
			console.log(`Assuming '${pageName}' is valid chapter + page number.`);
		}
		else {
			message.channel.send('No matches. Try removing punctuation or using a longer search query.');
			console.log('Couldn\'t find a match.');
			return;
		}
	}

	function processPage(pageToProcess) {

		const chapterNumber = String(pageToProcess.match(/\d+(?=\.)/));
		const chapter = chapterNumber.padStart(2, '0');

		const pageNumber = String(pageToProcess.match(/(?<=\.)\d+/));
		const page = pageNumber.padStart(2, '0');

		const pageURL = `https://www.casualvillain.com/Unsounded/comic/ch${chapter}/ch${chapter}_${page}.html`;
		const imageURL = `https://www.casualvillain.com/Unsounded/comic/ch${chapter}/pageart/ch${chapter}_${page}.jpg`;
		const desc = `[Unsounded Chapter ${chapterNumber}, Page ${pageNumber} ↗](${pageURL})`;
		const descriptionNoLink = `Chapter ${chapterNumber}, Page ${pageNumber} ↗`;

		return {
			'pageURL': pageURL,
			'imageURL': imageURL,
			'description': desc,
			'descriptionNoLink': descriptionNoLink,
		};
	}

	const suggestionsList = foundPage.slice(1, 6).map(x => `[${x.ref}](${processPage(x.ref).pageURL})`).join(', ');
	const currentPage = processPage(pageName);

	const pageEmbed = new MessageEmbed()
		.setColor(5793266)
		.setTitle(`**${pageName} | ${currentPage.descriptionNoLink}**`)
		.setURL(currentPage.pageURL);
	if (!isQuiet && suggestionsList.length > 9) {
		pageEmbed.setDescription(`Also try ${suggestionsList}`);
	}

	if (!isQuiet) { pageEmbed.setImage(currentPage.imageURL); }

	message.channel.send({ embeds: [pageEmbed] });

}