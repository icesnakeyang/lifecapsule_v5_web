import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {TagModel} from "../model/TagModel";

export const tagSlice = createSlice({
    name: "tagSlice",
    initialState: {
        //笔记当前保存的标签
        noteTags: [],
        //推荐的标签
        hotTags: [],
        //当前正在编辑的标签
        editTags: [],
        //我的所有使用过的笔记标签
        myAllNoteTags: []
    },
    reducers: {
        saveEditTags: (state: any, action: PayloadAction<TagModel[]>) => {
            console.log(action)
            state.editTags = action.payload
        },
        saveHotTags: (state: any, action: PayloadAction<TagModel[]>) => {
            state.hotTags = action.payload
        },
        saveMyAllNoteTags: (state: any, action: any) => {
            state.myAllNoteTags = action.payload
        },
        clearAllTags: (state: any) => {
            state.noteTags = [];
            state.hotTags = [];
            state.editTags = [];
            state.myAllNoteTags = []
        },
    },
});

export const {
    saveEditTags,
    saveHotTags,
    saveMyAllNoteTags,
    clearAllTags,
} = tagSlice.actions;

export default tagSlice.reducer;
