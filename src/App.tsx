import React, {useEffect} from 'react';
import './App.css';
import {BrowserRouter} from "react-router-dom";
import Routers from './router/Index';
import {CssBaseline, ThemeProvider} from "@mui/material";
import {darkTheme, lightTheme, redTheme} from "./pages/common/Theme";
import {useDispatch, useSelector} from "react-redux";

function App() {
    const themeMode = useSelector((state: any) => state.commonSlice.themeMode)

    useEffect(() => {
        console.log('主题颜色改变了')
        console.log(themeMode)

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
