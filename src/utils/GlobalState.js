import { createContext, useReducer, useContext } from 'react';
import { reducer } from './reducer';

const Context = createContext();

const initialState = {
    book:null,
    member:null,
    loading: true,
};

export function GlobalProvider({ children }) {
  const contextValue = useReducer(reducer, initialState);
  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

export function useStateGlobal() {
  const contextValue = useContext(Context);
  return contextValue;
}
