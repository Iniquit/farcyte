const fs = require('fs').promises;
const { Document } = require('flexsearch');

module.exports = find;

 function find(args) {

	return fs.readFile('./Unsounded Transcription.txt', 'utf8')
	.then(text => {
		
		const pageRegex = /(?<name>[\d]+\.+[\d]+)(?<text>[\s\S]+?)(?=[\d]+\.+[\d]+|$(?![\r\n])|\nCHAPTER)/gim;
		const transcriptArray = [...text.matchAll(pageRegex)].map (e => Object.assign({}, e.groups));
	
		const transcriptIndex = new Document({
			preset: 'score',
			cache: 100,
			tokenize: 'reverse',
			optimize: true,
			encoder: 'advanced',
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
	
	transcriptArray.forEach(doc => transcriptIndex.add(doc));

	try { let foundPage = transcriptIndex.search(args)[0].result[0];
		return {'pageNumber': foundPage}
	}

	catch {return {'pageNumber': 'Couldn\'t find a match'}}
})};