// src/store.js
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import authAdminReducer from '../reducers/authAdminReducer';
import authClientReducer from "../reducers/authClientReducer";
import { searchReducer } from '../reducers/filterCourse';

// Kết hợp nhiều reducer (nếu có thể bạn có thêm userReducer, courseReducer,...)
const rootReducer = combineReducers({
  authAdminReducer,
  searchReducer,
  authClientReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
