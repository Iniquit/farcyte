import { Indexer } from "../src/functions/indexer";

const indexer = new Indexer();

beforeAll(async () => {
  await indexer.populateIndex();
});

// tests for exact phrase matching

// currently passing
Expect("1.1", "a reluctant escort");
Expect("2.2", "2.2");
Expect("2.31", "perplexing command");
Expect("5.12", "eat tree");

Expect("6.33", "you lied to me just like you lied to my mother");

Expect("7.73", "i don't know what that means but it does sound impressive");
Expect("7.85", "what's that like i wonder");
Expect("7.87", "best wright in centuries");

Expect("8.36", "pig lead");
Expect("8.37", "no one ever calls me sette the way ya call me mikaila");
Expect("8.38", "but it was you i could tell");

Expect("9.13", "what job can you do for the job I'll do you");
Expect("9.14", "oh no i love her");
Expect("9.39", "what right has cresce to such a sky");
Expect("9.42", "shocking shade of green");
Expect("9.58", "shoulda saw that coming");

Expect("10.58", "awoke to gold");
Expect("10.71", "fealty after all rewards");
Expect("10.47", "Words and words and words");
Expect("10.68", "you expected your paper god");
Expect("10.161", "show them you've not forgotten us");

Expect("11.40", "unrelenting explosive fire");
Expect("11.88", "you're my cause");

Expect("12.58", "eccentric old charmers");

Expect("13.10", "spare me belt, dearheart");
Expect("13.44", "seldom competently installed");

Expect("14.96", "14.96");
Expect("14.98", "with the bird and the fish and the tree i was there");
Expect("14.123", "14.123");

Expect("15.29", "doubt is the field");
Expect("16.121", "habit attending children");
Expect("17.102", "did she really die today");

// Expect("10.58", "fish shape is best");

//failing, but should pass

function isPageNumberQuery(query: string): boolean {
  query = query.trim();
  let isPageNumber = false;
  isPageNumber = /^\d+(\.\d+)?$/.test(query);
  return isPageNumber;
}

async function Expect(targetPage: string, phrase: string) {
  test(`Query "${phrase}" finds ${targetPage}`, async () => {
    let pageNumber: string | null = null;

    if (isPageNumberQuery(phrase)) {
      pageNumber =
        indexer.allPageLines.find((line) => line.page === phrase)?.page ?? null;
    } else {
      const results = await indexer.searchIndex(phrase, 5);
      const target = results[0].doc;
      pageNumber = target?.page?.toString() ?? null;
    }

    expect(pageNumber).toBe(targetPage);
  });
}
