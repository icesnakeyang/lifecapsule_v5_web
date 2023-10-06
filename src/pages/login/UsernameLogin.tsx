import {Alert, AlertColor, Box, Button, CircularProgress, Snackbar, Stack, TextField} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import LoadingButton from '@mui/lab/LoadingButton'
import {apiLoadMyNoteSendStatistic, apiSignByLoginName} from "../../api/Api";
import {clearLoginData, saveLoginData} from "../../store/loginSlice";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {LoginModel} from "../../model/LoginModel";
import {
    saveTotalReceiveNote,
    saveTotalReceiveNoteUnread,
    saveTotalSendNote,
    saveTotalSendNoteUnread
} from "../../store/noteSendSlice";

const UsernameLogin = () => {
    const {t} = useTranslation()
    const theme = useTheme().palette.primary
    const [loginName, setLoginName] = useState('')
    const [password, setPassword] = useState('')
    const [saving, setSaving] = useState(false)
    const [loginNameErr, setLoginNameErr] = useState(false)
    const [passwordErr, setPasswordErr] = useState(false)
    const [tipErrLoginName, setTipErrLoginName] = useState('')
    const [tipPasswordErr, setTipPasswordErr] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [showNotification, setShowNotification] = useState(false)
    const [notificationMsg, setNotificationMsg] = useState('')
    const [msgType, setMsgType] = useState<AlertColor>('success')
    const [isHovered, setIsHovered] = useState(false)

    const onLogin = () => {
        let cc = 0
        if (!loginName) {
            setLoginNameErr(true)
            setTipErrLoginName(t('login.tipNoLoginName'))
            cc++
        } else {
            setLoginNameErr(false)
            setTipErrLoginName('')
        }
        if (!password) {
            setPasswordErr(true)
            setTipPasswordErr(t('login.tipNoPassword'))
            cc++
        } else {
            setPasswordErr(false)
            setTipPasswordErr('')
        }
        if (cc > 0) {
            return
        }

        let params = {
            loginName,
            password
        }
        console.log(params)
        setSaving(true)

        apiSignByLoginName(params).then((res: any) => {
            if (res.code === 0) {
                dispatch(clearLoginData())
                let userData:LoginModel = {
                    token: res.data.token,
                    timerPrimary: res.data.timerPrimary,
                    nickname: res.data.nickname,
                    loginName: res.data.loginName,
                    userStatus:''
                }
                dispatch(saveLoginData(userData))
                localStorage.setItem("lifecapsule_token", res.data.token);
                //登录成功，统计未读笔记
                apiLoadMyNoteSendStatistic().then((res:any)=>{
                    if(res.code===0){
                        dispatch(saveTotalReceiveNote(res.data.totalReceive));
                        dispatch(saveTotalReceiveNoteUnread(res.data.totalReceiveUnread));
                        dispatch(saveTotalSendNote(res.data.totalSend));
                        dispatch(saveTotalSendNoteUnread(res.data.totalSendUnread));
                    }
                })
                setShowNotification(true)
                setMsgType('success')
                setNotificationMsg(t('login.tipLoginSuccess'))
                // navigate("/main/Dashboard1", {replace: true})
                navigate('/Dashboard1', {replace: true})
            } else {
                // message.error(t('syserr.' + res.code))
                setShowNotification(true)
                setMsgType('error')
                setNotificationMsg(t('syserr.' + res.code))
                setSaving(false)
            }
        }).catch(() => {
            // message.error(t('syserr.10001'))
            setShowNotification(true)
            setMsgType('error')
            setNotificationMsg(t('syserr.10001'))
            setSaving(false)
        })
    }
    return (
        <div style={{padding: 10}}>
            <Stack spacing={2}>
                <TextField required label={t('login.loginName')} variant='standard'
                           error={loginNameErr}
                           helperText={tipErrLoginName}
                           onChange={e => {
                               console.log(e.target.value)
                               setLoginName(e.target.value)
                           }}

                />
                <TextField required label={t('login.password')} variant='standard'
                           error={passwordErr}
                           type='password'
                           helperText={tipPasswordErr}
                           onChange={e => {
                               console.log(e.target.value)
                               setPassword(e.target.value)
                           }}
                />
                {
                    saving ?
                        // <LoadingButton style={{}} loading
                        //                loadingPosition='start'
                        //                variant="contained">{t('login.btSignIning')}</LoadingButton>
                        <Box sx={{display: 'flex', justifyContent: 'center'}}>
                            <Stack direction='row' spacing={2}>
                                <CircularProgress size={20} thickness={2} color='primary'/>
                                <span style={{color:theme.main}}>{t('login.btSignIning')}</span>
                            </Stack>
                        </Box>
                        :
                        <Button color='primary' variant='contained' onClick={() => {
                            onLogin()
                        }}>
                            {t('login.btSignIn')}
                        </Button>
                }
            </Stack>
            <Snackbar
                open={showNotification}
                autoHideDuration={2000}
                onClose={() => {
                    setShowNotification(false)
                }}
                message='note archieved'
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert severity={msgType} variant='filled'>{notificationMsg}</Alert>
            </Snackbar>
        </div>
    )
}
export default UsernameLogin
