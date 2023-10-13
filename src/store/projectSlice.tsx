import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export const projectSlice = createSlice({
    name: "projectSlice",
    initialState: {
        projectList: [],
        currentProjectId: null,
        currentProjectName: null,
        freshCurrentProject: 0,
    },
    reducers: {
        saveProjectList: (state: any, action: any) => {
            state.projectList = action.payload;
        },
        saveCurrentProjectId: (state: any, action: any) => {
            state.currentProjectId = action.payload;
        },
        saveCurrentProjectName: (state: any, action: any) => {
            state.currentProjectName = action.payload;
        },
        clearCurrentProject: (state: any) => {
            state.currentProjectId = null
            state.currentProjectName = null
        }
    }
});

export const {
    saveProjectList,
    saveCurrentProjectId,
    saveCurrentProjectName,
    clearCurrentProject
} = projectSlice.actions;

export default projectSlice.reducer;
