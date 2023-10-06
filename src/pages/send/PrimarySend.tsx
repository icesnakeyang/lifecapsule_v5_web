import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {apiCreateTriggerPrimary, apiListMyContact, apiRequestRsaPublicKey} from "../../api/Api";
import {
    Alert,
    AlertColor, Box,
    Breadcrumbs,
    Button,
    Card, CardContent, CardHeader, Collapse,
    Dialog, DialogContent, DialogTitle,
    Divider,
    Grid, IconButton,
    Modal,
    Snackbar, Stack,
    TextField, useMediaQuery
} from "@mui/material";
import {Encrypt, GenerateKey, RSAencrypt} from "../../common/crypto";
import {saveSendNoteContent, saveSendToEmail, saveSendToName} from "../../store/noteSendSlice";
import GroupIcon from "@mui/icons-material/Group";
import SendContactRow from "./SendContactRow";
import {useTheme} from "@mui/material/styles";
import Header1 from "../common/Header1";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import CryptoJS from "crypto-js";

const PrimarySend = () => {
    const theme = useTheme()
    const {t} = useTranslation()
    const sendToName = useSelector((state: any) => state.noteSendSlice.sendToName)
    const [title, setTitle] = useState('')
    const dispatch = useDispatch()
    const [modalContact, setModalContact] = useState(false)
    const sendToEmail = useSelector((state: any) => state.noteSendSlice.sendToEmail)
    const [fromName, setFromName] = useState('')
    const [content, setContent] = useState('')
    const [saving, setSaving] = useState(false)
    const sendNoteContent = useSelector((state: any) => state.noteSendSlice.sendNoteContent)
    const sendNoteTitle = useSelector((state: any) => state.noteSendSlice.sendNoteTitle)
    const [contactList, setContactList] = useState([])
    const navigate = useNavigate()
    const noteId = useSelector((state: any) => state.noteDataSlice.noteId)
    const nickname = useSelector((state: any) => state.loginSlice.nickname)
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [msg, setMsg] = useState("")
    const [msgType, setMsgType] = useState<AlertColor>('success')
    const [showMsg, setShowMsg] = useState(false)
    const [showTip1, setShowTip1] = useState(false)
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const maxWidth = useMediaQuery(theme.breakpoints.up('md')) ? 'md' : 'xs';

    useEffect(() => {
        setTitle(sendNoteTitle)
        setContent(sendNoteContent)
        setFromName(nickname)
        loadAllData()
    }, [])

    const loadAllData = () => {
        let params = {
            pageIndex,
            pageSize
        }
        apiListMyContact(params).then((res: any) => {
            if (res.code === 0) {
                setContactList(res.data.contactList)
            } else {
                // message.error(t('syserr.' + res.code))
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

        let params = {
            noteId,
            title,
            toEmail: sendToEmail,
            toName: sendToName,
            fromName,
            noteContent: content,
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

                apiCreateTriggerPrimary(params)
                    .then((res2: any) => {
                        if (res2.code === 0) {
                            setMsg(t('MyNotes.SendPage.PrimarySend.tipCreatePrimarySendSuccess'))
                            setMsgType('error')
                            setShowMsg(true)
                            if (res2.code === 10002) {
                                navigate('LoginPage')
                            }
                            navigate(-1)
                        } else {
                            setMsgType(t('syserr.' + res2.code))
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
            <Breadcrumbs sx={{marginTop: 8}}>
                <Button onClick={() => {
                    navigate(-1)
                }}>
                    {t('nav.back')}
                </Button>
            </Breadcrumbs>

            <div style={{
                marginTop: 0,
                padding: 10,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                {/*说明*/}
                <div style={{
                    padding: 0,
                    marginTop: 0,
                    maxWidth: 1080,
                    width: '100%',
                }}>
                    <div style={{}}>
                        <div style={{display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'}}>
                            <span style={{color: theme.palette.primary.main}}>
                                    {t('MyNotes.SendPage.PrimarySend.tipSendByPrimary')}
                                </span>
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
                        <Collapse in={showTip1}>
                            <div style={{}}>
                                <div style={{
                                    marginTop: 0,
                                    color: theme.palette.primary.main,
                                }}> {t('MyNotes.SendPage.PrimarySend.tipSendByPrimary1')}</div>
                                <div style={{
                                    marginTop: 0,
                                    color: theme.palette.primary.main
                                }}> {t('MyNotes.SendPage.PrimarySend.tipSendByPrimary2')}</div>
                            </div>
                        </Collapse>
                    </div>


                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'cetner',
                        marginTop: 20,
                        width: '100%',
                    }}>

                        <div style={{width: '100%', maxWidth: 1080}}>
                            <Grid container>
                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: 'center',
                                        width: '100%',
                                    }}>

                                        {/*title*/}
                                        <div style={{width: '100%'}}>
                                            <TextField
                                                variant='standard'
                                                label={t('MyNotes.SendPage.title')}
                                                style={{width: '100%'}}
                                                value={title} onChange={(e: any) => {
                                                setTitle(e.target.value);
                                            }}/>
                                            <div
                                                style={{color: theme.palette.primary.main, marginTop: 5, fontSize: 10}}>
                                                {t('MyNotes.SendPage.tipTitle')}</div>

                                            {/*to name*/}
                                            <div
                                                style={{marginTop: 20}}>
                                                <Stack direction='row'>
                                                    <TextField
                                                        variant='standard'
                                                        label={t('MyNotes.SendPage.toName')}
                                                        style={{width: '100%'}}
                                                        onChange={(e: any) => dispatch(saveSendToName(e.target.value))}
                                                        value={sendToName}
                                                    />
                                                    <Button style={{marginTop: 5}} onClick={() => {
                                                        if (contactList.length > 0) {
                                                            setModalContact(true)
                                                        }
                                                    }}><GroupIcon/>
                                                    </Button>
                                                </Stack>
                                                <div
                                                    style={{
                                                        color: theme.palette.primary.main,
                                                        marginTop: 5,
                                                        fontSize: 10
                                                    }}>{t('MyNotes.SendPage.tipToName')}</div>
                                            </div>

                                            {/*to email*/}
                                            <div style={{marginTop: 20}}>
                                                <TextField
                                                    variant='standard'
                                                    label={t('MyNotes.SendPage.recipientEmail')}
                                                    style={{marginTop: 5, width: '100%'}} onChange={e => {
                                                    dispatch(saveSendToEmail(e.target.value))
                                                }} value={sendToEmail}/>
                                                <div
                                                    style={{
                                                        color: theme.palette.primary.main,
                                                        marginTop: 5,
                                                        fontSize: 10
                                                    }}> {t('MyNotes.SendPage.tipRecipientEmail')}</div>
                                            </div>

                                            {/*from name*/}
                                            <div style={{marginTop: 20}}>
                                                <TextField
                                                    variant='standard'
                                                    label={t('MyNotes.SendPage.fromName')}
                                                    style={{width: '100%'}}
                                                    onChange={e => setFromName(e.target.value)}
                                                    value={fromName}
                                                />
                                                <div
                                                    style={{
                                                        color: theme.palette.primary.main,
                                                        marginTop: 5,
                                                        fontSize: 10
                                                    }}>  {t('MyNotes.SendPage.tipFromName')}</div>
                                            </div>

                                            <div style={{marginTop: 20}}>
                                                <TextField
                                                    variant="outlined"
                                                    label={t('MyNotes.SendPage.sendContent')}
                                                    multiline
                                                    style={{marginTop: 5, width: '100%'}}
                                                    value={content} onChange={(e: any) => {
                                                    setContent(e.target.value)
                                                    dispatch(saveSendNoteContent(e.target.value))
                                                }}/>
                                                <div
                                                    style={{
                                                        color: theme.palette.primary.main,
                                                        marginTop: 5,
                                                        fontSize: 10
                                                    }}> {t('MyNotes.SendPage.tipSendContent')}</div>
                                            </div>

                                            <div style={{
                                                marginTop: 20,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {saving ?
                                                    <Button variant='contained'
                                                            style={{width: 140}}
                                                    >{t('common.btSaving')}
                                                    </Button> :
                                                    <Button variant='contained' style={{width: 140}} onClick={() => {
                                                        onSend();
                                                    }}> {t('MyNotes.SendPage.btSend')}</Button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </Grid>

                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: 'center',
                                        width: '100%'
                                    }}>
                                        <div style={{maxWidth: 500, width: '100%'}}>
                                            <div style={{
                                                textAlign: 'center',
                                                marginTop: 20
                                            }}>{t('MyNotes.SendPage.preview')}</div>
                                            <Card style={{
                                                margin: 20,
                                                padding: 10,
                                                background: theme.palette.background.default
                                            }}>
                                                <div
                                                    style={{
                                                        fontSize: 20,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        display: 'flex',
                                                        fontWeight: 'bold'
                                                    }}>{title}</div>
                                                <div
                                                    style={{marginTop: 20}}>{t('MyNotes.SendPage.fromName')}: {fromName}</div>
                                                <div
                                                    style={{marginTop: 10}}>{t('MyNotes.SendPage.toName')}: {sendToName}</div>
                                                <Divider/>
                                                <div style={{whiteSpace: 'pre-line'}}>{sendNoteContent}</div>
                                            </Card>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                    </div>

                    <Dialog open={modalContact}
                            fullScreen={fullScreen}
                            style={{width: '100%', padding: 0}}
                    >
                        <DialogTitle>{t('MyNotes.SendPage.recentContact')}</DialogTitle>
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
                        <DialogContent style={{width: '100%'}}>
                            <Card title={t('MyNotes.SendPage.recentContact')} style={{width: '100%'}}>
                                {contactList.length > 0 ?
                                    contactList.map((item: any, index) => (
                                        <SendContactRow item={item} key={index}
                                                        onSelect={() => setModalContact(false)}/>
                                    )) : null
                                }
                            </Card>
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
            </div>
        </div>
    )
}
export default PrimarySend
