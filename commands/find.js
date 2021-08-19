const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const lunr = require('lunr');

module.exports = {
	name: 'find',
	description: 'Look something up in the Unsounded transcript',
	usage: '<text>',
	execute(message, args, quiet) {
		fs.readFile('Unsounded Transcription.txt', 'utf8', (err, transcript) => {
			if (err) {
				console.error(err);
				message.channel.send('Error: couldn\'t locate the transcript text file.');
				return;
			}

		const query = args.join(' ');
		const pageRegex = /(?<name>[\d]+\.+[\d]+)(?<text>[\s\S]+?)(?=[\d]+\.+[\d]+|$(?![\r\n])|\nCHAPTER)/gim;
		const final = [...transcript.matchAll(pageRegex)].map (e => Object.assign({}, e.groups));

		const idx = lunr(function() {
			this.ref('name');
			this.field('text');
			this.field('name');
			this.pipeline.remove(lunr.stemmer);
			this.pipeline.remove(lunr.stopWordFilter);
			this.searchPipeline.remove(lunr.stemmer);
			this.searchPipeline.remove(lunr.stopWordFilter);
			// this.pipeline.remove(lunr.trimmer);
			// this.k1(1.3);
			// this.b(0);

			final.forEach(doc => this.add(doc));
		});

		let foundPage = '';
		let pageName = '';

		try {
			foundPage = idx.search(query);
			pageName = foundPage[0].ref;
			console.log(`Attempted to find '${query}' in transcript`);
		}
		catch {
			message.channel.send('No matches. Try removing punctuation or using a longer search query.'); return;
		}

		function processPage(pageToProcess) {

			const chapterNumber = String(pageToProcess.match(/\d+(?=\.)/));
			const chapter = chapterNumber.padStart(2, '0');

			const pageNumber = String(pageToProcess.match(/(?<=\.)\d+/)) ;
			const page = pageNumber.padStart(2, '0');

			const pageURL = `https://www.casualvillain.com/Unsounded/comic/ch${chapter}/ch${chapter}_${page}.html`;
			const imageURL = `https://www.casualvillain.com/Unsounded/comic/ch${chapter}/pageart/ch${chapter}_${page}.jpg`;
			const description = `[Unsounded Chapter ${chapterNumber}, Page ${pageNumber} ↗](${pageURL})`;

			return {
				'pageURL': pageURL,
				'imageURL': imageURL,
				'description': description,
			};
		}

		const suggestionsArray = foundPage.slice(1, 6).map(x =>`[${x.ref}](${processPage(x.ref).pageURL})`).join(', ');

		const pageEmbed = new MessageEmbed()
		.setColor(0x5865F2)
		.setTitle(`**${pageName}**`)
		.setDescription(processPage(pageName).description);
		if (!quiet) pageEmbed.setImage(processPage(pageName).imageURL);
		// if (!quiet && suggestionsArray.length > 9) pageEmbed.setFooter(suggestionsArray);
		pageEmbed.addField('Also try', suggestionsArray, false);
		message.channel.send({ embeds: [pageEmbed] });

		});
	},
};