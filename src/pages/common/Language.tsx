import {Box, Button, Hidden, IconButton, Menu, MenuItem, Stack} from "@mui/material";
import React from "react";
import LanguageIcon from '@mui/icons-material/Language';
import {useDispatch, useSelector} from "react-redux";
import {useTheme} from "@mui/material/styles";
import i18n from "../../i18n";
import {saveLanguage} from "../../store/commonSlice";

const Language = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const language = useSelector((state: any) => state.commonSlice.language)
    const theme = useTheme()
    const dispatch = useDispatch()
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log(event.currentTarget)
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                // id="basic-button"
                // aria-controls={open ? 'basic-menu' : undefined}
                // aria-haspopup="true"
                // aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <LanguageIcon
                    sx={{fontSize: 24, color: theme.palette.primary.main}}/><span
                style={{
                    color: theme.palette.primary.main,
                    fontSize: 24
                }}>
                <Hidden mdDown>
                    <span style={{fontSize:16}}>
                {language}
                    </span>
                 </Hidden>
                </span>
            </IconButton>
            <Menu
                // id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    // 'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={() => {
                    console.log('change to english')
                    i18n.changeLanguage('en')
                    dispatch(saveLanguage('en'))
                    setAnchorEl(null);
                }}>English</MenuItem>
                <MenuItem onClick={() => {
                    console.log('设置为中文')
                    i18n.changeLanguage('zh')
                    dispatch(saveLanguage('zh'))
                    setAnchorEl(null);
                }}>中文</MenuItem>
            </Menu>
        </div>
    )
}
export default Language
