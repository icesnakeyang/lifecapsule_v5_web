import {Alert, AlertColor, Box, Button, CircularProgress, Snackbar, Stack, TextField} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {useTheme} from "@mui/material/styles";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {apiSendVerifyCodeToEmail, apiSignByEmail, apiSignInByNothing} from "../../api/Api";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from '@mui/icons-material/Save';
import {
    saveLoginData,
    saveLoginToken
} from "../../store/loginSlice";

let timer: any = null

const EmailLogin = () => {
    const {t} = useTranslation()
    const theme = useTheme().palette.primary
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [codeStatus, setCodeStatus] = useState('CAN_SEND')

    const [canInputCode, setCanInputCode] = useState(false)
    const [emailCode, setEmailCode] = useState('')
    const [saving, setSaving] = useState(false)
    const [showNotification, setShowNotification] = useState(false)
    const [notificationMsg, setNotificationMsg] = useState('')
    const [msgType, setMsgType] = useState<AlertColor>('success')
    const dispatch = useDispatch()
    const [codeTime, setCodeTime] = useState(0)

    useEffect(() => {
        return () => {
            timer && clearInterval(timer)
        }
    }, [])

    useEffect(() => {
        if (codeStatus === 'SUCCESS') {
            console.log('out by success')
            return
        }
        if (codeStatus === 'CAN_SEND') {
            console.log('out by can send')
            return
        }
        if (codeTime === 60) {
            timer = setInterval(() => setCodeTime(item => --item), 1000)
        } else {
            if (codeTime <= 0) {
                timer && clearInterval(timer)
                setCodeStatus('CAN_SEND')
            }
        }
    }, [codeTime])


    const onSendCode = () => {
        let reg = /^([a-z0-9_\.-]+)@([\da-z\.]+)\.([a-z\.]{2,6})$/g;
        if (!reg.test(email)) {
            setShowNotification(true)
            setMsgType('error')
            setNotificationMsg(t('email.tipValidateEmailErr'))
            setSaving(false)
            return;
        }

        let params = {
            email,
            actType: 'LOGIN',
        };
        setCodeStatus('SENDING')
        apiSendVerifyCodeToEmail(params)
            .then((res: any) => {
                if (res.code === 0) {
                    setCodeStatus('COUNTING')
                    setCodeTime(60)
                    setCanInputCode(true)
                } else {
                    setNotificationMsg(t('syserr.' + res.code))
                    setCodeStatus('CAN_SEND')
                }
            })
            .catch(() => {
                setNotificationMsg(t('syserr.10001'))
                setCodeStatus('CAN_SEND')
            });
    }

    const onSignByEmail = () => {
        if (!email) {
            setNotificationMsg(t('login.tipNoEmail'))
            setMsgType('error')
            setShowNotification(true)
            return
        }
        if (!emailCode) {
            setNotificationMsg(t('login.tipNoEmailCode'))
            setMsgType('error')
            setShowNotification(true)
            return
        }
        let params = {
            email,
            emailCode
        }
        setSaving(true)
        apiSignByEmail(params).then((res: any) => {
            if (res.code === 0) {
                dispatch(saveLoginToken(res.data.token))
                localStorage.setItem("lifecapsule_token", res.data.token);
                setNotificationMsg(t('login.tipLoginSuccess'))
                setMsgType('success')
                setShowNotification(true)
                navigate("/", {replace: true})
            } else {
                setNotificationMsg(t('syserr.' + res.code))
                setMsgType('error')
                setShowNotification(true)
                setSaving(false)
            }
        }).catch(() => {
            setNotificationMsg(t('syserr.10001'))
            setMsgType('error')
            setShowNotification(true)
            setSaving(false)
        })
    }

    return (
        <div style={{padding: 10}}>
            <Stack spacing={2} style={{}}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <TextField variant='standard' style={{width: 300}}
                               label={t('login.email')} onChange={e => {
                        setEmail(e.target.value)
                    }}/>
                    {
                        codeStatus === 'CAN_SEND' ?
                            <Button variant='contained' onClick={() => {
                                onSendCode()
                            }}>{t('login.btCanSend')}</Button>
                            : codeStatus === 'SENDING' ?
                                <LoadingButton loading
                                               loadingPosition="start"
                                               startIcon={<SaveIcon/>}
                                >
                                    {t('login.btSending')}
                                </LoadingButton>
                                : codeStatus === 'COUNTING' ?
                                    <LoadingButton loading
                                                   loadingPosition='start'
                                                   startIcon={<SaveIcon/>}
                                    >
                                        Waiting {codeTime}...
                                    </LoadingButton>
                                    : null
                    }
                </div>
            </Stack>

            {
                canInputCode ?
                    <div>
                        <Stack spacing={2} style={{marginTop: 10}}>
                            <TextField variant='standard' label={t('login.emailCode')} onChange={e => {
                                setEmailCode(e.target.value)
                            }}/>
                        </Stack>
                        {saving ?
                            <Box sx={{display: 'flex', justifyContent: 'center', marginTop: 5}}>
                                <Stack direction='row' spacing={2}>
                                    <CircularProgress size={20} thickness={2} color="inherit"/>
                                    <span>{t('login.btSignIning')}</span>
                                </Stack>
                            </Box>
                            :
                            <Box sx={{display: 'flex', justifyContent: 'center', marginTop: 5}}>
                                <Stack style={{marginTop: 0}}>
                                    <Button variant='contained' onClick={() => {
                                        setSaving(true)
                                        setTimeout(() => {
                                            setSaving(false)
                                        }, 2000)
                                    }}>
                                        {t('login.btSignIn')}
                                    </Button>
                                </Stack>
                            </Box>
                        }
                    </div>
                    : null
            }

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
export default EmailLogin
