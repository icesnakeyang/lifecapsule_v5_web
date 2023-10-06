import {
    Alert,
    AlertColor,
    Box,
    Breadcrumbs,
    Button, Card, CardContent, Collapse,
    Dialog, DialogContent,
    DialogTitle,
    Divider,
    Grid, IconButton,
    Snackbar,
    TextField
} from "@mui/material";
import {useEffect, useState} from "react";
import {useTheme} from "@mui/material/styles";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {apiCreateTriggerDatetime, apiListMyContact, apiRequestRsaPublicKey} from "../../api/Api";
import {Encrypt, GenerateKey, RSAencrypt} from "../../common/crypto";
import dayjs, {Dayjs} from 'dayjs';
import {DemoContainer, DemoItem} from '@mui/x-date-pickers/internals/demo';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import {TimePicker} from '@mui/x-date-pickers/TimePicker';
import {DateRangePicker} from '@mui/x-date-pickers-pro/DateRangePicker';
import {saveSendNoteContent, saveSendToEmail, saveSendToName} from "../../store/noteSendSlice";
import GroupIcon from "@mui/icons-material/Group";
import CloseIcon from "@mui/icons-material/Close";
import SendContactRow from "./SendContactRow";
import Header1 from "../common/Header1";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CryptoJS from "crypto-js";

const DatetimeSend = () => {
    const {t} = useTranslation()
    const [saving, setSaving] = useState(false)
    const [title, setTitle] = useState('')
    const sendToName = useSelector((state: any) => state.noteSendSlice.sendToName)
    const sendToEmail = useSelector((state: any) => state.noteSendSlice.sendToEmail)
    const [fromName, setFromName] = useState('')
    const [content, setContent] = useState('')
    const sendNoteContent = useSelector((state: any) => state.noteSendSlice.sendNoteContent)
    const sendNoteTitle = useSelector((state: any) => state.noteSendSlice.sendNoteTitle)
    const nickname = useSelector((state: any) => state.loginSlice.nickname)
    const [contactList, setContactList] = useState([])
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const noteId = useSelector((state: any) => state.noteDataSlice.noteId)
    const navigate = useNavigate()
    const [modalContact, setModalContact] = useState(false)
    const dispatch = useDispatch()
    // const [sendTime, setSendTime] = useState(null)
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState<AlertColor>('success')
    const [showMsg, setShowMsg] = useState(false)
    const theme = useTheme()
    const [showTip1, setShowTip1] = useState(false)
    const [sendTime, setSendTime] = useState<Dayjs | null>(dayjs('2022-04-17T15:30'));

    useEffect(() => {
        setTitle(sendNoteTitle)
        setContent(sendNoteContent)
        setFromName(nickname)
        loadAllData()
    }, [])

    useEffect(() => {
        console.log(sendTime)
        console.log(sendTime?.format('YYYY-MM-DD HH:mm'))
    }, [sendTime])

    const loadAllData = () => {
        let params = {
            pageIndex,
            pageSize
        }
        apiListMyContact(params).then((res: any) => {
            if (res.code === 0) {
                setContactList(res.data.contactList)
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

    const onSend = () => {
        if (!title) {
            setMsg(t('MyNotes.SendPage.tipNoTitle'))
            setMsgType('error')
            setShowMsg(true)
            return;
        }
        if (!sendToName) {
            setMsg(t('MyNotes.SendPage.tipNoToName'))
            setMsgType('error')
            setShowMsg(true)
            return;
        }
        if (!sendToEmail) {
            setMsg(t('MyNotes.SendPage.tipNoEmail'))
            setMsgType('error')
            setShowMsg(true)
            return;
        }
        if (!fromName) {
            setMsg(t('MyNotes.SendPage.tipNoFromName'))
            setMsgType('error')
            setShowMsg(true)
            return;
        }
        if (!content) {
            setMsg(t('MyNotes.SendPage.tipNoContent'))
            setMsgType('error')
            setShowMsg(true)
            return;
        }
        if (!sendTime) {
            setMsg(t('MyNotes.SendPage.DatetimeSend.tipNoSendTime'))
            setMsgType('error')
            setShowMsg(true)
            return;
        }

        let params = {
            noteId,
            title,
            toEmail: sendToEmail,
            toName: sendToName,
            fromName,
            noteContent: content,
            sendTime,
            encryptKey: {},
            keyToken: ''
        }

        setSaving(true)

        //定时发送和主倒计时发送不设置口令，随机生成秘钥，并保存到服务器
        const uuid = GenerateKey();
        const keyAES = CryptoJS.SHA256(uuid);
        const keyAESBase64 = CryptoJS.enc.Base64.stringify(keyAES);
        params.noteContent = Encrypt(content, keyAESBase64, keyAESBase64);
        params.encryptKey = keyAESBase64;
        apiRequestRsaPublicKey().then((res: any) => {
            if (res.code === 0) {
                params.encryptKey =
                    RSAencrypt(params.encryptKey, res.data.publicKey);
                params.keyToken = res.data.keyToken;

                apiCreateTriggerDatetime(params)
                    .then((res2: any) => {
                        if (res2.code === 0) {
                            setMsg(t('MyNotes.SendPage.DatetimeSend.tipCreateDatetimeSendSuccess'))
                            setMsgType('success')
                            setShowMsg(true)
                            if (res2.code === 10002) {
                                navigate('LoginPage')
                            }
                            navigate(-1)
                        } else {
                            setMsg(t('syserr.' + res2.code))
                            setMsgType('error')
                            setShowMsg(true)
                            setSaving(false)
                        }
                    })
                    .catch(() => {
                        setMsg(t('syserr.10001'))
                        setMsgType('error')
                        setShowMsg(true)
                        setSaving(false)
                    });
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
            }
        )
    }
    return (
        <div>
            <Header1/>
            <Breadcrumbs sx={{marginTop: 8, padding: 1}}>
                <Button onClick={() => {
                    navigate(-1)
                }}>{t('nav.back')}</Button>
            </Breadcrumbs>

            <div style={{
                display: "flex",
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 10,
            }}>
                <div style={{
                    padding: 0,
                    maxWidth: 1080,
                    width: '100%',
                }}>
                    {/*说明*/}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <span style={{
                            color: theme.palette.primary.main,
                            fontSize: 20
                        }}>{t('MyNotes.SendPage.DatetimeSend.tipSendByDatetime')}</span>
                        {showTip1 ?
                            <IconButton onClick={() => {
                                console.log('close tip')
                                setShowTip1(false);
                            }}>
                                <ArrowDropUpIcon/>
                            </IconButton>

                            :
                            <IconButton onClick={() => {
                                setShowTip1(true)
                            }}>
                                <ArrowDropDownIcon/>
                            </IconButton>
                        }
                    </div>
                    <div style={{display: 'flex', justifyContent: "center"}}>
                        <Collapse in={showTip1}>
                            <CardContent>
                                <div style={{
                                    marginTop: 10,
                                    color: theme.palette.primary.main
                                }}> {t('MyNotes.SendPage.DatetimeSend.tipSendByDatetime1')}</div>
                                <div style={{
                                    marginTop: 10,
                                    color: theme.palette.primary.main
                                }}> {t('MyNotes.SendPage.DatetimeSend.tipSendByDatetime2')}</div>
                            </CardContent>
                        </Collapse>
                    </div>

                    {/*send note detail*/}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'cetner',
                        marginTop: 20,
                    }}>
                        <Grid container>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    width: '100%',
                                    flexDirection: 'column'
                                }}>
                                    <div style={{width: '100%'}}>
                                        {/*title*/}
                                        <TextField
                                            label={t('MyNotes.SendPage.title')}
                                            variant='standard'
                                            style={{marginTop: 5, width: '100%'}} value={title}
                                            onChange={(e: any) => {
                                                setTitle(e.target.value)
                                            }}/>
                                        <div style={{
                                            color: theme.palette.primary.main,
                                            marginTop: 5,
                                            fontSize: 14
                                        }}>
                                            {t('MyNotes.SendPage.tipTitle')}</div>
                                    </div>

                                    <div style={{marginTop: 20}}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['DateTimePicker']}>
                                                <DateTimePicker
                                                    ampm={false}
                                                    label={t('MyNotes.SendPage.DatetimeSend.sendTime')}
                                                    onAccept={e => {
                                                        // const selectedDate=e as Date
                                                        const selectedDate = dayjs(e as Date)
                                                        console.log(selectedDate)
                                                        // console.log(e.value())
                                                        setSendTime(selectedDate)
                                                    }}
                                                />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                        <div style={{
                                            color: theme.palette.primary.main,
                                            marginTop: 5,
                                            fontSize: 14
                                        }}>{t('MyNotes.SendPage.DatetimeSend.tipSendTime')}</div>
                                    </div>


                                    {/*to name*/}
                                    <div style={{marginTop: 20, display: 'flex'}}>
                                        <TextField
                                            label={t('MyNotes.SendPage.toName')}
                                            variant='standard'
                                            style={{marginTop: 5, width: '100%'}}
                                            onChange={(e: any) => dispatch(saveSendToName(e.target.value))}
                                            value={sendToName}
                                        />
                                        {contactList.length > 0 ?
                                            <div>
                                                <Button style={{}} onClick={() => {
                                                    if (contactList.length > 0) {
                                                        setModalContact(true)
                                                    }
                                                }}><GroupIcon/>
                                                </Button>
                                            </div> : null}
                                    </div>
                                    <div
                                        style={{
                                            color: theme.palette.primary.main,
                                            marginTop: 5,
                                            fontSize: 14
                                        }}>{t('MyNotes.SendPage.tipToName')}</div>

                                    {/*to email*/}

                                    <div
                                        style={{marginTop: 20}}></div>
                                    <TextField
                                        variant='standard'
                                        label={t('MyNotes.SendPage.recipientEmail')}
                                        style={{marginTop: 5}} onChange={e => {
                                        dispatch(saveSendToEmail(e.target.value))
                                    }} value={sendToEmail}/>
                                    <div
                                        style={{
                                            color: theme.palette.primary.main,
                                            marginTop: 5,
                                            fontSize: 14
                                        }}> {t('MyNotes.SendPage.tipRecipientEmail')}</div>


                                    {/*from name*/}
                                    <div style={{marginTop: 20}}>
                                        <TextField
                                            variant='standard'
                                            label={t('MyNotes.SendPage.fromName')}
                                            style={{marginTop: 5, width: '100%'}}
                                            onChange={e => setFromName(e.target.value)}
                                            value={fromName}
                                        />
                                        <div
                                            style={{
                                                color: theme.palette.primary.main,
                                                marginTop: 5,
                                                fontSize: 14
                                            }}>  {t('MyNotes.SendPage.tipFromName')}</div>
                                    </div>
                                    <div style={{marginTop: 20}}>
                                        <TextField
                                            variant='outlined'
                                            multiline
                                            label={t('MyNotes.SendPage.sendContent')}
                                            style={{marginTop: 5, width: '100%'}}
                                            value={content} onChange={(e: any) => {
                                            setContent(e.target.value)
                                            dispatch(saveSendNoteContent(e.target.value))
                                        }}/>
                                        <div
                                            style={{
                                                color: theme.palette.primary.main,
                                                marginTop: 5,
                                                fontSize: 14
                                            }}> {t('MyNotes.SendPage.tipSendContent')}</div>
                                    </div>

                                    <div style={{
                                        margin: 20,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {saving ?
                                            <Button
                                                style={{width: 140}}
                                            >{t('common.btSaving')}
                                            </Button> :
                                            <Button variant='contained' style={{width: 140}} onClick={() => {
                                                onSend();
                                            }}> {t('MyNotes.SendPage.btSend')}</Button>
                                        }
                                    </div>
                                </div>
                            </Grid>

                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <Card
                                    style={{
                                        margin: 20,
                                        marginTop: 0,
                                        padding: 10,
                                        background: theme.palette.background.default
                                    }}>
                                    <div style={{marginTop: 20, textAlign: 'center'}}>
                                        {t('MyNotes.SendPage.preview')}
                                    </div>
                                    <div style={{
                                        marginTop: 20,
                                        fontSize: 20,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        display: 'flex',
                                        fontWeight: 'bold'
                                    }}>{title}</div>
                                    <div style={{marginTop: 20}}>{t('MyNotes.SendPage.fromName')}: {fromName}</div>
                                    <div style={{marginTop: 10}}>{t('MyNotes.SendPage.toName')}: {sendToName}</div>
                                    <Divider/>
                                    <Box style={{whiteSpace: 'pre-line'}}>{sendNoteContent}</Box>
                                </Card>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </div>

            <Dialog open={modalContact}
                    fullWidth>
                <DialogTitle
                    style={{background: theme.palette.primary.dark, color: theme.palette.primary.contrastText}}>
                    {t('MyNotes.SendPage.recentContact')}
                    <IconButton
                        aria-label="close"
                        onClick={() => {
                            setModalContact(false)
                        }}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent style={{background: theme.palette.primary.dark}}>
                    {contactList.length > 0 ?
                        contactList.map((item: any, index) => (
                            <SendContactRow item={item} key={index} onSelect={() => setModalContact(false)}/>
                        )) : null
                    }
                </DialogContent>
            </Dialog>

            <Snackbar open={showMsg}
                      autoHideDuration={2000}
                      anchorOrigin={{vertical: "top", horizontal: 'center'}}
                      onClose={() => {
                          setShowMsg(false)
                      }}
            >
                <Alert variant='filled' severity={msgType}>{msg}</Alert>
            </Snackbar>
        </div>
    )
}
export default DatetimeSend
