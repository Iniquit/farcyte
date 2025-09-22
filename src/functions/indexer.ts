import * as fs from "fs/promises";
import dotenv from "dotenv";
import FlexSearch, {
  DocumentData,
  EnrichedResults,
  Resolver,
} from "flexsearch";

export class Indexer {
  indexPopulated: boolean = false;
  linesLoaded: number = 0;
  pagesLoaded: number = 0;
  chaptersLoaded: number = 0;
  lastLoadedPage: string = "";
  uniqueSpeakers: Set<string> = new Set<string>();
  allPageLines: ComicLine[] = [];

  index = new FlexSearch.Document({
    preset: "score",
    context: false,
    // tokenize: "full",
    encoder: "LatinSoundex", //LatinExtra
    document: {
      id: "id",
      index: ["speaker", "dialogue", "page", "chapter"],
      store: true,
    },
  });

  exactPageIndex = new FlexSearch.Document({
    preset: "match",
    tokenize: "strict",
    context: {
      resolution: 9,
      depth: 2,
      bidirectional: true,
    },
    // encoder: "LatinSoundex",
    document: {
      id: "id",
      index: ["page"],
      store: true,
    },
  });

  constructor() {
    dotenv.config();
  }

  async searchIndex(
    query: string,
    limit: number = 1,
    speakerFilter: string | null = null,
    chapterFilter: string | null = null
  ): Promise<EnrichedResults<DocumentData>> {
    if (!this.indexPopulated) {
      await this.populateIndex();
    }

    let resolver: Resolver<DocumentData>;

    function isPageNumberQuery(query: string): boolean {
      return /^\d+(\.\d+)?$/.test(query.trim());
    }

    if (isPageNumberQuery(query)) {
      resolver = this.index.search({
        query: query,
        field: "page",
        limit: 1,
        suggest: true,
        resolve: false,
      });
    } else {
      resolver = this.index.search({
        query: query,
        field: "dialogue",
        limit: 1,
        suggest: true,
        resolve: false,
      });
    }

    if (speakerFilter) {
      resolver.and({
        query: speakerFilter,
        field: "speaker",
      });
    }

    if (chapterFilter) {
      resolver.and({
        query: chapterFilter,
        field: "chapter",
      });
    }

    return resolver.resolve({ enrich: true });
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
      const lineRegex = /(?<speaker>^[^\n\r\d\[][^[:]*)[[:](?<dialogue>.*$)/gim;
      const derivedLines = [...x.text.matchAll(lineRegex)].map((e) => {
        const line = new ComicLine();
        line.speaker = e.groups?.speaker ?? "";
        line.dialogue = e.groups?.dialogue ?? "";
        line.page = x.name;
        line.chapter = x.name.split(".")[0];

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
        chapter: x.chapter,
      });

      this.exactPageIndex.add({
        id: i,
        page: x.page,
      });

      this.allPageLines.push(x);
    });

    this.linesLoaded = pageLines.length;
    this.pagesLoaded = transcriptPages.length;
    this.chaptersLoaded = new Set(
      transcriptPages.map((x) => x.name.split(".")[0])
    ).size;
    this.lastLoadedPage = transcriptPages.slice(-1)[0]?.name ?? "none";
    this.uniqueSpeakers = new Set(
      pageLines.map((x) => x.speaker.trim()).filter((x) => x.trim().length > 0)
    );

    this.indexPopulated = true;
  }
}

export class ComicPage {
  name: string = "";
  text: string = "";
}

export class ComicLine {
  id: number = 1;
  speaker: string = "";
  dialogue: string = "";
  page: string = "";
  chapter: string = "";
}
