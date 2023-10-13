import {Button, Hidden, IconButton, Menu, MenuItem} from "@mui/material";
import React, {useState} from "react";
import PersonIcon from "@mui/icons-material/Person";
import {clearLoginData} from "../../store/loginSlice";
import {useTheme} from "@mui/material/styles";
import SettingsIcon from '@mui/icons-material/Settings';
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

const SettingBar = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const theme = useTheme()
    const {t} = useTranslation()
    const navigate = useNavigate()

    return (
        <div>
            <IconButton onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                navigate('/SettingPage')
            }}>
                <SettingsIcon
                    sx={{fontSize: 24, color: theme.palette.primary.main}}/>
                <span style={{
                    fontSize: 20,
                    color: theme.palette.primary.main
                }}>
                    <Hidden smDown>
                        <span style={{fontSize:16}}>
                        {t('nav.setting')}
                        </span>
                    </Hidden>
                </span>
            </IconButton>
        </div>
    )
}
export default SettingBar
