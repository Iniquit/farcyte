import { Indexer } from "../src/functions/indexer";

const indexer = new Indexer();

function Expect(phrase: string, targetPage: string) {
  test(`Query "${phrase}" finds ${targetPage}`, async () => {
    const results = await indexer.searchIndex(phrase, 5);
    const target = results[0].doc;
    const pageNumber = target?.page ?? null;
    expect(pageNumber).toBe(targetPage);
  });
}

// currently passing
Expect("perplexing command", "2.31");
Expect("pig lead", "8.36");
Expect("but it was you i could tell", "8.38");
Expect("no one ever calls me sette the way ya call me mikaila", "8.37");
Expect("what job can you do for the job I'll do you", "9.13");
Expect("oh no i love her", "9.14");
Expect("shocking shade of green", "9.42");
Expect("fealty after all rewards", "10.71");
Expect("doubt is the field", "15.29");
Expect("unrelenting explosive fire", "11.40");
Expect("eccentric old charmers", "12.58");
Expect("habit attending children", "16.121");
Expect("awoke to gold", "10.58");
Expect("seldom competently installed", "13.44");
Expect("i don't know what that means but it does sound impressive", "7.73");
Expect("fish shape is best", "10.58");
Expect("spare me belt, dearheart", "13.10");
Expect("Words and words and words", "10.47");
Expect("you expected your paper god", "10.68");
Expect("eat tree", "5.12");
Expect("14.96", "14.96");
Expect("14.123", "14.123");

//failing, but should pass
Expect("you're my cause", "11.88");
Expect("a reluctant escort", "1.0");
Expect("2.2", "2.2");
Expect("best wright in centuries", "7.87");
