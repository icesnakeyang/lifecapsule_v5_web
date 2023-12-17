import {createSlice, PayloadAction} from "@reduxjs/toolkit";

type Action1={
    payload:number
}
export const procrastinationSlice = createSlice({
    name: "procrastinationSlice",
    initialState: {
        procrastinationPageIndex: 1,
        procrastinationPageSize: 10,
        procrastinationNoteId: null
    },
    reducers: {
        saveProcrastinationPageIndex: (state: any, action: Action1) => {
            state.procrastinationPageIndex = action.payload;
        },
        saveProcrastinationPageSize: (state: any, action: PayloadAction<number>) => {
            state.procrastinationPageSize = action.payload;
        },
        saveProcrastinationNoteId: (state: any, action: PayloadAction<string>) => {
            state.procrastinationNoteId = action.payload
        }
    },
});

export const {
    saveProcrastinationPageIndex,
    saveProcrastinationPageSize,
    saveProcrastinationNoteId
} = procrastinationSlice.actions;

export default procrastinationSlice.reducer;
