import { configureStore } from "@reduxjs/toolkit";
import  storeReducer  from './storeSlice';
import  registerReducer  from './registerSlice';

// import { loadState, saveState } from './localStorage';

// const persistState = loadState();

const rootReducer = {
  store: storeReducer,
  register: registerReducer,
}

const store = configureStore({
    reducer: rootReducer,
    // preloadedState: persistState
});

// store.subscribe(() => {
//   saveState(store.getState());
// })

export default store;