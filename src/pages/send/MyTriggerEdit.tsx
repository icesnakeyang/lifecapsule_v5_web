import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {
    Alert,
    AlertColor,
    Breadcrumbs,
    Button,
    Card,
    CardContent,
    CircularProgress, Dialog, DialogActions, DialogContent,
    Snackbar,
    TextField
} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import {apiDeleteMyNoteTrigger, apiGetMyTriggerDetail, apiRequestRsaPublicKey} from "../../api/Api";
import {Decrypt, Decrypt2, GenerateRandomString16, RSAencrypt} from "../../common/crypto";
import {timePlusDays} from "../../common/common";
import moment from "moment";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, {Dayjs} from "dayjs";
import Header1 from "../common/Header1";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {useTheme} from "@mui/material/styles";
import {DemoContainer} from "@mui/x-date-pickers/internals/demo";
import CryptoJS from "crypto-js";

const MyTriggerEdit = () => {
    const {triggerId}: any = useLocation().state
    const {t} = useTranslation()
    const navigate = useNavigate()
    const [createTime, setCreateTime] = useState(null)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [encodeCode, setEncodeCode] = useState('')
    const [toName, setToName] = useState('')
    const [fromName, setFromName] = useState('')
    const [triggerTime, setTriggerTime] = useState<Dayjs | null>();
    const [loading, setLoading] = useState(true)
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState<AlertColor>()
    const [showMsg, setShowMsg] = useState(false)
    const theme = useTheme()
    const [modalDelete, setModalDelete] = useState(false)

    useEffect(() => {
        loadAllData()
    }, [])

    const loadAllData = () => {
        let params = {
            triggerId,
            encryptKey: {},
            keyToken: "",
        }
        setLoading(true)
        apiRequestRsaPublicKey().then((res2: any) => {
            if (res2.code === 0) {
                const keyAES_1 = GenerateRandomString16();
                params.encryptKey = RSAencrypt(keyAES_1, res2.data.publicKey);
                params.keyToken = res2.data.keyToken;
                apiGetMyTriggerDetail(params).then((res: any) => {
                    if (res.code === 0) {
                        let trigger = res.data.trigger;
                        setCreateTime(trigger.createTime);
                        setTitle(trigger.title);
                        if (trigger.noteContent) {
                            if (trigger.userEncodeKey) {
                                let strKey = trigger.userEncodeKey;
                                strKey = Decrypt2(strKey, keyAES_1);
                                let content = Decrypt(trigger.noteContent, strKey, strKey);
                                setContent(content);
                            } else {
                                setContent(trigger.noteContent);
                            }
                        }
                        setToName(trigger.toName)
                        setFromName(trigger.fromName)
                        console.log(1)
                        if (trigger.triggerTime) {
                            console.log(2)
                            console.log(trigger.triggerTime)

                            let date1 = dayjs(trigger.triggerTime)
                            setTriggerTime(date1)
                        } else {
                            let date: any = null
                            date = timePlusDays(new Date(), 30)
                            setTriggerTime(dayjs(date))
                        }
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
            } else {
                setMsg(t('syserr.' + res2.code))
                setMsgType('error')
                setShowMsg(true)
            }
        }).catch(() => {
            setMsg(t('syserr.10001'))
            setMsgType('error')
            setShowMsg(true)
        })
    }

    const onEncodeContent = () => {
        console.log('encode content')
        if (content) {
            try {
                console.log('try encode')
                const keyAES = CryptoJS.SHA256(encodeCode);
                const keyAESBase64 = CryptoJS.enc.Base64.stringify(keyAES);
                let content2 = Decrypt(content, keyAESBase64, keyAESBase64);
                // dispatch(saveReceiveNoteContent(content));
                // dispatch(saveDecrypted(true));
                setContent(content2);
            } catch (err) {
                console.log(err)
            }
        }
    }

    const onUpdate = () => {
        let params = {
            title,
            toName,
            fromName,
            content,
            encodeCode
        }
    }

    const onCancel = () => {
        let params = {
            triggerId
        }
        console.log(params)
        apiDeleteMyNoteTrigger(params).then((res: any) => {
            if (res.code === 0) {
                setMsg(t('MyNoteSend.MyTriggerEdit.tipCancelSuccess'))
                setMsgType('success')
                setShowMsg(true)
                setTimeout(() => {
                    navigate(-1)
                }, 2000)
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

    return (
        <div style={{}}>
            <Header1/>
            <div style={{display: 'flex', justifyContent: 'center', padding: 10}}>
                <div style={{width: '100%', maxWidth: 1080}}>
                    <Breadcrumbs style={{marginTop: 60}}>
                        <Button onClick={() => {
                            navigate('/Dashboard1')
                        }}>{t('nav.home')}</Button>
                        <Button onClick={() => {
                            navigate(-1)
                        }}>{t('nav.back')}</Button>
                    </Breadcrumbs>
                    {
                        loading ?
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 200
                            }}>
                                <CircularProgress/>
                            </div>
                            :
                            <>
                                <div style={{marginTop: 20, display: 'flex', justifyContent: 'flex-end'}}>
                                    <Button
                                        size='small'
                                        variant='contained'
                                        style={{marginLeft: 20}} onClick={() => {
                                        setModalDelete(true)
                                    }}>{t('MyNoteSend.MyTriggerEdit.btCancel')}</Button>
                                </div>

                                <Card style={{marginTop: 20, background: theme.palette.background.default}}>
                                    <CardContent>
                                        <TextField
                                            variant='standard'
                                            label={t('MyNoteSend.MyTriggerEdit.title')}
                                            multiline
                                            value={title}
                                            style={{fontSize: 20, width: '100%'}}
                                            onChange={e => setTitle(e.target.value)}/>

                                        <div
                                            style={{
                                                color: theme.palette.primary.main,
                                                fontSize: 14
                                            }}>{t('MyNoteSend.MyTriggerEdit.createTime')}: {moment(createTime).format('LLL')}</div>

                                        <TextField
                                            label={t('MyNoteSend.toName')}
                                            variant='standard'
                                            style={{width: '100%', marginTop: 20}}
                                            value={toName}
                                            onChange={e => setToName(e.target.value)}/>

                                        <TextField
                                            label={t('MyNoteSend.fromName')}
                                            variant='standard'
                                            style={{width: '100%', marginTop: 20}}
                                            value={fromName} onChange={e => setFromName(e.target.value)}/>

                                        <div style={{marginTop: 20}}>
                                            <div style={{width: '100%'}}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DemoContainer components={['DatePicker']}>
                                                        <DatePicker
                                                            label={t('MyNotes.SendPage.DatetimeSend.sendTime')}
                                                            onAccept={e => {
                                                                const selectedDate = dayjs(e)
                                                                setTriggerTime(selectedDate)
                                                            }}
                                                            value={triggerTime}
                                                        />
                                                    </DemoContainer>
                                                </LocalizationProvider>
                                            </div>
                                            <div style={{
                                                marginTop: 5,
                                                fontSize: 14,
                                                color: theme.palette.primary.main
                                            }}>{t('MyNotes.SendPage.DatetimeSend.tipSendTime')}</div>
                                        </div>

                                        <TextField
                                            label={t('MyNoteSend.MyTriggerEdit.sendContent')}
                                            multiline value={content}
                                            style={{marginTop: 20, fontSize: 20, width: '100%'}}
                                            onChange={e => setContent(e.target.value)}/>

                                        <div style={{marginTop: 20, display: 'flex', alignItems: 'center'}}>
                                            <TextField
                                                label={t('MyNoteSend.MyTriggerEdit.decode')}
                                                variant='standard'
                                                placeholder={t('MyNoteSend.MyTriggerEdit.decryptionCodeHolder')}
                                                value={encodeCode}
                                                onChange={e => setEncodeCode(e.target.value)}/>
                                            <Button
                                                size='small'
                                                variant='contained'
                                                onClick={() => {
                                                    onEncodeContent()
                                                }}>{t('MyNoteSend.MyTriggerEdit.btDecode')}</Button>
                                        </div>

                                        <div style={{marginTop: 20, textAlign: 'center'}}>
                                            <Button
                                                variant='contained'
                                                onClick={() => {
                                                    onUpdate()
                                                }}>{t('MyNoteSend.MyTriggerEdit.btUpdate')}</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>}
                </div>
            </div>
            <Snackbar open={showMsg}
                      autoHideDuration={2000}
                      anchorOrigin={{vertical: "top", horizontal: 'center'}}
                      onClose={() => {
                          setShowMsg(false)
                      }}
            >
                <Alert variant='filled' severity={msgType}>{msg}</Alert>
            </Snackbar>

            <Dialog open={modalDelete}>
                <DialogContent>{t('MyNoteSend.MyTriggerEdit.tipCancel')}</DialogContent>
                <DialogActions>
                    <Button variant='contained' color='primary' onClick={() => {
                        onCancel()
                    }}>{t('MyNoteSend.MyTriggerEdit.btConfirmCancel')}</Button>
                    <Button variant='contained' color='secondary' onClick={() => {
                        setModalDelete(false)
                    }}>{t('MyNoteSend.MyTriggerEdit.btCancelCancel')}</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
export default MyTriggerEdit
