import { Indexer } from "../src/functions/indexer";

const indexer = new Indexer();

function Expect(phrase: string, targetPage: string) {
  test(`Query "${phrase}" finds ${targetPage}`, async () => {
    const results = await indexer.searchIndex(phrase);
    const target = results[0]?.result[0];
    console.log(
      results.map((x) => x.result.map((y) => y.doc?.dialogue ?? "?")).flat()
    );
    const pageNumber = target?.doc?.page ?? null;
    expect(pageNumber).toBe(targetPage);
  });
}

// currently passing
// Expect("a reluctant escort", "1.0");
// Expect("2.2", "2.2");
Expect("perplexing command", "2.31");
Expect("pig lead", "8.36");
Expect("but it was you i could tell", "8.38");
Expect("no one ever calls me sette the way ya call me mikaila", "8.37");
Expect("what job can you do for the job I'll do you", "9.13");
Expect("oh no i love her", "9.14");
Expect("shocking shade of green", "9.42");
Expect("fealty after all rewards", "10.71");
Expect("doubt is the field", "15.29");
Expect("best wright in centuries", "7.86");
Expect("unrelenting explosive fire", "11.40");
Expect("eccentric old charmers", "12.58");
Expect("you're my cause", "11.88");
Expect("14.96", "14.96");
Expect("14.123", "14.123");
