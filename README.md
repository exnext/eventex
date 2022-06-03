# eventex

The engine of a simple events manager, without any space technology and too much source code. There are a lot of similar on the Internet, but We are going to use it with our projects, so We will have to keep it in a good condition. We have gvaranty, that it will allways work. Wa are able to fix any problem in it.

## NPM

```bash
npm install @exnext/eventex
```

## Methods

```typescript
interface CallbackControl<T = any> {
    prevoiusResult?: T;
    handle: boolean;
}

declare type EventexCallback<T = any, K = any> = (data: T, control?: CallbackControl<K>) => K;
```

`control` parameter of `EventexCallback` is transmitted only by `emitInSeries`

```typescript
class Eventex {
    /* Adding a new event to a queue that will be executed after every calling emit method */
    on<T = any, K = any>(name: string, callback: EventexCallback<T, K>): this;
    
    /* Adding a new event to a queue that will be executed only once after calling emit method */
    once<T = any, K = any>(name: string, callback: EventexCallback<T, K>): this;
    
    /* Removing event from a queue */
    off<T = any, K = any>(name: string, callback?: EventexCallback<T, K>): this;
    
    /* Checking if the event exists */
    some(name: string): boolean;
    
    /* Executing events with data */
    emit<T = any, K = any>(name: string, data?: T): Promise<Awaited<K>[]>;

    /* Executing events in series with data */
    emitInSeries<T = any, K = any>(name: string, data?: T): Promise<K[]>;
}
```

## Initialization

```html
<script type='text/javascript' src='eventex.js'></script>
```

or

```js
import { Eventex } from '@exnext/eventex';
```

## Example usage 1

```js
let eventex = new Eventex();

eventex.on('demo', (data) => {
    console.log(data);
});

eventex.emit('demo', { name: 'exnext' });
```

## Example usage 2

```js
class MyClass extends Eventex {
    constructor() {
        super();
    }

    doSomething() {

        //bla bla bla

        this.emit('done', BlaBlaBlaResult);
    }
}

let myClass = new MyClass();

myClass.on('done', (data) => {
    console.log(data);
});

myClass.doSomething();
```

## Example usage 3

```js
class MyClass extends Eventex {
    constructor() {
        super();
    }

    doSomething() {
        
        //bla bla bla

        this.emit('done', BlaBlaBlaResult)
            .then((result) => {
                console.log(result);
            })
            .catch((error) => {
                console.error(error);
            });
    }
}

let myClass = new MyClass();

myClass.on('done', (data) => {
    switch(data) {
        case some_value_1: return Promise.resolve(some_result_1);
        case some_value_2: return Promise.reject(some_error);
        case some_value_3: return some_result_2;
        default: return;
    }
});

myClass.doSomething();
```

## Example usage 4

```js
new Eventex()
    .on('demo', (data) => 1 * data)
    .on('demo', (data) => 2 * data)
    .on('demo', (data) => 3 * data)
    .emit('demo', 1)
    .then((results) => {
        console.log(results); // [1, 2, 3]
    });
```

## Example usage 5

```js
new Eventex()
    .on('demo', (data) => 1 * data)
    .on('demo', (data) => 2 * data)
    .on('demo', (data) => 3 * data)
    .emitInSeries('demo', 1)
    .then((results) => {
        console.log(results); // [1, 2, 3]
    });
```

## Example usage 6

```js
new Eventex()
    .on('demo', (data) => 1 * data)
    .on('demo', (data, control) => {
        control.handle = true;
        return 2 * data;
    })
    .on('demo', (data) => 3 * data)
    .emitInSeries('demo', 1)
    .then((results) => {
        console.log(results); // [1, 2]
    });
```

## Example usage 7

```typescript
interface Value {
    value: number;
};

new Eventex()
    .on<Value>('demo', (data: Value) => {
        return ++data.value;
    })
    .emit<Value>('demo', {value: 1})
    .then((results) => {
        console.log(results); // [2]
    });
```

## Example usage 8

```typescript
interface Value {
    value: number;
};

interface Result {
    result: number;
};

new Eventex()
    .on<Value, Result>('demo', (data: Value) => {
        return {
            result: ++data.value
        };
    })
    .emit<Value, Result>('demo', {value: 1})
    .then((results) => {
        console.log(results); // [{result: 2}]
    });
```