import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {LoginModel} from "../model/LoginModel";


type Action2 = {
    payload: string
}
type Action3 = {
    payload: number
}
type Action4 = {
    payload: boolean
}
export const loginSlice = createSlice({
    name: 'loginSlice',
    initialState: {
        token: null,
        userName: null,
        nickname: null,
        timerPrimary: null,
        loginName: null,
        email: null,
        userStatus: null
    },
    reducers: {
        saveLoginData: (state: any, action: PayloadAction<LoginModel>) => {
            state.token = action.payload.token
            state.timerPrimary = action.payload.timerPrimary
            state.nickname = action.payload.nickname
            state.loginName = action.payload.loginName
            state.userStatus = action.payload.userStatus
        },
        clearLoginData: (state: any) => {
            state.token = null
            state.userName = null
            state.nickname = null
            state.timerPrimary = null
            state.loginName = null
            state.email = null
        },
        saveLoginToken: (state: any, action: Action2) => {
            state.token = action.payload
        },
        saveTimerPrimary: (state: any, action: any) => {
            state.timerPrimary = action.payload
        },
        saveNickname: (state: any, action: Action2) => {
            state.nickname = action.payload
        },
        saveUserEmail: (state: any, action: Action2) => {
            state.email = action.payload
        },
        saveUserLoginName: (state: any, action: Action2) => {
            state.loginName = action.payload
        }
    }
})

export const {
    saveLoginData,
    clearLoginData,
    saveLoginToken,
    saveTimerPrimary,
    saveNickname,
    saveUserEmail,
    saveUserLoginName
} = loginSlice.actions

export default loginSlice.reducer
