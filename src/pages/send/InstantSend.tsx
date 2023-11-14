import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {apiCreateTriggerInstant, apiListMyContact, apiRequestRsaPublicKey} from "../../api/Api";
import {Encrypt, GenerateKey, RSAencrypt} from "../../common/crypto";
import {
    Alert,
    AlertColor,
    Box,
    Breadcrumbs,
    Button, Card, CardContent, CardHeader, CircularProgress, Collapse,
    Dialog, DialogContent, DialogTitle,
    Divider,
    Grid, Hidden, IconButton, Input, Paper,
    Snackbar,
    Stack,
    TextField
} from "@mui/material";
import TagFacesIcon from '@mui/icons-material/TagFaces';
import GroupIcon from '@mui/icons-material/Group';
import {saveSendNoteContent, saveSendToEmail, saveSendToName} from "../../store/noteSendSlice";
import InfoIcon from '@mui/icons-material/Info';
import SendContactRow from "./SendContactRow";
import {useTheme} from "@mui/material/styles";
import Header1 from "../common/Header1";
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CryptoJS from "crypto-js";

const InstantSend = () => {
    const noteId = useSelector((state: any) => state.noteDataSlice.noteId)
    const {t} = useTranslation();
    const [title, setTitle] = useState('')
    const [fromName, setFromName] = useState('')
    const [encodeKey, setEncodeKey] = useState('')
    const [saving, setSaving] = useState(false)
    const sendNoteContent = useSelector((state: any) => state.noteSendSlice.sendNoteContent)
    const sendNoteTitle = useSelector((state: any) => state.noteSendSlice.sendNoteTitle)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [content, setContent] = useState('')
    const [modalContact, setModalContact] = useState(false)
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [contactList, setContactList] = useState([])
    const sendToName = useSelector((state: any) => state.noteSendSlice.sendToName) || ''
    const sendToEmail = useSelector((state: any) => state.noteSendSlice.sendToEmail)
    const nickname = useSelector((state: any) => state.loginSlice.nickname)
    const [msg, setMsg] = useState("")
    const [msgType, setMsgType] = useState<AlertColor>('success')
    const [showMsg, setShowMsg] = useState(false)
    const theme = useTheme()
    const [showTip1, setShowTip1] = useState(false)

    useEffect(() => {
        setContent(sendNoteContent)
        setTitle(sendNoteTitle)
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
        if (!sendNoteContent) {
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
            noteContent: sendNoteContent,
            encryptKey: {},
            keyToken: ''
        }

        setSaving(true)


        if (encodeKey) {
            //有encodeKey就用encodeKey加密，content，但不保存到服务器
            const keyAES = CryptoJS.SHA256(encodeKey);
            const keyAESBase64 = CryptoJS.enc.Base64.stringify(keyAES);
            params.noteContent = Encrypt(content, keyAESBase64, keyAESBase64);
        } else {
            //没有encodeKey，就随机生成秘钥，并保存到服务器
            const uuid = GenerateKey();
            const keyAES = CryptoJS.SHA256(uuid);
            const keyAESBase64 = CryptoJS.enc.Base64.stringify(keyAES);
            params.noteContent = Encrypt(content, keyAESBase64, keyAESBase64);
            params.encryptKey = keyAESBase64;
        }

        apiRequestRsaPublicKey().then((res: any) => {
            if (res.code === 0) {
                if (!encodeKey) {
                    params.encryptKey = RSAencrypt(params.encryptKey, res.data.publicKey);
                    params.keyToken = res.data.keyToken;
                } else {
                    params.encryptKey = ''
                }
                apiCreateTriggerInstant(params)
                    .then((res2: any) => {
                        if (res2.code === 0) {
                            setMsg(t('MyNotes.SendPage.InstantSend.tipSendSuccess'))
                            setMsgType('success')
                            setShowMsg(true)
                            // setMsg('sdfsdf')
                            // setMsgType('success')
                            // setShowMsg(true)
                            setTimeout(() => {
                                navigate(-1)
                            }, 2000)

                        } else {
                            setMsg(t('syserr.' + res2.code))
                            setMsgType('error')
                            setShowMsg(true)
                            setSaving(false)
                            if (res2.code === 10002) {
                                navigate('LoginPage')
                            }
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

    const onSelectContact = (data: any) => {
        setModalContact(false)
    }
    return (
        <div style={{}}>
            <Header1/>
            <Breadcrumbs sx={{marginTop: 8}}>
                <Button onClick={() => {
                    navigate(-1)
                }}>
                    {t("nav.back")}
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
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                            <span style={{color: theme.palette.primary.main}}>
                            {t('MyNotes.SendPage.InstantSend.tipNoteSend')}
                                </span>
                        {showTip1 ?
                            <IconButton onClick={() => {
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
                    <div>
                        <Collapse in={showTip1}>
                            <CardContent>
                                <div style={{
                                    marginTop: 0,
                                    color: theme.palette.primary.main
                                }}> {t('MyNotes.SendPage.InstantSend.tipNoteSend2')}</div>
                                <div style={{
                                    marginTop: 0,
                                    color: theme.palette.primary.main
                                }}> {t('MyNotes.SendPage.InstantSend.tipNoteSend3')}</div>
                            </CardContent>
                        </Collapse>
                    </div>


                    {/*send note detail*/}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'cetner',
                        marginTop: 20
                    }}>
                        <div style={{width: '100%', maxWidth: 1080}}>
                            <Grid container>
                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: 'center',
                                        width: '100%'
                                    }}>
                                        <div style={{maxWidth: 500, width: '100%'}}>
                                            <TextField
                                                variant='standard'
                                                label={t('MyNotes.SendPage.title')}
                                                style={{width: '100%'}}
                                                multiline
                                                value={title}
                                                onChange={(e: any) => {
                                                    setTitle(e.target.value);
                                                }}/>
                                            <div
                                                style={{color: theme.palette.primary.main, marginTop: 5, fontSize: 14}}>
                                                {t('MyNotes.SendPage.tipTitle')}</div>

                                            {/*to name*/}
                                            <div style={{marginTop: 20}}>
                                                <Stack direction='row'>
                                                    <TextField
                                                        variant='standard'
                                                        label={t('MyNotes.SendPage.toName')}
                                                        style={{width: '100%'}}
                                                        onChange={(e: any) => dispatch(saveSendToName(e.target.value))}
                                                        value={sendToName}
                                                    />
                                                    <Button style={{marginTop: 5}} onClick={() => {
                                                        setModalContact(true)
                                                    }}><GroupIcon/>
                                                    </Button>
                                                </Stack>
                                            </div>
                                            <div
                                                style={{
                                                    color: theme.palette.primary.main,
                                                    marginTop: 5,
                                                    fontSize: 14
                                                }}>{t('MyNotes.SendPage.tipToName')}</div>

                                            {/*to email*/}
                                            <div style={{marginTop: 20}}>
                                                <TextField
                                                    variant='standard'
                                                    label={t('MyNotes.SendPage.recipientEmail')}
                                                    style={{width: '100%'}}
                                                    onChange={e => {
                                                        dispatch(saveSendToEmail(e.target.value))
                                                    }} value={sendToEmail}/>
                                            </div>
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
                                            </div>
                                            <div
                                                style={{
                                                    color: theme.palette.primary.main,
                                                    marginTop: 5,
                                                    fontSize: 14
                                                }}>  {t('MyNotes.SendPage.tipFromName')}</div>

                                            <div style={{marginTop: 20}}>
                                                <TextField
                                                    variant='outlined'
                                                    label={t('MyNotes.SendPage.sendContent')}
                                                    multiline
                                                    style={{marginTop: 5, width: '100%'}}
                                                    value={content} onChange={(e: any) => {
                                                    setContent(e.target.value)
                                                    dispatch(saveSendNoteContent(e.target.value))
                                                }}/>
                                            </div>
                                            <div
                                                style={{
                                                    color: theme.palette.primary.main,
                                                    marginTop: 5,
                                                    fontSize: 14
                                                }}> {t('MyNotes.SendPage.tipSendContent')}</div>

                                            {/*Encryption*/}
                                            <div
                                                style={{
                                                    color: theme.palette.primary.main,
                                                    marginTop: 20
                                                }}>
                                            </div>
                                            <TextField
                                                variant='standard'
                                                label={t('MyNotes.SendPage.InstantSend.encryptSend')}
                                                style={{marginTop: 5, width: '100%'}}
                                                placeholder={t('MyNotes.SendPage.InstantSend.encode')}
                                                onChange={(e: any) => setEncodeKey(e.target.value)}
                                                value={encodeKey}
                                            />
                                            <div style={{display: 'flex', alignItems: 'flex-start'}}>
                                                {/*<InfoIcon style={{color: 'cornflowerblue', marginTop: 5}}/>*/}
                                                <div
                                                    style={{
                                                        marginLeft: 0,
                                                        fontSize: 14,
                                                        color: theme.palette.primary.main
                                                    }}>{t('MyNotes.SendPage.InstantSend.tip2')}</div>
                                            </div>
                                            <div
                                                style={{
                                                    color: theme.palette.primary.main,
                                                    marginTop: 5,
                                                    fontSize: 14
                                                }}>   {t('MyNotes.SendPage.InstantSend.tip1')}</div>
                                            <div
                                                style={{
                                                    color: theme.palette.error.main,
                                                    fontSize: 14
                                                }}>  {t('MyNotes.SendPage.InstantSend.tipEncodeWarn1')}</div>
                                            <div
                                                style={{
                                                    color: theme.palette.info.main,
                                                    fontSize: 14
                                                }}>{t('MyNotes.SendPage.InstantSend.tipEncode2')}</div>


                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginTop: 20
                                            }}>
                                                {saving ?
                                                    <CircularProgress/>
                                                     :
                                                    <Button variant='contained' style={{width: 140}}
                                                            onClick={() => {
                                                                onSend();
                                                            }}> {t('MyNotes.SendPage.btSend')}</Button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </Grid>

                                <Hidden smUp>
                                    <Grid item xs={12}>
                                        <Divider style={{marginTop: 20, marginBottom: 10}}/>
                                    </Grid>
                                </Hidden>

                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                    <div style={{border: '1px solid #ccc', padding: 10, borderRadius: 2, margin: 10}}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            width: '100%',
                                        }}>
                                            <div style={{width: '100%', maxWidth: 500}}>
                                                <div
                                                    style={{width: '100%', maxWidth: 500, textAlign: 'center'}}>
                                                    {t('MyNotes.SendPage.preview')}
                                                    <div style={{
                                                        fontSize: 20,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        display: 'flex',
                                                        fontWeight: 'bold',
                                                        marginTop: 2
                                                    }}>{title}</div>
                                                </div>

                                                <Box
                                                    sx={{marginTop: 2}}>{t('MyNotes.SendPage.fromName')}: {fromName}</Box>
                                                <Box
                                                    sx={{marginTop: 1}}>{t('MyNotes.SendPage.toName')}: {sendToName}</Box>
                                                <Divider style={{padding: 10}}/>
                                                <Box style={{whiteSpace: 'pre-line'}}>{sendNoteContent}</Box>
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={modalContact}
                    fullWidth
            >
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
                            <SendContactRow item={item} key={index} onSelect={onSelectContact}/>
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
export default InstantSend
