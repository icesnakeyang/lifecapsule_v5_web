import {createSlice} from "@reduxjs/toolkit";

type Action1 = {
    payload: string
}

type Action2 = {
    payload: number
}

export const noteDataSlice = createSlice({
    name: "noteData",
    initialState: {
        totalNote: 0,
        notePageIndex: 1,
        notePageSize: 10,
        noteList: [],
        tagList: [],
        noteListTags: [],
        noteId: null,
        noteListSearchKey: null,
        triggerId: null
    },
    reducers: {
        saveTotalNote: (state: any, action: any) => {
            state.totalNote = action.payload;
        },
        saveNotePageIndex: (state: any, action: Action2) => {
            state.notePageIndex = action.payload;
        },
        saveNotePageSize: (state: any, action: any) => {
            state.notePageSize = action.payload;
        },
        saveNoteList: (state: any, action: any) => {
            state.noteList = action.payload;
        },
        clearNoteState: (state: any) => {
            state.totalNote = 0;
            state.notePageIndex = 1;
            state.notePageSize = 10;
            state.noteList = [];
            state.noteId = null
            state.tagList = []
            state.noteListTags = []
        },
        saveTagList: (state: any, action: any) => {
            state.tagList = action.payload
        },
        saveNoteListTags: (state: any, action: any) => {
            state.noteListTags = action.payload
        },
        saveNoteId: (state: any, action: Action1) => {
            state.noteId = action.payload
        },
        saveNoteListSearchKey: (state: any, action: Action1) => {
            state.noteListSearchKey = action.payload
        },
        clearNoteListSearchKey: (state: any) => {
            state.noteListSearchKey = null
        },
        saveTriggerId: (state: any, action: Action1) => {
            state.triggerId = action.payload
        },
        clearTriggerId: (state: any) => {
            state.triggerId = null
        }
    },
});

export const {
    saveTotalNote,
    saveNotePageIndex,
    saveNotePageSize,
    saveNoteList,
    clearNoteState,
    saveTagList,
    saveNoteListTags,
    saveNoteId,
    clearNoteListSearchKey,
    saveNoteListSearchKey,
    saveTriggerId,
    clearTriggerId
} = noteDataSlice.actions;
export default noteDataSlice.reducer;
