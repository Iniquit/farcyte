const fs = require('fs').promises
const { Document } = require('flexsearch');

module.exports = find;

 function find(args) {
	return fs.readFile('Unsounded Transcription.txt', 'utf8')
		.then(text => search(args, text))
};

function search(args, text) {
	
	const pageRegex = /(?<name>[\d]+\.+[\d]+)(?<text>[\s\S]+?)(?=[\d]+\.+[\d]+|$(?![\r\n])|\nCHAPTER)/gim;
	const transcriptArray = [...text.matchAll(pageRegex)].map (e => Object.assign({}, e.groups));

	const index = new Document({
		preset: 'score',
		cache: 100,
		tokenize: 'strict',
		optimize: true,
		encoder: 'extra',
		context: {
			depth: 2,
			resolution: 9,
			threshold: 8,
			bidirectional: false,
		},
		document: {
			id: 'name',
			index: [{
				field: 'name',
				limit: 5,
				suggest: true,
			}, {
				field: 'text',
				limit: 5,
				suggest: true,
			}] },
		});

transcriptArray.forEach(doc => index.add(doc));


try {
	let foundPage = index.search(args)[0].result[0];
	
	return {'pageNumber': foundPage,
			//'embed': { embeds: [pageEmbed] }
			}
}

catch {
	return {'pageNumber': 'Couldn\'t find a match',
	//'embed': { embeds: [pageEmbed] }
	}
}






};