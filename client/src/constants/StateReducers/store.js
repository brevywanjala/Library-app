import { thunk } from 'redux-thunk';
import rootReducer from './rootReducer';
import { applyMiddleware, createStore } from '@reduxjs/toolkit';

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
