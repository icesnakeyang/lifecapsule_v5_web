import {createSlice} from "@reduxjs/toolkit";

type Action1 = {
    payload: string
}
export const noteReceiveSlice = createSlice({
    name: "noteReceiveSlice",
    initialState: {
        sendLogId: ''
    },
    reducers: {
        saveSendLogId: (state: any, action: Action1) => {
            state.sendLogId = action.payload;
        }
    },
});

export const {
    saveSendLogId
} = noteReceiveSlice.actions;

export default noteReceiveSlice.reducer;
