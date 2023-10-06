import {useTheme} from "@mui/material/styles";
import {Badge, Hidden, IconButton} from "@mui/material";
import MailIcon from '@mui/icons-material/Mail';
import React from "react";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import MyReceiveNoteList from "../receiveNote/MyReceiveNoteList";

const InboxBar = () => {
    const theme = useTheme()
    const {t} = useTranslation()
    const totalReceiveNoteUnread = useSelector(
        (state: any) => state.noteSendSlice.totalReceiveNoteUnread
    );
    const navigate=useNavigate()
    return (
        <IconButton onClick={()=>{
            navigate('/MyReceiveNoteList')
        }}>
            <Badge badgeContent={totalReceiveNoteUnread} color="secondary">
                <MailIcon color="primary"/>
            </Badge>
            <Hidden mdDown>
                <span style={{color: theme.palette.primary.main, fontSize:16}}>{t('nav.inbox')}</span>
            </Hidden>
        </IconButton>
    )
}
export default InboxBar
