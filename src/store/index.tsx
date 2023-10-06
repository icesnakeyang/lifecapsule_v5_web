import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {persistReducer, persistStore} from 'redux-persist'
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import loginSlice from "./loginSlice";
import noteSendSlice from "./noteSendSlice";
import commonSlice from "./commonSlice";
import noteDataSlice from "./noteDataSlice";
import tagSlice from "./tagSlice";
import noteReceiveSlice from "./noteReceiveSlice";

const persistConfig = {
    key: 'root',
    storage
}

const rootReducer = combineReducers({
    loginSlice,
    noteSendSlice,
    commonSlice,
    noteDataSlice,
    tagSlice,
    noteReceiveSlice
})
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk]
})

export const persistor = persistStore(store)
