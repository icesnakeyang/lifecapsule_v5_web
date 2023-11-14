import React, {createContext, useEffect} from 'react';
import './App.css';
import {BrowserRouter} from "react-router-dom";
import Routers from './router/Index';
import {CssBaseline, ThemeProvider} from "@mui/material";
import {darkTheme, lightTheme, redTheme} from "./pages/common/Theme";
import {useSelector} from "react-redux";

function App() {
    const themeMode = useSelector((state: any) => state.commonSlice.themeMode)

    useEffect(() => {

    }, [themeMode])

    return (
        <BrowserRouter>
            <ThemeProvider theme={themeMode === 'light' ? lightTheme : themeMode === 'red' ? redTheme : darkTheme}>
                <CssBaseline/>
                <div className="App">
                    <Routers/>
                </div>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
