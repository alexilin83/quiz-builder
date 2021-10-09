import { combineReducers } from "redux";
import quizesReducer from "./features/quizes/quizesSlice";

const rootReducer = combineReducers({
    quizes: quizesReducer
});

export default rootReducer;