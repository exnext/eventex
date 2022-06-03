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

    eventex.emit('unit-test');

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

  test('result for emit', () => {
    new Eventex()
      .on('unit-test', (data) => {
        return ++data;
      })
      .emit('unit-test', 1)
      .then(([result]) => {
        expect(result).toBe(2);
      });
  });

  test('rejected result for emit', () => {
    new Eventex()
      .on('unit-test', (data) => {
        return Promise.reject(--data);
      })
      .emit('unit-test', 1)
      .catch((error) => {
        expect(0).toBe(0);
      });
  });

  test('1st generics', () => {
    interface Value {
      value: number;
    };

    new Eventex()
      .on<Value>('unit-test', (data: Value) => {
        return ++data.value;
      })
      .emit<Value>('unit-test', {value: 1})
      .then(([result]) => {
        expect(result).toBe(2);
      });
  });

  test('2nd generics', () => {
    interface Value {
      value: number;
    };

    interface Result {
      result: number;
    };

    new Eventex()
      .on<Value, Result>('unit-test', (data: Value) => {
        return {
          result: ++data.value
        };
      })
      .emit<Value, Result>('unit-test', {value: 1})
      .then(([result]) => {
        expect(result.result).toBe(2);
      });
  });

  test('1st result for emitInSeries', () => {
    new Eventex()
      .on('unit-test', (data) => {
        return ++data;
      })
      .emitInSeries('unit-test', 1)
      .then((result) => {
        expect(result).toBe(2);
      });
  });

  test('2nd result for emitInSeries', () => {
    new Eventex()
      .on('unit-test', (data) => {
        return ++data;
      })
      .on('unit-test', (data) => {
        return ++data;
      })
      .emitInSeries('unit-test', 1)
      .then((result) => {
        expect(result).toBe(2);
      });
  });

  test('3rd result for emitInSeries', () => {
    new Eventex()
      .on('unit-test', (data) => {
        return ++data;
      })
      .on('unit-test', (data, control) => {
        return ++data + control?.prevoiusResult;
      })
      .emitInSeries('unit-test', 1)
      .then((result) => {
        expect(result).toBe(4);
      });
  });

  test('4th result for emitInSeries', () => {
    new Eventex()
      .on('unit-test', (data, control) => {
        if (control) {
          control.handle = true;
        }
        
        return ++data;
      })
      .on('unit-test', (data, control) => {
        return ++data + control?.prevoiusResult;
      })
      .emitInSeries('unit-test', 1)
      .then((result) => {
        expect(result).toBe(2);
      });
  });
});