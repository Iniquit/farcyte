import lunr from 'lunr';
import * as fs from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();

let Index = null;

export default { Index, CreateIndex, Find };

async function Find(query) {
    if (Index == null) Index = await CreateIndex(process.env.TRANSCRIPT_FILE);
    return await Index.search(query);
}

async function CreateIndex(transcriptFile) {
    const data = await fs.readFile(transcriptFile, 'utf8');
    const pageRegex = /(?<name>(?<=\n)[\d]+\.[\d]+)(?<text>[\s\S]+?)(?=\n[\d]+\.[\d]+|\nCHAPTER|$(?![\r\n]))/gim;
    const transcriptPages = [...data.matchAll(pageRegex)].map (e => Object.assign({}, e.groups));

    const index = lunr(function() {
        this.ref('name');
        this.field('text');
        this.field('name');
        this.pipeline.remove(lunr.stemmer);
        this.pipeline.remove(lunr.stopWordFilter);
        this.searchPipeline.remove(lunr.stemmer);
        this.searchPipeline.remove(lunr.stopWordFilter);
        transcriptPages.forEach(doc => this.add(doc));
    });
    return index;
}