const fs = require('fs').promises;
const lunr = require('lunr');

module.exports = find;

 function find(args) {
	return fs.readFile('Unsounded Transcription.txt', 'utf8')
		.then(text => search(args, text));
}

function search(args, text) {

	args = args.toLowerCase().split(/ +/);
	const pageRegex = /(?<name>[\d]+\.+[\d]+)(?<text>[\s\S]+?)(?=[\d]+\.+[\d]+|$(?![\r\n])|\nCHAPTER)/gim;
	const transcriptArray = [...text.matchAll(pageRegex)].map (e => Object.assign({}, e.groups));

	lunr.bigram = function(token, idx, tokens) {
		if (tokens[idx + 1] !== undefined) {return token + ' ' + tokens[idx + 1];}
		else {return token;}
	};

	lunr.Pipeline.registerFunction(lunr.bigram, 'bigram');

	const index = lunr(function() {
		this.ref('name');
		this.field('text');
		this.field('name');
		this.pipeline.remove(lunr.stemmer);
		this.searchPipeline.remove(lunr.stemmer);
		this.pipeline.remove(lunr.stopWordFilter);
		this.searchPipeline.remove(lunr.stopWordFilter);
		this.pipeline.add(lunr.bigram);
		this.searchPipeline.add(lunr.bigram);


		transcriptArray.forEach(doc => this.add(doc));
	});
	// console.log(Object.keys(index.invertedIndex).slice(100, 120));

	try {
		const foundPage = index.query((query) => {
			query.term(args, { presence: lunr.Query.presence.OPTIONAL, wildcard: lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING })[0].ref;
		});
		// const foundPage = index.search(args);

		return { 'pageNumber': foundPage };
	}

	catch {
		return { 'pageNumber': 'Couldn\'t find a match' };
	}

}