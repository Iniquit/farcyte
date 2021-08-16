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

test('"only a da" finds 7.110', () => {
  return find('only a da').then(result => {
    expect(result.pageNumber).toBe('7.110');
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