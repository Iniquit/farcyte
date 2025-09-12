import * as fs from "fs/promises";
import dotenv from "dotenv";
import FlexSearch, { Encoder } from "flexsearch";

export class ComicPage {
  name: string = "";
  text: string = "";
}

export class ComicLine {
  id: number = 1;
  speaker: string = "";
  dialogue: string = "";
  page: string = "";
}

export class Indexer {
  indexPopulated: boolean = false;

  index = new FlexSearch.Document({
    preset: "match",
    tokenize: "full",
    encoder: "LatinBalance",
    document: {
      id: "id",
      index: ["speaker", "dialogue", "page"],
      store: true,
    },
  });

  constructor() {
    dotenv.config();
  }

  async searchIndex(query: string, limit: number = 1) {
    if (!this.indexPopulated) {
      await this.populateIndex();
    }

    return this.index.search(query, {
      enrich: true,
      suggest: false,
      limit: limit,
    });
  }

  async populateIndex() {
    const transcriptFilePath = process.env.TRANSCRIPT_FILE ?? "null";
    let data = await fs.readFile(transcriptFilePath, "utf8");

    const pageRegex =
      /(?<name>(?<=\n)[\d]+\.[\d]+)(?<text>[\s\S]+?)(?=\n[\d]+\.[\d]+|\nCHAPTER|$(?![\r\n]))/gim;

    const transcriptPages = [...data.matchAll(pageRegex)].map((e) => {
      const page = new ComicPage();
      page.name = e.groups?.name ?? "";
      page.text = e.groups?.text.trim() ?? "";

      return page;
    });

    const pageLines = new Array<ComicLine>();

    transcriptPages.forEach((x) => {
      const lineRegex = /(?<speaker>^[^\n\r\d\[][^:]*):(?<dialogue>.*$)/gim;

      const derivedLines = [...x.text.matchAll(lineRegex)].map((e) => {
        const line = new ComicLine();
        line.speaker = e.groups?.speaker ?? "";
        line.dialogue = e.groups?.dialogue ?? "";
        line.page = x.name;

        return line;
      });

      pageLines.push(...derivedLines);
    });

    pageLines.forEach((x, i) => {
      this.index.add({
        id: i,
        page: x.page,
        speaker: x.speaker,
        dialogue: x.dialogue,
      });
    });
    this.indexPopulated = true;
  }
}

// export class PageResult extends DocumentData {
//   id: number = -1;
//   page: string = "";
//   speaker: string = "";
//   dialogue: string = "";
// }
