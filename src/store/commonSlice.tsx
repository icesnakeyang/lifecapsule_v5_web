import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Theme} from "@mui/material";

type Action1 = {
    payload: string
}
export const commonSlice = createSlice({
    name: "common",
    initialState: {
        editing: 0,
        tempId: -1,
        refresh: 0,
        language: 'en',
        doNotLoadTodoTask: false,
        themeMode: 'light'
    },
    reducers: {
        saveEditing: (state: any, action: PayloadAction<number>) => {
            state.editing = action.payload;
        },
        saveTempId: (state: any, action: any) => {
            state.tempId = action.payload;
        },
        loadRefresh: (state: any) => {
            state.refresh += 1;
        },
        clearRefresh: (state: any) => {
            state.refresh = 0;
        },
        clearCommonState: (state: any) => {
            state.editing = 0;
            state.loadData = false;
            state.tempId = -1;
            state.refresh = 0;
        },
        saveLanguage: (state: any, action: Action1) => {
            state.language = action.payload
        },
        saveDoNotLoadToDoTask: (state: any, action: any) => {
            state.doNotLoadTodoTask = action.payload
        },
        saveThemeMode: (state: any, action: Action1) => {
            state.themeMode = action.payload
        }
    },
});

export const {
    saveEditing,
    loadRefresh,
    clearRefresh,
    saveLanguage,
    clearCommonState,
    saveDoNotLoadToDoTask,
    saveThemeMode
} = commonSlice.actions;

export default commonSlice.reducer;
