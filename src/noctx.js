import React from 'react';

const stores = {};

const msgInvalidKey = (key = 's') => `[noctx] Invalid key name(${key}) for getCtx()`;

function validateKey(key) {
  if (!key) throw new Error(msgInvalidKey());
  if (!stores[key]) throw new Error(msgInvalidKey(`unknown: "${key}"`));
  return stores[key];
}

export function setCtx(key, customHook) {
  const Context = React.createContext();

  function Provider({ initValue, children }) {
    const value = customHook(initValue);
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  // eslint-disable-next-line no-shadow
  function getCtx() {
    const value = React.useContext(Context);
    if (value === null) {
      throw new Error('[noctx] getCtx() should be called inside a Provider');
    }
    return value;
  }
  if (stores[key]) {
    throw new Error(msgInvalidKey(`duplicate: "${key}"`));
  }
  stores[key] = { Provider, getCtx };
  return stores[key];
}

export function getCtx(keys) {
  if (Array.isArray(keys)) {
    return keys.map(key => validateKey(key).getCtx());
  }
  return validateKey(keys).getCtx();
}

export function useCtx(store) {
  return store.getCtx();
}
