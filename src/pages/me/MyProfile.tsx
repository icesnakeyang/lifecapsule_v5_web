import {
    Alert, AlertColor,
    Breadcrumbs,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton, Snackbar,
    Stack,
    TextField
} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {useTheme} from "@mui/material/styles";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import Header1 from "../common/Header1";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import {apiGetMyProfile, apiSaveUserNickname} from "../../api/Api";
import {saveNickname, saveUserEmail, saveUserLoginName} from "../../store/loginSlice";

const MyProfile = () => {
    const {t} = useTranslation()
    const [modalNickname, setModalNickname] = useState(false);
    const theme = useTheme()
    const nickname = useSelector((state: any) => state.loginSlice.nickname);
    const userEmail = useSelector((state: any) => state.loginSlice.email);
    const navigate = useNavigate()
    const loginName = useSelector((state: any) => state.loginSlice.loginName);
    const [modalEmail, setModalEmail] = useState(false);
    const [nicknameEdit, setNicknameEdit] = useState("");
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState<AlertColor>('success')
    const [showMsg, setShowMsg] = useState(false)
    const dispatch = useDispatch()
    const [registerTime, setRegisterTime] = useState<Date>()

    useEffect(() => {
        loadMyProfile()
    }, [])

    const loadMyProfile = () => {
        apiGetMyProfile().then((res: any) => {
            if (res.code === 0) {
                dispatch(saveNickname(res.data.userInfo.nickname))
                setNicknameEdit(res.data.userInfo.nickname)
                dispatch(saveUserEmail(res.data.userInfo.email))
                dispatch(saveUserLoginName(res.data.userInfo.loginName))
                setRegisterTime(res.data.userInfo.registerTime)
            } else {
                setMsg(t('syserr.' + res.code))
                setMsgType('error')
                setShowMsg(true)
            }
        }).catch(() => {
            setMsg(t('syserr.10001'))
            setMsgType('error')
            setShowMsg(true)
        })
    }

    const onSaveNickname = () => {
        if (nickname === nicknameEdit) {
            return;
        }
        let params = {
            nickname: nicknameEdit,
        };
        apiSaveUserNickname(params)
            .then((res: any) => {
                if (res.code === 0) {
                    setMsg(t("MyProfile.tipSaveNicknameSuccess"));
                    setMsgType('success')
                    setShowMsg(true)
                    dispatch(saveNickname(nicknameEdit));
                    setModalNickname(false);
                } else {
                    setMsg(t("syserr." + res.code));
                    setMsgType('error')
                    setShowMsg(true)
                }
            })
            .catch(() => {
                setMsg(t("syserr.10001"));
                setMsgType('error')
                setShowMsg(true)
            });
    };

    return (
        <div style={{}}>
            <Header1/>
            <div style={{padding: 10, display: 'flex', justifyContent: 'center'}}>
                <div style={{width: '100%', maxWidth: 1080}}>
                    <Breadcrumbs sx={{marginTop: 8}}>
                        <Button onClick={() => {
                            navigate('/Dashboard1')
                        }}>{t('common.home')}</Button>
                        <Button onClick={() => {
                            navigate(-1)
                        }}>{t('nav.back')}</Button>
                    </Breadcrumbs>
                    <Card style={{background: theme.palette.background.default}}>
                        <CardHeader title={t("MyProfile.nickname")} style={{color: theme.palette.primary.main}}>
                        </CardHeader>
                        <CardContent>
                            <Stack direction='row' style={{}}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: theme.palette.primary.main
                                }}>{nickname}</div>
                                <IconButton aria-label="delete" onClick={() => {
                                    setModalNickname(true);
                                }}>
                                    <BorderColorIcon/>
                                </IconButton>
                            </Stack>
                        </CardContent>
                    </Card>
                    <Card style={{marginTop: 20, background: theme.palette.background.default}}>
                        <CardHeader title={t("MyProfile.email")} style={{color: theme.palette.primary.main}}>
                        </CardHeader>
                        <CardContent style={{}}>
                            {userEmail ? (
                                <div style={{color: theme.palette.primary.main}}>
                                    {userEmail}
                                </div>
                            ) : (
                                <div style={{color: theme.palette.primary.main}}>
                                    <div>{t("MyProfile.tipNoEmail")}</div>
                                </div>
                            )}
                            <div style={{marginTop: 10}}>
                                <Button
                                    variant='contained'
                                    onClick={() => {
                                        navigate('/main/BindEmail')
                                    }}
                                    size="small"
                                >
                                    {t("MyProfile.bindEmail")}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card style={{marginTop: 20, background: theme.palette.background.default}}>
                        <CardHeader title={t('MyProfile.titleLoginName')} style={{color: theme.palette.primary.main}}>
                        </CardHeader>
                        <CardContent style={{}}>
                            {loginName ?
                                <div style={{display: 'flex', color: theme.palette.primary.main}}>
                                    <span>{t('MyProfile.loginName')}：</span>
                                    <span>{loginName}</span>
                                </div>
                                :
                                <div>
                                    <div style={{color: theme.palette.primary.main}}>
                                        {t('MyProfile.tipNoLoginName')}
                                    </div>
                                </div>
                            }
                            <div style={{marginTop: 10}}>
                                <Button variant='contained' size='small' onClick={() => {
                                    navigate('/main/SetLoginName')
                                }}>{t('MyProfile.btSetLoginName')}</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog
                title={t("MyProfile.bindEmail")}
                open={modalEmail}>
                <div>{t('common.constructing')}</div>
            </Dialog>

            <Dialog open={modalNickname}>
                <DialogTitle>
                    {t("MyProfile.modalNicknameTitle")}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        value={nicknameEdit}
                        onChange={(e) => {
                            setNicknameEdit(e.target.value);
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setModalNickname(false)
                    }}>{t('common.btCancel')}</Button>
                    <Button onClick={() => {
                        onSaveNickname()
                        setModalNickname(false)
                    }}>{t('common.btConfirm')}</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={showMsg}
                      autoHideDuration={3000}
                      onClose={() => {
                          setShowMsg(false)
                      }}
                      anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert severity={msgType} variant='filled'>{msg}</Alert>
            </Snackbar>
        </div>
    )
}
export default MyProfile
