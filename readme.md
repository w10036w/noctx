# `noctx`

> tiny react@^16.8.0 context/state manager

## Install

```sh
npm install --save noctx
```

## Pros

- concise api: `getCtx()`, `setCtx()`, `useCtx()`, `initValue`, check full examples.
- think in hooks

## Example

### Basic (setCtx, getCtx)

```js
import React, { useState } from "react";
import { render } from "react-dom";
import noctx from "noctx";

const { setCtx, getCtx } = noctx()

function useCounter(initState = 0) {
  const [counter, setCounter] = useState(initState);
  const increment = () => setCounter(e => e + 1);
  return { counter, increment };
}

const Counter = setCtx("counter", useCounter);

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
import React, { useState, useReducer } from 'react';
import { render } from 'react-dom';
import noctx from 'noctx';

const { setCtx, getCtx, useCtx } = noctx()

function useCounter(initValue = 0) {
  const [counter, setCounter] = useState(initValue);
  const increment = () => setCounter(e => e + 1);
  return { counter, increment };
}

// you can use immer.js if preferred
// you can add payload if any
const thirdCounterReducer = (state, action) => {
  switch (action.type) {
    case 'decrement':
      return { ...state, number: state.number - 1 }
    case 'increment':
      return { ...state, number: state.number + 1 }
    default:
      return state
  }
}
function useThirdCounter(initValue) {
  const initState = initValue || { number: 0 }
  const [state, dispatch] = useReducer(thirdCounterReducer, initState);
  return [state, dispatch]
}

const Counter = setCtx('counter', useCounter);
const AnotherCounter = setCtx('anotherCounter', useCounter);
const ThirdCounter = setCtx('thirdCounter', useThirdCounter);

const CounterDisplay = () => {
  const { counter, increment } = getCtx('counter');
  console.log('CounterDisplay')
  return (
    <div>
      <p>Counter: {counter}</p>
      <button onClick={increment}>Counter Increment</button>
    </div>
  );
};

const AnotherCounterDisplay = () => {
  const { counter, increment } = useCtx(AnotherCounter);
  // if uncomment this line, it will be rerendered if counter in CounterDisplay changes
  // const { counter: counter2, increment: increment2 } = useCtx(Counter);
  console.log('AnotherCounterDisplay')
  return (
    <div>
      <p>Another Counter: {counter}</p>
      <button onClick={increment}>Another Counter Increment</button>
    </div>
  );
};

const ThirdCounterDisplay = () => {
  const [[,dispatch]] = getCtx(['thirdCounter']);
  console.log('ThirdCounterDisplay')
  return (
    <div>
      <button onClick={() => dispatch({ type: 'increment' })}>3rd Counter Increment</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>3rd Counter Decrement</button>
    </div>
  );
};

const AllCounterDisplay = () => {
  const [
    { counter }, 
    { counter: secCounter }, 
    [ThirdCounterState]
  ] = getCtx(['counter', 'anotherCounter', 'thirdCounter']);
  console.log('AllCounterDisplay')
  return (
    <div>
      <p>1st Counter: {counter}</p>
      <p>2nd Counter: {secCounter}</p>
      <p>3rd Counter: {ThirdCounterState.number}</p>
    </div>
  );
};

function App() {
  return (
    <Counter.Provider>
      <AnotherCounter.Provider initValue={2}>
        <ThirdCounter.Provider>
          <div>
            <CounterDisplay />
            <AnotherCounterDisplay />
            <AllCounterDisplay />
            <ThirdCounterDisplay />
          </div>
        </ThirdCounter.Provider>
      </AnotherCounter.Provider>
    </Counter.Provider>
  );
}

render(<App />, document.getElementById('root'));
```

### Best Practice

1. The component with `getCtx('counter')` is always updated within the component state changes **regardless the context value is changed or not**. The reason is [here](https://github.com/kentcdodds/ama/issues/673#issuecomment-486907432) and example is [sandbox](https://codesandbox.io/s/xj5p774ywz).
  
    - if you add some local state changes (e.g. add a setState `[toggle, setToggle]` inside `CounterDisplay`, it will be fully rerendered when you setToggle, unless you isolate the logic and use **useMemo** and **memo** at the same time, refer to [the sandbox above](https://codesandbox.io/s/xj5p774ywz)
    - in the full example above, if the button "Counter Increment" is clicked, the `CounterDisplay` and `ThirdCounterDisplay` will be updated since they are referring to context 'counter'
    - As of now based on the discussion and practice, **the best way** to avoid rerendering is to isolate components only with their minimum necessary state / context, so they will not affect each other if non-shared state is changed. Here is the support article: [mobx: react-performance](https://mobx.js.org/best/react-performance.html)
    - if you add `getCtx('counter')` or `useCtx(Counter)` in `AnotherCounterDisplay` but **do not use it**, after click the button "Counter Increment", all 3 components are **still** rerendered.
    - in additional, refer to [this answer](https://github.com/jamiebuilds/unstated-next/issues/25#issuecomment-493737782)
    - to track the provider value, refer to [this](https://github.com/jamiebuilds/unstated-next/issues/21#issuecomment-493579227)

2. If you prefer to combine the dependency states, you need to refer to the [the sandbox above](https://codesandbox.io/s/xj5p774ywz), use **useMemo** and **memo** at the same time
3. There might be some potential solution based on [this](https://github.com/facebook/react/issues/15156#issuecomment-474590693)
4. Known downside: there is no server-side rendering support as of now.
5. [proposal of useReducer](https://codesandbox.io/s/62x70vljkn): result is: useReducer will not prevent rerendering, see codes in full example; The reason in this sandbox dispatch does not trigger rerender is: it actaully spilts State.Provider and Dispatch.Provider. This trick may be helpful for those are intersted, but will not be accepted until there is a more efficient way.

## Todo

- [ ] https://github.com/slorber/react-async-hook
- [ ] https://github.com/slorber/awesome-debounce-promise
- [ ] https://github.com/Andarist/use-constant
- [ ] https://nikgraf.github.io/react-hooks/
- [ ] use typescript
- [ ] add test case

## Notable Credits

HIGHLY inspired by [unstated-next](https://github.com/jamiebuilds/unstated-next)