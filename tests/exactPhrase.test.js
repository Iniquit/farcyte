import indexer from '../commands/indexer.js';

function Expect(phrase, targetPage) {
  test(`${phrase} finds ${targetPage}`, async () => {
    const result = await indexer.Find(phrase);
    expect(result[0].ref).toBe(targetPage);
  });
}

// currently passing
Expect('a reluctant escort', '1.1');
Expect('2.2', '2.2');
Expect('perplexing command', '2.31');
Expect('i will solve it', '7.83');
Expect('greatest wright in centuries', '7.87');
Expect('pig lead', '8.36');
Expect('but it was you i could tell', '8.38');
Expect('no one calls me sette like you call me mikaila', '8.37');
Expect('what job can you do for the job I\'ll do you', '9.13');
Expect('oh no i love her', '9.14');
Expect('shade of green', '9.42');
Expect('fealty after all rewards', '10.71');
Expect('unrelentin\' explosive fire', '11.40');
Expect('eccentric old charmers', '12.58');

// currently failing but should probably pass
Expect('only a da', '7.110');
Expect('you\'re my cause', '11.88');
