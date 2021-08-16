const find = require('../functions/findPage');

test('"climbing abattoir corpses" finds 7.82', () => {
  return find('climbing abattoir corpses').then(result => {
    expect(result.pageNumber).toBe('7.82');
  });
});