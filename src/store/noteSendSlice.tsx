import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {SendNoteModel} from "../model/SendNoteModel";

type Action1 = {
    payload: string
}
type Action2 = {
    payload: number
}
export const noteSendSlice = createSlice({
    name: "noteSend",
    initialState: {
        receiveNoteList: [],
        totalReceiveNote: 0,
        totalReceiveNoteUnread: 0,
        totalSendNote: 0,
        totalSendNoteUnread: 0,
        receivePageIndex: 1,
        receivePageSize: 10,
        sendNoteList: [],
        sendPageIndex: 1,
        sendQuePageIndex: 1,
        sendPageSize: 10,
        sendQuePageSize: 10,
        sendNoteContent: '',
        sendNoteTitle: '',
        sendToName: '',
        sendToEmail: '',
        sendToUserCode: ''
    },
    reducers: {
        saveReceiveNoteList: (state: any, action: PayloadAction<number>) => {
            state.receiveNoteList = action.payload;
        },
        saveTotalReceiveNote: (state: any, action: any) => {
            state.totalReceiveNote = action.payload;
        },
        saveTotalReceiveNoteUnread: (state: any, action: any) => {
            state.totalReceiveNoteUnread = action.payload;
        },
        saveReceivePageIndex: (state: any, action: Action2) => {
            state.receivePageIndex = action.payload;
        },
        saveReceivePageSize: (state: any, action: any) => {
            state.receivePageSize = action.payload;
        },
        saveTotalSendNote: (state: any, action: any) => {
            state.totalSendNote = action.payload;
        },
        saveTotalSendNoteUnread: (state: any, action: any) => {
            state.totalSendNoteUnread = action.payload;
        },
        saveSendNoteList: (state: any, action: any) => {
            state.sendNoteList = action.payload;
        },
        saveSendPageIndex: (state: any, action: Action2) => {
            state.sendPageIndex = action.payload;
        },
        saveSendPageSize: (state: any, action: any) => {
            state.sendPageSize = action.payload;
        },
        saveSendNote: (state: any, action: PayloadAction<SendNoteModel>) => {
            state.sendNoteContent = action.payload.content
            state.sendNoteTitle = action.payload.title
        },
        saveSendToName: (state: any, action: Action1) => {
            state.sendToName = action.payload
        },
        saveSendToEmail: (state: any, action: PayloadAction<string>) => {
            state.sendToEmail = action.payload
        },
        saveSendNoteContent: (state: any, action: Action1) => {
            console.log(action)
            state.sendNoteContent = action.payload
        },
        saveSendNoteTitle: (state: any, action: Action1) => {
            state.sendNoteTitle = action.payload
        },
        saveSendQuePageIndex: (state: any, action: Action2) => {
            state.sendQuePageIndex = action.payload
        },
        saveSendQuePageSize: (state: any, action: any) => {
            state.sendQuePageSize = action.payload
        },
        clearSendData: (state: any) => {
            state.sendNoteTitle = ''
            state.sendNoteContent = ''
            state.sendToEmail = ''
            state.sendToName = ''
            state.fromName = ''
            state.sendToUserCode = ''
        },
        saveSendToUserCode: (state: any, action: Action1) => {
            state.sendToUserCode = action.payload
        }
    },
});

export const {
    saveReceiveNoteList,
    saveTotalReceiveNote,
    saveTotalReceiveNoteUnread,
    saveReceivePageIndex,
    saveReceivePageSize,
    saveTotalSendNote,
    saveTotalSendNoteUnread,
    saveSendNoteList,
    saveSendPageIndex,
    saveSendPageSize,
    saveSendNote,
    saveSendToName,
    saveSendToEmail,
    saveSendNoteContent,
    saveSendNoteTitle,
    saveSendQuePageIndex,
    saveSendQuePageSize,
    clearSendData,
    saveSendToUserCode
} = noteSendSlice.actions;

export default noteSendSlice.reducer;
