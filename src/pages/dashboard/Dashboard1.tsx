import {
    Alert,
    AlertColor,
    Box,
    Button,
    ButtonProps, Card, CardActions, CardContent, CardHeader,
    Container, Grid, IconButton,
    Paper,
    Snackbar,
    Stack,
    styled,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import Header1 from "../common/Header1";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {saveTimerPrimary} from "../../store/loginSlice";
import TimerBoard1 from "../common/TimerBoard1";
import {apiListMyNote, apiListMyNoteReceiveLog, apiListUserNoteTag, apiSnooze} from "../../api/Api";
import {useNavigate} from "react-router-dom";
import {useTheme} from "@mui/material/styles";
import {saveNoteList} from "../../store/noteDataSlice";
import NoteRowDashboard from "./NoteRowDashboard";
import ReceiveNoteRowDashboard from "./ReceiveNoteRowDashboard";
import Header2 from "../common/Header2";

const Dashboard1 = () => {
    const {t} = useTranslation()
    const nickname = useSelector((state: any) => state.loginSlice.nickname)
    const dispatch = useDispatch()
    const [showNotification, setShowNotification] = useState(false)
    const [notificationMsg, setNotificationMsg] = useState('')
    const [msgType, setMsgType] = useState<AlertColor>('success')
    const [timeRemaining, setTimeRemaining] = useState(60); // 设置初始倒计时时间（以秒为单位）
    const navigate = useNavigate()
    const theme = useTheme()
    const [noteList, setNoteList] = useState([])
    const [receiveNoteList, setReceiveNoteList] = useState([])

    useEffect(() => {
        const token = localStorage.getItem("lifecapsule_token")
        console.log(token)
        /**
         * todo
         * check user token login status
         */
        loadAllData()
    }, [])

    // 在组件挂载时启动倒计时
    useEffect(() => {
        const timer = setInterval(() => {
            if (timeRemaining > 0) {
                setTimeRemaining(timeRemaining - 1);
            }
        }, 1000);

        // 在组件卸载时清除定时器
        return () => clearInterval(timer);
    }, [timeRemaining]);

    const snoozePrimaryTimer = () => {
        apiSnooze()
            .then((res: any) => {
                if (res.code === 0) {
                    dispatch(saveTimerPrimary(res.data.timerPrimary));
                    setMsgType('success')
                    setNotificationMsg(t("dashboard.tipSnoozeSuccess"))
                    setShowNotification(true)
                } else {
                    setMsgType('error')
                    setNotificationMsg(t("syserr." + res.code))
                    setShowNotification(true)
                }
            })
            .catch(() => {
                setMsgType('error')
                setNotificationMsg(t("syserr.10001"))
                setShowNotification(true)
            });
    };

    const loadAllData = () => {
        let params = {
            pageIndex: 1,
            pageSize: 10,
        };
        apiListMyNote(params)
            .then((res: any) => {
                if (res.code === 0) {
                    // dispatch(saveNoteList(res.data.noteList));
                    setNoteList(res.data.noteList)
                }
            })

        apiListMyNoteReceiveLog(params).then((res: any) => {
            if (res.code === 0) {
                setReceiveNoteList(res.data.receiveNoteList)
            }
        })
    };

    return (
        <Box
            minHeight='100vh'>
            {/*<div style={{background: 'blue', minHeight: '100vh', margin: 0, padding: 0}}>*/}
            {/*header bar*/}
            <Header1/>

            <div style={{display: 'flex', justifyContent: 'center', marginTop: 60}}>
                <div style={{ width: '100%', maxWidth: 1080}}>
                    <Header2/>
                    {/*timer*/}
                    <div style={{display: 'flex', justifyContent: "center"}}>
                        <div style={{padding: 10}}>
                            <div style={{marginTop: 20, fontSize: 20}}>
                                <Stack direction='row' sx={{}}>
                                    <Box sx={{margin: 2, color: theme.palette.primary.main}}>
                                        {t('dashboard.tip1')}
                                    </Box>
                                    <Box sx={{
                                        margin: 2,
                                        fontSize: 20,
                                        fontWeight: 'bold',
                                        color: theme.palette.primary.main
                                    }}>
                                        {nickname}
                                    </Box>
                                </Stack>
                            </div>
                            <Paper sx={{
                                textAlign: 'center',
                                margin: 0,
                                width: '100%',
                                maxWidth: 600,
                                padding: 2,
                                background: theme.palette.background.default,
                                color: theme.palette.primary.main
                            }}>
                                <Typography variant="h5" gutterBottom>
                                    {t('dashboard.tip2')}
                                </Typography>
                                <TimerBoard1/>
                                <Typography variant='body1' sx={{marginTop: 1}}>
                                    {t("dashboard.tip3")}
                                </Typography>
                                <Box sx={{marginTop: 2}}>
                                    <Button variant="contained"
                                            sx={{background: theme.palette.primary.main}}
                                            onClick={() => {
                                                snoozePrimaryTimer()
                                            }}>SNOOZE</Button>
                                </Box>
                                <Typography variant='body1' sx={{marginTop: 1}}>
                                    {t("dashboard.tip4")}
                                </Typography>
                            </Paper>
                        </div>
                    </div>
                    {/*</Box>*/}

                    {/*recent notes*/}
                    <Box display='flex' justifyContent='center' sx={{padding: 1, marginTop: 2}}>
                        <Paper sx={{
                            width: '100%',
                            padding: 1,
                            background: theme.palette.background.default,
                            textAlign: 'center',
                            border: '1px solid',
                            borderColor: theme.palette.primary.main
                        }}>
                            <Button variant='contained' size="small" onClick={() => {
                                navigate('/NoteList')
                            }}>{t('dashboard.recentNotes')}</Button>
                            <div style={{marginTop: 20}}></div>
                            {noteList.length > 0 ?
                                noteList.map((item, index) => (
                                    <NoteRowDashboard data={item} key={index}/>
                                ))
                                :
                                <Box>
                                    {t('dashboard.noNotes')}
                                </Box>

                            }
                        </Paper>
                    </Box>

                    {/*Recently received notes*/}
                    <Box display='flex' justifyContent='center' sx={{padding: 1, marginTop: 2}}>
                        <Paper sx={{
                            width: '100%',
                            padding: 1,
                            background: theme.palette.background.default,
                            textAlign: 'center',
                            border: '1px solid',
                            borderColor: theme.palette.primary.main
                        }}>
                            <Button variant='contained' size="small" onClick={() => {
                                navigate('/MyReceiveNoteList')
                            }}>{t('dashboard.recentReceiveNote')}</Button>
                            <div style={{marginTop: 20}}></div>
                            {receiveNoteList.length > 0 ?
                                receiveNoteList.map((item, index) => (
                                    <ReceiveNoteRowDashboard data={item} key={index}/>
                                ))
                                :
                                <Box>
                                    {t('dashboard.noReceiveNote')}
                                </Box>

                            }
                        </Paper>
                    </Box>
                </div>
            </div>

            <Snackbar
                open={showNotification}
                autoHideDuration={3000}
                onClose={() => {
                    setShowNotification(false)
                }}
                message='note archieved'
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert severity={msgType} variant='filled'>{notificationMsg}</Alert>
            </Snackbar>
        </Box>
    )
}
export default Dashboard1
