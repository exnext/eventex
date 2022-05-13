# eventex

An engine of a simple events manager, without any space technology and too much source code. There are a lot of similar on the Internet, but We are going to use it with our projecs, so We will have to keep it in good condition. We have gvaranty, that it will allways work. Wa are able to fix any problem in it.

## NPM

```bash
npm install @exnext/eventex
```

## Methods

```typescript
type EventexCallback = (data: any) => any;

class Eventex {
    /* Adding a new event to a queue that will be executed after every calling emit method */
    on(name: string, callback: EventexCallback): void;
    
    /* Adding a new event to a queue that will be executed only once after calling emit method */
    once(name: string, callback: EventexCallback): void;
    
    /* Removing event from a queue */
    off(name: string, callback: EventexCallback): void;
    
    /* Checking if the event exists */
    some(name: string): boolean;
    
    /* Executing events with data */
    emit(name: string, data: any): Promise<any>;
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

## Example use 1

```js
let eventex = new Eventex();

eventex.on('demo', (data) => {
    console.log(data);
});

eventex.emit('demo', { name: 'exnext' });
```

## Example use 2

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

## Example use 3

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