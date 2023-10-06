import {
    AppBar,
    Box,
    Container,
    Grid,
    IconButton,
    Menu, MenuItem,
    Paper,
    Stack,
    Toolbar,
    Typography,
    useMediaQuery
} from "@mui/material";
import TitleBox1 from "./TitleBox1";
import {useSelector} from "react-redux";
import Language from "./Language";
import {useTheme} from "@mui/material/styles";
import Userbar from './UserBar'
import DonateBar from "./DonateBar";
import MenuIcon from '@mui/icons-material/Menu'
import {useState} from "react";
import SettingBar from "./SettingBar";
import InboxBar from "./InboxBar";
import MyNoteBar from "./MyNoteBar";


const Header1 = () => {
    // const theme = useTheme().palette.primary
    const theme = useTheme();

    return (
        <Box sx={{height: 10}}>
            {/*<AppBar sx={{background: theme.palette.primary.main}}>*/}
            <AppBar sx={{background: theme.palette.background.default}}>
                <Toolbar>
                    <TitleBox1/>
                    <Box sx={{marginLeft: 'auto'}}>
                        <MyNoteBar/>
                    </Box>
                    <Box sx={{marginLeft: 'auto'}}>
                        <InboxBar/>
                    </Box>
                    <Box sx={{marginLeft: 'auto'}}>
                        <DonateBar/>
                    </Box>
                    <Box sx={{marginLeft: 'auto'}}>
                        <Userbar/>
                    </Box>
                    <Box sx={{marginLeft: 'auto'}}>
                        <Language/>
                    </Box>
                    <Box sx={{marginLeft: 'auto'}}>
                        <SettingBar/>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    )
}
export default Header1
