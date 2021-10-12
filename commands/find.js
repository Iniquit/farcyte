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

		 //const newQuery = args.join(' ');
		

		
		// console.log('initial query:', query);
		const pageRegex = /(?<name>[\d]+\.+[\d]+)(?<text>[\s\S]+?)(?=[\d]+\.+[\d]+|$(?![\r\n])|\nCHAPTER)/gim;
		const final = [...transcript.matchAll(pageRegex)].map (e => Object.assign({}, e.groups));

		lunr.bigram = function(token, idx, tokens) {
			if (tokens[idx + 1] !== undefined) {

				token.str = token + ' ' + tokens[idx + 1].str;
				//console.log(token);
				return token;
			}
			else {
				//console.log(token);
				return token;
			}

		};

		lunr.Pipeline.registerFunction(lunr.bigram, 'bigram');

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


		final.forEach(doc => this.add(doc));
		});

		console.log('indexed tokens:', Object.keys(idx.invertedIndex));

		let foundPage = '';
		let pageName = '';

		try {
			foundPage = idx.query((query) => {
				query.term(args, { presence: lunr.Query.presence.OPTIONAL, wildcard: lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING });
			});
			// foundPage = idx.query(()=> 'this land', 'land as', 'as its');
			// foundPage = idx.search(query);
			pageName = foundPage[0].ref;
			console.log('indexed tokens:', foundPage[0].matchData);
			// console.log(`Attempted to find '${query}' in transcript`);
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

		const suggestionsList = foundPage.slice(1, 6).map(x =>`[${x.ref}](${processPage(x.ref).pageURL})`).join(', ');

		const pageEmbed = new MessageEmbed()
		.setColor(0x5865F2)
		.setTitle(`**${pageName}**`);
		if (!quiet && suggestionsList.length > 9) {
			// pageEmbed.setFooter(suggestionsList);
			pageEmbed.setDescription(`${processPage(pageName).description}\n **Also try:** ${suggestionsList}`);
		}
		else {pageEmbed.setDescription(`${processPage(pageName).description}`);}
		if (!quiet) pageEmbed.setImage(processPage(pageName).imageURL);

		message.channel.send({ embeds: [pageEmbed] });

		});
	},
};