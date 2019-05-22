// replace this file with index.js
import React, { useState, useReducer } from 'react';
import { render } from 'react-dom';
import noctx from '../src/noctx';

const { setCtx, getCtx, useCtx } = noctx()

const countReducer = (state, action) => {
  switch (action.type) {
    case 'decrement':
      return state - 1
    default:
      return state
  }
}

function useCounter(initValue = 0) {
  const [counter, setCounter] = useState(initValue);
  const increment = () => setCounter(e => e + 1);
  return { counter, increment };
}

// function useCounterDispatch(initValue = 10) {
//   const [counter, dispatch] = useReducer(countReducer, initValue)
//   const decrement = useCallback(() => dispatch({ type: 'decrement' }), [])
//   return { counter, decrement };
// }
function useCounterDispatch(initValue = 10) {
  const [counter, dispatch] = useReducer(countReducer, initValue)
  return { counter, dispatch };
}

const Counter = setCtx('counter', useCounter);
const AnotherCounter = setCtx('anotherCounter', useCounter);
const CounterDispatch = setCtx('counterDispatch', useCounterDispatch);

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
  const { counter: counter2, increment: increment2 } = useCtx(Counter);
  console.log('AnotherCounterDisplay')
  return (
    <div>
      <p>Another Counter: {counter}</p>
      <button onClick={increment}>Another Counter Increment</button>
    </div>
  );
};

const ThirdCounterDisplay = () => {
  const [{ counter }, { counter: secCounter }] = getCtx(['counter', 'anotherCounter']);
  const { counter: counterDispatch } = getCtx('counterDispatch')
  console.log('ThirdCounterDisplay')
  return (
    <div>
      <p>1st Counter: {counter}</p>
      <p>2nd Counter: {secCounter}</p>
      <p>Counter Dispatch: {counterDispatch}</p>
    </div>
  );
};

const CounterDispatchDisplay = () => {
  const { dispatch } = getCtx('counterDispatch');
  console.log('CounterDispatch No!')
  return (
    <div>
      <button onClick={() => dispatch({ type: 'decrement' })}>Counter Dispatch Decrement</button>
    </div>
  );
};

function App() {
  return (
    <Counter.Provider>
      <AnotherCounter.Provider initValue={2}>
        <CounterDispatch.Provider>
          <div>
            <CounterDisplay />
            <AnotherCounterDisplay />
            <CounterDispatchDisplay/>
            <ThirdCounterDisplay />
          </div>
        </CounterDispatch.Provider>
      </AnotherCounter.Provider>
    </Counter.Provider>
  );
}

render(<App />, document.getElementById('root'));
