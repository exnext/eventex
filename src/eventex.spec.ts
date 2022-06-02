import { Eventex } from './eventex';

describe('testing of a simple Eventex class', () => {
  test('added event', () => {
    let some: boolean = new Eventex()
      .on('unit-test', (data) => { })
      .some('unit-test');

    expect(some).toBe(true);
  });

  test('removed event', () => {
    let some: boolean = new Eventex()
      .on('unit-test', () => { })
      .off('unit-test')
      .some('unit-test');

    expect(some).toBe(false);
  });

  test('executed once event', () => {
    let eventex: Eventex = new Eventex()
      .once('unit-test', (data) => { });

    eventex.emit('unit-test')

    let some: boolean = eventex.some('unit-test');

    expect(some).toBe(false);
  });

  test('emit data to on', () => {
    new Eventex()
      .on('unit-test', (data) => {
        expect(data).toBe(1);
      })
      .emit('unit-test', 1);
  });

  test('emit data to once', () => {
    new Eventex()
      .once('unit-test', (data) => {
        expect(data).toBe(1);
      })
      .emit('unit-test', 1);
  });
});