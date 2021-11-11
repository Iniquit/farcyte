import lunr from 'lunr';
import fs from 'fs';

const Index = null;

export default { Index, CreateIndex, Find };

function Find(query) {
    return this.Index.search(query);
}

function CreateIndex(transcriptFile) {

    fs.readFile(transcriptFile, 'utf8', (err, data) => {
    if (err) throw err;

    const pageRegex = /(?<name>[\d]+\.+[\d]+)\n+(?<text>[\s\S]+?)(?=[\d]+\.+[\d]+\n+|$(?![\r\n])|\nCHAPTER)/gim;
    const transcriptPages = [...data.matchAll(pageRegex)];

    const transcriptPagesTwo = transcriptPages.map (e => Object.assign({}, e.groups));

    this.Index = lunr(function() {
        this.ref('name');
        this.field('text');
        this.field('name');
        this.pipeline.remove(lunr.stemmer);
        this.pipeline.remove(lunr.stopWordFilter);
        this.searchPipeline.remove(lunr.stemmer);
        this.searchPipeline.remove(lunr.stopWordFilter);
        transcriptPagesTwo.forEach(doc => this.add(doc));
        console.log(`Index created from file at ${transcriptFile}`);
    });
});
}