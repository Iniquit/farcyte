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

test('"but it was you i could tell" finds 8.38', () => {
  return find('but it was you i could tell').then(result => {
    expect(result.pageNumber).toBe('8.38');
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


test('"shade of green" finds 9.42', () => {
  return find('shade of green').then(result => {
    expect(result.pageNumber).toBe('9.42');
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