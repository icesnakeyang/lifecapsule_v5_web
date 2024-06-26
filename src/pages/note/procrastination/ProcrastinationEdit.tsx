import Header1 from "../../common/Header1";
import {
    Alert,
    AlertColor,
    Breadcrumbs,
    Button,
    Card, CardActions, CardContent,
    CardHeader, CircularProgress,
    Grid,
    Snackbar,
    Stack,
    TextField, useMediaQuery
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {useTheme} from "@mui/material/styles";
import {useSelector} from "react-redux";
import {
    apiGetMyAntiDelayNote,
    apiRequestRsaPublicKey,
    apiSetLoginNamePassword,
    apiUpdateMyAntiDelayNote
} from "../../../api/Api";
import {Decrypt, Decrypt2, Encrypt, GenerateKey, GenerateRandomString16, RSAencrypt} from "../../../common/crypto";
import moment from "moment";
import CryptoJS from "crypto-js";
import CardHappyMoment from "./CardHappyMoment";
import CardMyThought from "./CardMyThought";
import CardLongGoal from "./CardLongGoal";
import CardToDo from "./CardToDo";

const ProcrastinationEdit = () => {
    const navigate = useNavigate()
    const {t} = useTranslation()
    const [loading, setLoading] = useState(true)
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState<AlertColor>('success')
    const [showMsg, setShowMsg] = useState(false)
    const theme = useTheme()
    const procrastinationNoteId = useSelector((state: any) => state.procrastinationSlice.procrastinationNoteId)
    const [happyYesterday, setHappyYesterday] = useState('')
    const [myThought, setMyThought] = useState('')
    const [longGoal, setLongGoal] = useState('')
    const [todayGoal, setTodayGoal] = useState('')
    const [title, setTitle] = useState('')
    const [createTime, setCreateTime] = useState<Date>()
    const [saving, setSaving] = useState(false)
    const mdDown = useMediaQuery(theme.breakpoints.down('md'))

    useEffect(() => {
        loadAllData()
    }, [])

    const loadAllData = () => {
        let params = {
            noteId: procrastinationNoteId,
            encryptKey: {},
            keyToken: ''
        }
        setLoading(true)
        apiRequestRsaPublicKey().then((res1: any) => {
            if (res1.code === 0) {
                const keyAES_1 = GenerateRandomString16()
                params.encryptKey = RSAencrypt(keyAES_1, res1.data.publicKey)
                params.keyToken = res1.data.keyToken
                apiGetMyAntiDelayNote(params).then((res: any) => {
                    if (res.code === 0) {
                        let strKey = res.data.userEncodeKey
                        strKey = Decrypt2(strKey, keyAES_1)
                        if (res.data.HAPPY_YESTERDAY) {
                            let HAPPY_YESTERDAY = Decrypt(res.data.HAPPY_YESTERDAY.content, strKey, strKey)
                            setHappyYesterday(HAPPY_YESTERDAY)
                        }
                        if (res.data.LONG_GOAL) {
                            let LONG_GOAL = Decrypt(res.data.LONG_GOAL.content, strKey, strKey)
                            setLongGoal(LONG_GOAL)
                        }
                        if (res.data.MY_THOUGHT) {
                            let MY_THOUGHT = Decrypt(res.data.MY_THOUGHT.content, strKey, strKey)
                            setMyThought(MY_THOUGHT)
                        }
                        if (res.data.TODAY_GOAL) {
                            let TODAY_GOAL = Decrypt(res.data.TODAY_GOAL.content, strKey, strKey)
                            setTodayGoal(TODAY_GOAL)
                        }
                        setTitle(res.data.title)
                        setCreateTime(res.data.createTime)
                        setLoading(false)
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
        })
    }

    const onSaveProcrastination = () => {
        let params = {
            title,
            happyYesterday,
            myThought,
            longGoal,
            todayGoal,
            encryptKey: {},
            keyToken: '',
            noteId: procrastinationNoteId
        }
        setSaving(true);

        const uuid = GenerateKey();
        const keyAES = CryptoJS.SHA256(uuid);
        const keyAESBase64 = CryptoJS.enc.Base64.stringify(keyAES);
        params.happyYesterday = Encrypt(happyYesterday, keyAESBase64, keyAESBase64);
        params.myThought = Encrypt(myThought, keyAESBase64, keyAESBase64);
        params.longGoal = Encrypt(longGoal, keyAESBase64, keyAESBase64);
        params.todayGoal = Encrypt(todayGoal, keyAESBase64, keyAESBase64);
        params.encryptKey = keyAESBase64;
        apiRequestRsaPublicKey().then((res1: any) => {
            if (res1.code === 0) {
                params.encryptKey = RSAencrypt(params.encryptKey, res1.data.publicKey)
                params.keyToken = res1.data.keyToken
                apiUpdateMyAntiDelayNote(params).then((res: any) => {
                    if (res.code === 0) {
                        setMsg(t('AntiProcrastination.tipSaveAntiDelayNoteSuccess'))
                        setMsgType('success')
                        setShowMsg(true)
                        navigate(-1)
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
            } else {
                setMsg(t('syserr.' + res1.code))
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
                            <div>
                                <Stack direction='row' spacing={2}>
                                <span>
                                {t('AntiProcrastination.createTime')}
                                    </span>
                                    <span>
                                {createTime && moment(createTime).format('LL')}
                                </span>
                                </Stack>
                            </div>

                            <Grid container style={{marginTop: 20}} columnSpacing={1} rowSpacing={1}>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <Grid container rowSpacing={1}>
                                        <Grid item xs={12}>
                                            <CardHappyMoment happyYesterday={happyYesterday}
                                                             onChangeHappyYesterday={value => {
                                                                 setHappyYesterday(value)
                                                             }}/>
                                        </Grid>

                                        <Grid item xs={12}>
                                            {
                                                mdDown ?
                                                    <CardMyThought myThought={myThought}
                                                                   onChangeMyThought={value => setMyThought(value)}/>
                                                    :
                                                    <CardLongGoal longGoal={longGoal}
                                                                  onChangeLongGoal={value => setLongGoal(value)}/>
                                            }
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {/* 右侧列，始终显示 <CardMyThought> 和 <CardToDo> */}
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <Grid container rowSpacing={1}>
                                        <Grid item xs={12}>
                                            {
                                                mdDown ?
                                                    <CardLongGoal longGoal={longGoal}
                                                                  onChangeLongGoal={value => setLongGoal(value)}/>
                                                    :
                                                    <CardMyThought myThought={myThought}
                                                                   onChangeMyThought={value => {
                                                                       setMyThought(value)
                                                                   }}
                                                    />
                                            }
                                        </Grid>
                                        <Grid item xs={12}>
                                            <CardToDo todayGoal={todayGoal}
                                                      onChangeTodayGoal={value => setTodayGoal(value)}/>
                                        </Grid>
                                    </Grid>
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
export default ProcrastinationEdit
