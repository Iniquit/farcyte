const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const lunr = require('lunr');

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

		lunr.bigram =  function (token, idx, tokens) {

			if (!(typeof tokens[idx + 1] === 'undefined' || tokens[idx + 1] === null)) {
				return token + " " + tokens[idx + 1]
			} else return "";
			
		  }

		const idx = lunr(function() {
			this.ref('name');
			this.field('text');
			this.field('name');
			this.pipeline.remove(lunr.stemmer);
			this.searchPipeline.remove(lunr.stemmer);
			this.pipeline.remove(lunr.stopWordFilter);
			this.searchPipeline.remove(lunr.stopWordFilter);
			this.pipeline.add(lunr.bigram);
			this.searchPipeline.add(lunr.bigram);
			// this.k1(1.3);
			// this.b(0);

			final.forEach(doc => this.add(doc));
		});
		console.log(Object.keys(idx.invertedIndex).slice(0, 20))

		let speak = '';
		let protoSpeak = '';

		try {
			protoSpeak = idx.search(query);
			speak = protoSpeak[0].ref;
			console.log(`Attempted to find '${query}' in transcript`);

		}
		catch {
			message.channel.send('No matches. Try removing punctuation or using a longer search query.'); return;
		}

		const finalAdditionalArray = 'Also try ' + protoSpeak.slice(1, 6).map(x =>`${x.ref}`).join(', ');

		const chapterNumber = String(speak.match(/\d+(?=\.)/));
		const chapter = chapterNumber.padStart(2, '0');

		const pageNumber = String(speak.match(/(?<=\.)\d+/)) ;
		const page = pageNumber.padStart(2, '0');

		const link = `https://www.casualvillain.com/Unsounded/comic/ch${chapter}/ch${chapter}_${page}.html`;

		const pageEmbed = new MessageEmbed()
		.setColor(0x5865F2) // 0xD95E40
		if (!quiet) {pageEmbed.setTitle(`**${speak}**`)
		.setImage(`https://www.casualvillain.com/Unsounded/comic/ch${chapter}/pageart/ch${chapter}_${page}.jpg`)}
		pageEmbed.setDescription(`[Unsounded Chapter ${chapterNumber}, Page ${pageNumber} ↗](${link})`);
		if (finalAdditionalArray.length > 9 && !quiet) pageEmbed.setFooter(finalAdditionalArray);
        message.channel.send({ embeds: [pageEmbed] });

		});
	},
};