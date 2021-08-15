const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const lunr = require('lunr');

module.exports = {
	name: 'find',
	description: 'Look something up in the Unsounded transcript',
	usage: '<text>',
	execute(message, args) {
		fs.readFile('./Unsounded Transcription.txt', 'utf8', (err, data) => {
			if (err) {
				console.error(err);
				message.channel.send('Error: couldn\'t locate the transcript text file.');
				return;
			}

		const query = args.join(' ');
		const pageRegex = /(?<name>[\d]+\.+[\d]+)(?<text>[\s\S]+?)(?=[\d]+\.+[\d]+|$(?![\r\n])|\nCHAPTER)/gim;
		const final = [...data.matchAll(pageRegex)].map (e => Object.assign({}, e.groups));

		const idx = lunr(function() {
			this.ref('name');
			this.field('text');
			this.field('name');
			this.pipeline.remove(lunr.stemmer);
			this.searchPipeline.remove(lunr.stemmer);
			this.pipeline.remove(lunr.stopWordFilter);
			this.searchPipeline.remove(lunr.stopWordFilter);
			// this.k1(1.3);
			// this.b(0);

			final.forEach(function(doc) {
				this.add(doc);
			}, this);
		});

		// console.log('Other results:', idx.search(query)[1].ref, idx.search(query)[2].ref, idx.search(query)[3].ref)

		if (idx.search(query).length < 1) {
			message.channel.send('Couldn\'t find a good match.'); return;
		}

		const speak = idx.search(query)[0].ref;
		// console.log(speak);

		// console.log(`Attempted to find '${query}' in transcript`);

		const chapterNumber = String(speak.match(/\d+(?=\.)/));
		const chapter = chapterNumber.padStart(2, '0');

		const pageNumber = String(speak.match(/(?<=\.)\d+/)) ;
		const page = pageNumber.padStart(2, '0');

		const link = `https://www.casualvillain.com/Unsounded/comic/ch${chapter}/ch${chapter}_${page}.html`;

		const pageEmbed = new MessageEmbed()
		.setColor(0x5865F2) // 0xD95E40
		.setTitle(`**${speak}**`)
		.setImage(`https://www.casualvillain.com/Unsounded/comic/ch${chapter}/pageart/ch${chapter}_${page}.jpg`)
		.setDescription(`[Unsounded Chapter ${chapterNumber}, Page ${pageNumber} ↗](${link})`);

        message.channel.send({ embeds: [pageEmbed] });

		});
	},
};