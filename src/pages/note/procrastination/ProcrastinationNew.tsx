import Header1 from "../../common/Header1";
import {
    Alert, AlertColor,
    Breadcrumbs,
    Button,
    Card, CardActions,
    CardContent,
    CardHeader,
    CircularProgress,
    Grid, Snackbar,
    Stack,
    TextField
} from "@mui/material";
import moment from "moment/moment";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useTheme} from "@mui/material/styles";
import {useDispatch} from "react-redux";
import {Encrypt, GenerateKey, RSAencrypt} from "../../../common/crypto";
import {apiCreateMyAntiDelayNote, apiRequestRsaPublicKey, apiUpdateMyAntiDelayNote} from "../../../api/Api";
import CryptoJS from "crypto-js";

const ProcrastinationNew = () => {
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState<AlertColor>('success')
    const [showMsg, setShowMsg] = useState(false)
    const navigate = useNavigate()
    const {t} = useTranslation()
    const theme = useTheme()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState('')
    const [saving, setSaving] = useState(false)
    const [happyYesterday, setHappyYesterday] = useState('')
    const [myThought, setMyThought] = useState('')
    const [longGoal, setLongGoal] = useState('')
    const [todayGoal, setTodayGoal] = useState('')

    const onSaveProcrastination = () => {
        if (!title) {
            setMsg(t('AntiProcrastination.tipNoTitle'))
            setMsgType('error')
            setShowMsg(true)
            return
        }

        let params = {
            title,
            happyYesterday,
            myThought,
            longGoal,
            todayGoal,
            encryptKey: {},
            keyToken: ''
        }
        setSaving(true)
        const uuid = GenerateKey()
        const keyAES = CryptoJS.SHA256(uuid)
        const keyAESBase64 = CryptoJS.enc.Base64.stringify(keyAES)
        params.happyYesterday = Encrypt(happyYesterday, keyAESBase64, keyAESBase64)
        params.myThought = Encrypt(myThought, keyAESBase64, keyAESBase64);
        params.longGoal = Encrypt(longGoal, keyAESBase64, keyAESBase64);
        params.todayGoal = Encrypt(todayGoal, keyAESBase64, keyAESBase64);
        params.todayGoal = Encrypt(todayGoal, keyAESBase64, keyAESBase64);
        params.encryptKey = keyAESBase64;

        apiRequestRsaPublicKey().then((res1: any) => {
            if (res1.code === 0) {
                params.encryptKey = RSAencrypt(params.encryptKey, res1.data.publicKey)
                params.keyToken = res1.data.keyToken

                apiCreateMyAntiDelayNote(params).then((res: any) => {
                    if (res.code === 0) {
                        setMsg(t('AntiProcrastination.tipSaveAntiDelayNoteSuccess'))
                        setMsgType('success')
                        setShowMsg(true)
                        navigate(-1)
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
            } else {
                setMsg(t('syserr.' + res1.code))
                setMsgType('error')
                setShowMsg(true)
            }
        }).catch(() => {
            setMsg(t('syserr.10001'))
            setMsgType('error')
            setShowMsg(true)
        })
    }

    return (
        <div>
            <Header1/>
            <div style={{display: 'flex', justifyContent: "center", padding: 10}}>
                <div style={{width: '100%', maxWidth: 1080}}>
                    <Breadcrumbs style={{marginTop: 60}}>
                        <Button onClick={() => {
                            navigate('/Dashboard1')
                        }}>
                            {t('nav.home')}
                        </Button>
                        <Button onClick={() => {
                            navigate(-1)
                        }}>
                            {t('nav.back')}
                        </Button>
                    </Breadcrumbs>

                    {loading ?
                        <div style={{textAlign: "center", marginTop: 200}}>
                            <CircularProgress/>
                        </div>
                        :
                        <div style={{marginTop: 20}}>
                            <div>
                                <TextField
                                    variant='standard'
                                    style={{width: '100%'}}
                                    multiline
                                    label={t('AntiProcrastination.antiDelayTile')}
                                    value={title}
                                    onChange={e => {
                                        setTitle(e.target.value)
                                    }}
                                />
                            </div>

                            <Grid container style={{marginTop: 20}} columnSpacing={2} rowSpacing={2}>
                                <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                                    <Card style={{
                                        background: theme.palette.background.default,
                                        border: '1px solid',
                                        borderColor: theme.palette.primary.main
                                    }}>
                                        <CardHeader title={t('AntiProcrastination.yesterday')}/>
                                        <CardContent>
                                            <TextField
                                                style={{width: '100%'}}
                                                multiline
                                                value={happyYesterday}
                                                onChange={e => {
                                                    setHappyYesterday(e.target.value)
                                                }}
                                            />
                                            <div style={{marginTop: 10}}>{t('AntiProcrastination.tipYesterday')}</div>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                                    <Card style={{
                                        background: theme.palette.background.default,
                                        border: '1px solid',
                                        borderColor: theme.palette.primary.main
                                    }}>
                                        <CardHeader title={t('AntiProcrastination.myThought')}/>
                                        <CardContent>
                                            <TextField
                                                style={{width: '100%'}}
                                                multiline
                                                value={myThought}
                                                onChange={e => {
                                                    setMyThought(e.target.value)
                                                }}
                                            />
                                        </CardContent>
                                        <CardActions>
                                            {t('AntiProcrastination.tipMyThought')}
                                        </CardActions>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                                    <Card style={{
                                        background: theme.palette.background.default,
                                        border: '1px solid',
                                        borderColor: theme.palette.primary.main
                                    }}>
                                        <CardHeader title={t('AntiProcrastination.longGoal')}/>
                                        <CardContent>
                                            <TextField
                                                style={{width: '100%'}}
                                                multiline
                                                value={longGoal}
                                                onChange={e => {
                                                    setLongGoal(e.target.value)
                                                }}
                                            />
                                            <div style={{marginTop: 10}}>{t('AntiProcrastination.tipLongGoal1')}</div>
                                            <div style={{}}>{t('AntiProcrastination.tipLongGoal2')}</div>
                                            <div style={{}}>{t('AntiProcrastination.tipLongGoal3')}</div>
                                            <div style={{}}>{t('AntiProcrastination.tipLongGoal4')}</div>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                                    <Card style={{
                                        background: theme.palette.background.default,
                                        border: '1px solid',
                                        borderColor: theme.palette.primary.main
                                    }}>
                                        <CardHeader title={t('AntiProcrastination.whatToDoToday')}/>
                                        <CardContent>
                                            <TextField
                                                style={{width: '100%'}}
                                                multiline
                                                value={todayGoal}
                                                onChange={e => {
                                                    setTodayGoal(e.target.value)
                                                }}
                                            />
                                            <div style={{marginTop: 10}}>{t('AntiProcrastination.tipTodayGoal')}</div>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            <div style={{textAlign: "center", marginTop: 20}}>
                                {
                                    saving ?
                                        <CircularProgress/>
                                        :
                                        <Button variant='contained' style={{width: 140}} onClick={() => {
                                            onSaveProcrastination()
                                        }}>{t('common.btSave')}</Button>
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>

            <div style={{marginTop: 50}}></div>
            <Snackbar open={showMsg}
                      autoHideDuration={2000}
                      anchorOrigin={{vertical: "top", horizontal: 'center'}}
                      onClose={() => {
                          setShowMsg(false)
                      }}
            >
                <Alert variant={"filled"} severity={msgType}>{msg}</Alert>
            </Snackbar>
        </div>
    )
}
export default ProcrastinationNew
