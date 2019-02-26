import requiredParam from '../requiredParam';

test('throws a required parameter error', () => {
  expect(() => {
    requiredParam('id');
  }).toThrowError();
});

test('has error status 400 as default value', () => {
  try {
    requiredParam('id');
    expect(true).toBe(false);
  } catch (e) {
    expect(e.status).toBe(400);
  }
});

test('allows to override error status', () => {
  try {
    requiredParam('id', 500);
    expect(true).toBe(false);
  } catch (e) {
    expect(e.status).toBe(500);
  }
});
