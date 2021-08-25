const fs = require('fs').promises;
const lunr = require('lunr');

module.exports = find;

 function find(args) {
	return fs.readFile('Unsounded Transcription.txt', 'utf8')
		.then(text => search(args, text));
}

function search(args, text) {

	const pageRegex = /(?<name>[\d]+\.+[\d]+)(?<text>[\s\S]+?)(?=[\d]+\.+[\d]+|$(?![\r\n])|\nCHAPTER)/gim;
	const transcriptArray = [...text.matchAll(pageRegex)].map (e => Object.assign({}, e.groups));


	lunr.bigram = function(token, idx, tokens) {

		if (!(typeof tokens[idx + 1] === 'undefined' || tokens[idx + 1] === null)) {
			return token + ' ' + tokens[idx + 1];
		}
 else {return token;}

	  };


	const index = lunr(function() {
		this.ref('name');
		this.field('text');
		this.field('name');
		this.pipeline.remove(lunr.stemmer);
		this.searchPipeline.remove(lunr.stemmer);
		this.pipeline.remove(lunr.stopWordFilter);
		this.searchPipeline.remove(lunr.stopWordFilter);

		// this.pipeline.add(lunr.bigram);
		// this.searchPipeline.add(lunr.bigram);
		 // this.k1(0);
		//  this.b(0.50);

		transcriptArray.forEach(doc => this.add(doc));
	});


try {
	  const foundPage = index.search(args)[0].ref;

	// let foundPage = index.search(`You’re my cause.`)[0].ref;

	/* let foundPage = index.query(function () {
		this.term(lunr.ngramtokenizer(args), { boost: 100, usePipeline: true })*/
		/* this.term(args, { boost: 100 })
		this.term(lunr.tokenizer(args), { boost: 50, usePipeline: true })
        this.term(lunr.tokenizer(args), { boost: 10, usePipeline: false, wildcard: lunr.Query.wildcard.TRAILING })
        this.term(lunr.tokenizer(args), { boost: 1, editDistance: 1 })*/

		/* this.term(args, { boost: 20 }) // exact match
		this.term(args, { usePipeline: false, wildcard: lunr.Query.wildcard.TRAILING, boost: 10 }) // prefix match, no stemmer
		this.term(args, { usePipeline: false, wildcard: lunr.Query.wildcard.LEADING, boost: 5 }) // prefix match, no stemmer
		this.term(args, { usePipeline: false, editDistance: 1, boost: 1 }) // fuzzy matching

	})[0].ref;*/

	return { 'pageNumber': foundPage };
}

catch {
	return { 'pageNumber': 'Couldn\'t find a match' };
}


}