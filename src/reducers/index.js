import {combineReducers} from 'redux';
import { searchReducer } from './filterCourse';
import authReducer from './authReducer';

const allReducer = combineReducers({
    searchReducer,
    authReducer
});

export default allReducer;