import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface NoteEditInterface {
    noteTitle: string
    noteContent: string
    isChanged: boolean
}

const initialState: NoteEditInterface = {
    noteTitle: '',
    noteContent: '',
    isChanged: false
}
export const noteEditSlice = createSlice({
    name: 'loginSlice',
    initialState,
    reducers: {
        saveNoteTitle: (state: any, action: PayloadAction<string>) => {
            state.noteTitle = action.payload
        },
        saveNoteContent: (state: any, action: PayloadAction<string>) => {
            state.noteContent = action.payload
        },
        saveIsChanged: (state: any, action: PayloadAction<boolean>) => {
            state.isChanged = action.payload
        },
        clearNoteEdit: (state: any) => {
            state.noteTitle = ''
            state.noteContent = ''
            state.isChanged = false
        }
    }
})

export const {
    saveNoteTitle,
    saveNoteContent,
    clearNoteEdit,
    saveIsChanged
} = noteEditSlice.actions

export default noteEditSlice.reducer
