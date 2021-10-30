const find = require('../functions/findPage');

test('"a reluctant escort" finds 1.1', () => {
  return find('a reluctant escort').then(result => {
    expect(result.pageNumber).toBe('1.1');
  });
});

test('"2.2" finds 2.2', () => {
  return find('2.2').then(result => {
    expect(result.pageNumber).toBe('2.2');
  });
});

test('"perplexing command" finds 2.31', () => {
  return find('perplexing command').then(result => {
    expect(result.pageNumber).toBe('2.31');
  });
});

test('"i will solve it" finds 7.83', () => {
  return find('i will solve it').then(result => {
    expect(result.pageNumber).toBe('7.83');
  });
});


test('"greatest wright in centuries" finds 7.87', () => {
  return find('greatest wright in centuries').then(result => {
    expect(result.pageNumber).toBe('7.87');
  });
});

test('"fuck him and fuck you" finds 7.102', () => {
  return find('fuck him and fuck you').then(result => {
    expect(result.pageNumber).toBe('7.102');
  });
});

test('"only a da" finds 7.110', () => {
  return find('only a da').then(result => {
    expect(result.pageNumber).toBe('7.110');
  });
});

test('"pig lead" finds 8.36', () => {
  return find('pig lead').then(result => {
    expect(result.pageNumber).toBe('8.36');
  });
});

test('"but it was you i could tell" finds 8.38', () => {
  return find('but it was you i could tell').then(result => {
    expect(result.pageNumber).toBe('8.38');
  });
});

test('"no one call me sette like you call me mikaila" finds 8.37', () => {
  return find('no one call me sette like you call me mikaila').then(result => {
    expect(result.pageNumber).toBe('8.37');
  });
});

test('"what job can you do for the job I\'ll do you" finds 9.13', () => {
  return find('what job can you do for the job I\'ll do you').then(result => {
    expect(result.pageNumber).toBe('9.13');
  });
});

test('"oh no i love her" finds 9.14', () => {
  return find('oh no i love her').then(result => {
    expect(result.pageNumber).toBe('9.14');
  });
});

test('"didn\'t she drop a polley on your head?" finds 9.14', () => {
  return find('didn\'t she drop a polley on your head?').then(result => {
    expect(result.pageNumber).toBe('9.14');
  });
});


test('"shade of green" finds 9.42', () => {
  return find('shade of green').then(result => {
    expect(result.pageNumber).toBe('9.42');
  });
});

test('"fealty after all rewards" finds 10.71', () => {
  return find('fealty after all rewards').then(result => {
    expect(result.pageNumber).toBe('10.71');
  });
});

test('"unrelenting explosive fire" finds 11.40', () => {
  return find('unrelenting explosive fire').then(result => {
    expect(result.pageNumber).toBe('11.40');
  });
}); 

test('"you\'re my cause" finds 11.88', () => {
  return find('you\'re my cause').then(result => {
    expect(result.pageNumber).toBe('11.88');
  });
});

test('"eccentric old charmer" finds 12.58', () => {
  return find('eccentric old charmer').then(result => {
    expect(result.pageNumber).toBe('12.58');
  });
});


//fuzzy

test('"climbing abattoir corpses" finds 7.82', () => {
  return find('climbing abattoir corpses').then(result => {
    expect(result.pageNumber).toBe('7.82');
  });
});


test('"fate defy Sette Frummagem" finds 10.164', () => {
  return find('fate defy Sette Frummagem').then(result => {
    expect(result.pageNumber).toBe('10.164');
  });
});