import {Hidden, IconButton} from "@mui/material";
import React from "react";
import SourceIcon from '@mui/icons-material/Source';
import {useNavigate} from "react-router-dom";
import {useTheme} from "@mui/material/styles";
import {useTranslation} from "react-i18next";

const MyNoteBar = () => {
    const navigate = useNavigate()
    const theme = useTheme()
    const {t} = useTranslation()
    return (
        <IconButton onClick={() => {
            navigate('/NoteList')
        }}>

            <SourceIcon color="primary"/>

            <Hidden mdDown>
                <span style={{color: theme.palette.primary.main,fontSize:16}}>{t('nav.myNote')}</span>
            </Hidden>
        </IconButton>
    )
}
export default MyNoteBar
