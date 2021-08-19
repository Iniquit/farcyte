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

	const index = lunr(function() {
		this.ref('name');
		this.field('text');
		this.field('name');
		this.pipeline.remove(lunr.stemmer);
		this.searchPipeline.remove(lunr.stemmer);
		this.pipeline.remove(lunr.stopWordFilter);
		this.searchPipeline.remove(lunr.stopWordFilter);
		// this.pipeline.remove(lunr.trimmer);
		// this.searchPipeline.add(lunr.trimmer);

		// this.searchPipeline.add(lunr.trimmer);
		// this.k1(1.3);
		// this.b(0);

		transcriptArray.forEach(doc => this.add(doc));
	});
	try {
		const foundPage = index.search(args)[0].ref;

		return { 'pageNumber': foundPage };
	}

	catch {
		return { 'pageNumber': 'Couldn\'t find a match' };
	}

}