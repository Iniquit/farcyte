const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const { Index, Document, Worker } = require('flexsearch');
const FlexSearch = require('flexsearch');
const { match } = require('assert');

module.exports = {
	name: 'find',
	description: 'Look something up in the Unsounded transcript',
	usage: '<text>',
	execute(message, args, quiet) {
		fs.readFile('Unsounded Transcription.txt', 'utf8', (err, data) => {
			if (err) {
				console.error(err);
				message.channel.send('Error: couldn\'t locate the transcript text file.');
				return;
			}

		const query = args.join(' ');
		const pageRegex = /(?<name>[\d]+\.+[\d]+)(?<text>[\s\S]+?)(?=[\d]+\.+[\d]+|$(?![\r\n])|\nCHAPTER)/gim;
		const final = [...data.matchAll(pageRegex)].map (e => Object.assign({}, e.groups));


		const index = new Document({
			// tokenize: 'full', doesn't help
			preset: 'score',
			language: "en",
			tokenize: 'full',
			// resolution: 80,
			context: {
				depth: 1,
				resolution: 20,
				threshold: 19,
				bidirectional: false,
			},
			document: {
				id: 'name',
				index: [{
					field: 'name',
					//query: "some query",
					limit: 5,
					suggest: true
				},{
					field: "text",
					//query: "same or other query",
					limit: 5,
					suggest: true
				}] },
			});


		// index.add({ id: 0, content: "some text" });

			final.forEach(doc => index.add(doc));

			//console.log(final[0]);
			 //console.log(index);


		let speak = '';
		let protoSpeak = '';

		try {
			protoSpeak = index.search(query)[0];
			speak = protoSpeak.result[0];
			console.log('protospeak', protoSpeak);
			console.log('speak', speak);
			console.log(`Attempted to find '${query}' in transcript`);


		}

		catch {
			message.channel.send('No matches. Try removing punctuation or using a longer search query.'); return;
		}

		const finalAdditionalArray = 'Also try ' + protoSpeak.result.slice(1, 6).map(x =>`${x.ref}`).join(', ');

		const chapterNumber = String(speak.match(/\d+(?=\.)/));
		const chapter = chapterNumber.padStart(2, '0');

		const pageNumber = String(speak.match(/(?<=\.)\d+/)) ;
		const page = pageNumber.padStart(2, '0');

		const link = `https://www.casualvillain.com/Unsounded/comic/ch${chapter}/ch${chapter}_${page}.html`;

		const pageEmbed = new MessageEmbed()
		.setColor(0x5865F2); // 0xD95E40
		if (!quiet) {
pageEmbed.setTitle(`**${speak}**`)
		.setImage(`https://www.casualvillain.com/Unsounded/comic/ch${chapter}/pageart/ch${chapter}_${page}.jpg`);
}
		pageEmbed.setDescription(`[Unsounded Chapter ${chapterNumber}, Page ${pageNumber} ↗](${link})`);
		if (finalAdditionalArray.length > 9 && !quiet) pageEmbed.setFooter(finalAdditionalArray);
        message.channel.send({ embeds: [pageEmbed] });

		});
	},
};