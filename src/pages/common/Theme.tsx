import {createTheme} from "@mui/material";

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#a800a8',
            dark: '#ca67ac',
            light: '#fff'
        },
        secondary: {
            main: '#685bee',
            dark: '#ffd857',
            light: '#000'
        },
        background: {
            default: '#f9f2cf'
        }
    },
})
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#f2f2f3',
            // dark: '#7ba8ff',
            // dark: '#4396e6',
            dark: '#4396e6',
            light: '#53e176'
        },
        secondary: {
            main: '#27cada',
            dark: '#966552',
            light: '#fff'
        },
        background:{
            default:'#011e38',
            paper:'#104259'
        }
    },
})

const redTheme = createTheme({
    palette: {
        primary: {
            main: '#bd0202',
            dark: '#a24132',
            light: '#53e176'
        },
        secondary: {
            main: '#f4e6c7',
            dark: '#966552',
            light: '#fff'
        },
        background:{
            default:'#d60a1f'
        }
    },
})
export {lightTheme, darkTheme, redTheme}

