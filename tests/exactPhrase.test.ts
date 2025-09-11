import { Indexer, PageResult } from "../src/functions/indexer";

function Expect(phrase: string, targetPage: string) {
  test(`Query "${phrase}" finds ${targetPage}`, async () => {
    const results = await new Indexer().searchIndex(phrase);

    const test = results[0]?.result[0];
    const test2 = test?.doc?.page ?? "no page found";

    expect(test2).toBe(targetPage);
  });
}

export interface SearchResult {
  id: number;
  doc: PageResult;
}

// currently passing
Expect("a reluctant escort", "1.0");
Expect("2.2", "2.2");
Expect("perplexing command", "2.31");

Expect("pig lead", "8.36");
Expect("but it was you i could tell", "8.38");
Expect("no one ever calls me sette the way ya call me mikaila", "8.37");
Expect("what job can you do for the job I'll do you", "9.13");
Expect("oh no i love her", "9.14");
Expect("shade of green", "9.42");
Expect("fealty after all rewards", "10.71");
Expect("unrelentin' explosive fire", "11.40");
Expect("eccentric old charmers", "12.58");
Expect("you're my cause", "11.88");
Expect("14.96", "14.96");
Expect("14.123", "14.123");

// currently failing but should probably pass
Expect("only a da", "7.110");
Expect("i will solve it", "7.83");
Expect("greatest wright in centuries", "7.87");
