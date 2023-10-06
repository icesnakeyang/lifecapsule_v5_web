import {
    Badge,
    Box,
    Breadcrumbs,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider, IconButton,
    Link, Paper,
    Stack,
    Switch,
    Typography
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {saveThemeMode} from "../../store/commonSlice";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import Header1 from "../common/Header1";
import {useLocaleText} from "@mui/x-date-pickers/internals";
import {useTheme} from "@mui/material/styles";
import MailIcon from '@mui/icons-material/Mail';
import SendIcon from '@mui/icons-material/Send';

const SettingPage = () => {
    const themeMode = useSelector((state: any) => state.commonSlice.themeMode)
    const dispatch = useDispatch()
    const [isLight, setIsLight] = useState(false)
    const {t} = useTranslation()
    const navigate = useNavigate()
    const theme = useTheme()

    useEffect(() => {
        if (themeMode === 'light') {
            setIsLight(true)
        } else {
            setIsLight(false)
        }
    }, [themeMode])

    return (
        <div>
            <Header1/>
            <div style={{marginTop: 50, padding: 10, display: 'flex', justifyContent: 'center'}}>
                <div style={{width: '100%', maxWidth: 1080}}>
                    <Breadcrumbs>
                        <Button onClick={() => {
                            navigate('/Dashboard1')
                        }}>{t('nav.home')}</Button>
                        <Button onClick={() => {
                            navigate(-1)
                        }}>{t('nav.back')}</Button>
                    </Breadcrumbs>

                    <Divider/>

                    <Card style={{
                        background: theme.palette.primary.dark,
                        marginTop: 10,
                        color: theme.palette.primary.contrastText
                    }} title='theme'>
                        <CardContent style={{padding: 10}}>
                            <Stack direction='row' spacing={2} style={{display: 'flex', alignItems: 'center'}}>
                                <div>
                                    {t('setting.themeColor')}
                                </div>
                                <div style={{}}>
                                    <Switch
                                        checked={isLight}
                                        onChange={() => {
                                            if (isLight) {
                                                setIsLight(false)
                                                dispatch(saveThemeMode('dark'))
                                            } else {
                                                setIsLight(true)
                                                dispatch(saveThemeMode('light'))
                                            }
                                        }}
                                    />
                                </div>
                                <div style={{}}>
                                    {themeMode}
                                </div>
                            </Stack>
                            {/*<Button onClick={() => {*/}
                            {/*    dispatch(saveThemeMode('red'))*/}
                            {/*}}>设置为red</Button>*/}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
export default SettingPage
