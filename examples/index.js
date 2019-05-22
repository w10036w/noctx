import React, { useState, useReducer } from 'react';
import { render } from 'react-dom';
import noctx from '../src/noctx';

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
