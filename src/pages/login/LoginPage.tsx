import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Alert, AlertColor, Box, Button, CircularProgress, IconButton, Snackbar} from "@mui/material";
import HeaderLogin from "../common/HeaderLogin";
import {useTheme} from "@mui/material/styles";
import EmailLogin from "./EmailLogin";
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import UsernameLogin from "./UsernameLogin";
import {apiSignInByNothing} from "../../api/Api";
import {saveLoginData} from "../../store/loginSlice";
import {LoginModel} from "../../model/LoginModel";

const LoginPage = () => {
    const {t} = useTranslation()
    const [emailLogin, setEmailLogin] = useState(false)
    const [usernameLogin, setUsernameLogin] = useState(true)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const theme = useTheme()
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState<AlertColor>()
    const [showMsg, setShowMsg] = useState(false)
    const [saving, setSaving] = useState(false)

    const onSignAsGuest = () => {
        /**
         * 如果没有token，就注册一个新用户
         */
        // navigate("/guest/login");
        apiSignInByNothing().then((res: any) => {
            if (res.code === 0) {
                localStorage.setItem("lifecapsule_token", res.data.token);
                let data: LoginModel = {
                    token: res.data.token,
                    timerPrimary: res.data.timerPrimary,
                    nickname: res.data.nickname,
                    loginName: res.data.loginName,
                    userStatus: ''
                }
                dispatch(saveLoginData(data))
                navigate("/Dashboard1", {replace: true});
            } else {
                setMsg(t('syserr.' + res.code))
                setMsgType('error')
                setShowMsg(true)
                setSaving(false)
            }
        }).catch(() => {
            setMsg(t('syserr.10001'))
            setMsgType('error')
            setShowMsg(true)
            setSaving(false)
        })
    }

    return (
        <Box style={{}}>
            <HeaderLogin/>
            <div style={{padding: 20}}>
                <div style={{
                    color: theme.palette.primary.main,
                    textAlign: 'center',
                    fontSize: 48,
                }}>{t('login.greeting1')}</div>
                <div style={{
                    textAlign: 'center',
                    fontSize: 20,
                    marginTop: 20,
                    color: theme.palette.primary.main
                }}>{t('login.greeting2')}</div>
            </div>

            <Box sx={{
                padding: 0,
                display: 'flex', justifyContent: 'center'
            }}>
                <Box sx={{
                    padding: 1,
                    maxWidth: 600,
                    width: '100%'
                }}>
                    <IconButton onClick={() => {
                        setEmailLogin(true)
                        setUsernameLogin(false)
                    }}>
                        <EmailIcon style={{
                            color: emailLogin ? theme.palette.primary.main : theme.palette.secondary.light,
                            fontSize: 32
                        }}/>
                    </IconButton>
                    <IconButton onClick={() => {
                        setUsernameLogin(true)
                        setEmailLogin(false)
                    }}>
                        <PersonIcon style={{
                            color: usernameLogin ? theme.palette.primary.main : theme.palette.secondary.light,
                            fontSize: 32
                        }}/>
                    </IconButton>
                    {
                        emailLogin ?
                            <EmailLogin/>
                            :
                            usernameLogin ?
                                <UsernameLogin/>
                                : null
                    }
                </Box>
            </Box>

            <Box sx={{textAlign: 'center', marginTop: 1}}>
                {saving ?
                    <CircularProgress/>
                    :
                    <Button onClick={() => {
                        onSignAsGuest()
                    }}>{t('login.btGuestIn')}</Button>
                }
            </Box>

            <Snackbar
                open={showMsg}
                autoHideDuration={2000}
                onClose={() => {
                    setShowMsg(false)
                }}
                message='note archieved'
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert severity={msgType} variant='filled'>{msg}</Alert>
            </Snackbar>
        </Box>
    )
}
export default LoginPage
