# `noctx`

> tiny react@^16.8.0 context/state manager

## Install

```sh
npm install --save noctx
```

## Notable Credits

HIGHLY inspired by [unstated-next](https://github.com/jamiebuilds/unstated-next)

## Example

### Basic (setCtx, getCtx)

```js
import React, { useState } from "react";
import { render } from "react-dom";
import { setCtx, getCtx } from "noctx";

function useCounter(initState = 0) {
  const [counter, setCounter] = useState(initState);
  const increment = () => setCounter(e => e + 1);
  return { counter, increment };
}

const CounterDisplay = () => {
  const { counter, increment } = getCtx("counter");
  return (
    <div>
      <p>Counter: {counter}</p>
      <button onClick={increment}>Counter Increment</button>
    </div>
  );
};

function App() {
  return (
    <Counter.Provider>
      <CounterDisplay />
    </Counter.Provider>
  );
}

render(<App />, document.getElementById("root"));
```

### Full (setCtx, getCtx, useCtx)

> `./examples/index.js`

```js
import React, { useState } from "react";
import { render } from "react-dom";
import { setCtx, getCtx, useCtx } from "noctx";

function useCounter(initState = 0) {
  const [counter, setCounter] = useState(initState);
  const increment = () => setCounter(e => e + 1);
  return { counter, increment };
}

const Counter = setCtx("counter", useCounter);
const AnotherCounter = setCtx("anotherCounter", useCounter);

const CounterDisplay = () => {
  const { counter, increment } = getCtx("counter");
  return (
    <div>
      <p>Counter: {counter}</p>
      <button onClick={increment}>Counter Increment</button>
    </div>
  );
};

const AnotherCounterDisplay = () => {
  const { counter, increment } = useCtx(AnotherCounter);
  return (
    <div>
      <p>Another Counter: {counter}</p>
      <button onClick={increment}>Another Counter Increment</button>
    </div>
  );
};

const ThirdCounterDisplay = () => {
  const [{ counter }, { counter: secCounter }] = getCtx(["counter", "anotherCounter"]);
  return (
    <div>
      <p>1st Counter: {counter}</p>
      <p>2nd Counter: {secCounter}</p>
    </div>
  );
};

function App() {
  return (
    <Counter.Provider>
      <AnotherCounter.Provider initValue={2}>
        <div>
          <CounterDisplay />
          <AnotherCounterDisplay />
          <ThirdCounterDisplay />
        </div>
      </AnotherCounter.Provider>
    </Counter.Provider>
  );
}

render(<App />, document.getElementById("root"));
```

## Todo

- [ ] use typescript
- [ ] add test case