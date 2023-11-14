import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {apiGetMyReceiveNote, apiReplyReceiveNote, apiRequestRsaPublicKey} from "../../api/Api";
import {Decrypt, Decrypt2, Encrypt, GenerateKey, GenerateRandomString16, RSAencrypt} from "../../common/crypto";
import {
    Alert,
    AlertColor,
    Breadcrumbs,
    Button,
    Card, CardContent,
    CardHeader, CircularProgress, Divider,
    Snackbar,
    TextField
} from "@mui/material";
import moment from "moment";
import {useTheme} from "@mui/material/styles";
import Header1 from "../common/Header1";
import {useNavigate} from "react-router-dom";
import CryptoJS from "crypto-js";

const MyReceiveNoteDetail = () => {
    const sendLogId = useSelector((state: any) => state.noteReceiveSlice.sendLogId)
    const {t} = useTranslation();
    const [loading, setLoading] = useState(true);
    const [sendLog, setSendLog] = useState<any>();
    const [decode, setDecode] = useState("");
    const [noteContent, setNoteContent] = useState("");
    const theme = useTheme()
    const [decoding, setDecoding] = useState(false);
    const [triggerType, setTriggerType] = useState("");
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState<AlertColor>('success')
    const [showMsg, setShowMsg] = useState(false)
    const [showTip1, setShowTip1] = useState(false)
    const navigate = useNavigate()
    const [sending, setSending] = useState(false)
    const [replyContent, setReplyContent] = useState('')
    const [replyTitle, setReplyTitle] = useState('')

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = () => {
        let params = {
            sendLogId,
            encryptKey: {},
            keyToken: "",
        };
        apiRequestRsaPublicKey().then((res: any) => {
            if (res.code === 0) {
                const keyAES_1 = GenerateRandomString16();
                params.encryptKey = RSAencrypt(keyAES_1, res.data.publicKey);
                params.keyToken = res.data.keyToken;

                apiGetMyReceiveNote(params)
                    .then((res: any) => {
                        if (res.code === 0) {
                            let data = res.data;
                            setTriggerType(data.triggerType);
                            if (data.userEncodeKey) {
                                // setEncrypt(0);
                                let strKey = data.userEncodeKey;
                                strKey = Decrypt2(strKey, keyAES_1);
                                let content = Decrypt(data.content, strKey, strKey);
                                // setEncrypt(1);
                                setNoteContent(content);
                            } else {
                                // setEncrypt(0);
                                setNoteContent(data.content);
                            }
                            setReplyTitle('Re:' + data.title)
                            setSendLog(res.data);
                            setLoading(false);
                        } else {
                            setMsg(t("syserr." + res.code))
                            setMsgType('error')
                            setShowMsg(true)
                        }
                    })
                    .catch(() => {
                        setMsg(t("syserr.10001"))
                        setMsgType('error')
                        setShowMsg(true)
                    });
            }
        });
    };

    const onDecode = () => {
        if (!decode) {
            return;
        }
        if (sendLog && sendLog.content) {
            try {
                setDecoding(true);
                const keyAES = CryptoJS.SHA256(decode);
                const keyAESBase64 = CryptoJS.enc.Base64.stringify(keyAES);
                let content = Decrypt(sendLog.content, keyAESBase64, keyAESBase64);
                setNoteContent(content);
                setDecoding(false);
            } catch (err) {
            }
        }
    };

    const onSendReply = () => {
        if (!replyContent) {
            return
        }
        let params = {
            content: replyContent,
            title: replyTitle,
            pid: sendLogId,
            type: 'NOTE_SEND_LOG',
            encryptKey: {},
            keyToken: '',
        }
        /**
         * 加密保存
         */
        setSending(true)
        const uuid = GenerateKey();
        const keyAES = CryptoJS.SHA256(uuid);
        const keyAESBase64 = CryptoJS.enc.Base64.stringify(keyAES);
        params.content = Encrypt(replyContent, keyAESBase64, keyAESBase64);
        params.encryptKey = keyAESBase64;
        apiRequestRsaPublicKey()
            .then((res2: any) => {
                if (res2.code === 0) {
                    params.encryptKey =
                        RSAencrypt(params.encryptKey, res2.data.publicKey) || "";
                    params.keyToken = res2.data.keyToken;
                    apiReplyReceiveNote(params).then((res: any) => {
                        if (res.code === 0) {
                            setMsg(t('MyReceiveNote.MyReceiveNoteDetail.tipSendReplySuccess'))
                            setMsgType('success')
                            setShowMsg(true)
                            setTimeout(() => {
                                navigate(-1)
                            }, 1000)

                        } else {
                            setMsg(t('syserr.' + res.code))
                            setMsgType('error')
                            setShowMsg(true)
                            setSending(false)
                        }
                    }).catch(() => {
                        setMsg(t('syserr.10001'))
                        setMsgType('error')
                        setShowMsg(true)
                        setSending(false)
                    })
                } else {
                    setMsg(t('syserr.' + res2.code))
                    setMsgType('error')
                    setShowMsg(true)
                    setSending(false)
                }
            }).catch(() => {
            setMsg(t('syserr.10001'))
            setMsgType('error')
            setShowMsg(true)
            setSending(false)
        })
    }
    return (
        <div style={{}}>
            <Header1/>
            <div style={{display: 'flex', justifyContent: 'center', padding: 10}}>
                <div style={{width: '100%', maxWidth: 1080}}>
                    <Breadcrumbs style={{marginTop: 80, marginLeft: 0}}>
                        <Button onClick={() => {
                            navigate('/Dashboard1')
                        }}>{t('nav.home')}</Button>
                        <Button onClick={() => {
                            navigate(-1)
                        }}>{t('nav.back')}</Button>
                    </Breadcrumbs>
                    {loading ? (
                        <div
                            style={{display: "flex", justifyContent: "center", marginTop: 200}}
                        >
                            <div>Loading...</div>
                        </div>
                    ) : (
                        <div style={{padding: 0, display: 'flex', justifyContent: 'center'}}>
                            <div style={{width: '100%'}}>
                                <Card style={{background: theme.palette.background.default}}>
                                    <CardHeader title={sendLog.title} style={{color: theme.palette.primary.main}}>

                                    </CardHeader>
                                    <CardContent>
                                        <div style={{marginTop: 0, color: theme.palette.primary.main}}>
                                            {t("MyReceiveNote.MyReceiveNoteDetail.fromName")}：{sendLog.fromName}
                                        </div>
                                        <div
                                            style={{
                                                color: theme.palette.primary.main,
                                                marginTop: 20,
                                            }}
                                        >
                                            {t("MyReceiveNote.MyReceiveNoteDetail.sentTime")}：
                                            {moment(sendLog.sendTime).format("LLL")}
                                        </div>
                                        <TextField
                                            multiline
                                            style={{marginTop: 30, width: '100%', color: theme.palette.primary.main}}
                                            label={t("MyReceiveNote.MyReceiveNoteDetail.content")}
                                            value={noteContent}
                                            aria-readonly
                                        />
                                        {triggerType === "INSTANT_MESSAGE" ? (
                                            <div style={{marginTop: 20}}>
                                                <div style={{fontSize: 14, color: theme.palette.primary.main}}>
                                                    {t("MyReceiveNote.MyReceiveNoteDetail.tipEncrypt")}
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    marginTop: 10
                                                }}>
                                                    <TextField
                                                        variant='standard'
                                                        label={t('MyReceiveNote.MyReceiveNoteDetail.decryptionCode')}
                                                        style={{marginTop: 0, width: "auto", height: "auto"}}
                                                        onChange={(e) => {
                                                            setDecode(e.target.value);
                                                        }}
                                                    />

                                                    <Button
                                                        variant='contained'
                                                        size='small'
                                                        style={{marginTop: 10, marginLeft: 10}}
                                                        onClick={() => {
                                                            onDecode();
                                                        }}
                                                    >
                                                        {t("MyReceiveNote.MyReceiveNoteDetail.btDecode")}
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div></div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card style={{marginTop: 20, background: theme.palette.background.default}}>
                                    <CardContent>
                                        <div
                                            style={{color: theme.palette.primary.main}}>{t('MyReceiveNote.MyReceiveNoteDetail.tipReply1')}: {sendLog.fromName}</div>
                                        <Divider style={{paddingBottom: 10}}/>
                                        <TextField
                                            variant='standard'
                                            label='Reply title'
                                            style={{marginTop: 10, width: '100%'}}
                                            value={replyTitle}
                                            onChange={e => {
                                                setReplyTitle(e.target.value)
                                            }}
                                        />
                                        <TextField
                                            multiline
                                            label={t('MyReceiveNote.MyReceiveNoteDetail.replyContent')}
                                            style={{marginTop: 20, width: '100%'}}
                                            onChange={e => {
                                                setReplyContent(e.target.value)
                                            }}
                                        />
                                        <div style={{marginTop: 20, textAlign: 'center'}}>
                                            {sending ?
                                                <CircularProgress/>
                                                :
                                                <Button variant='contained' style={{marginTop: 10, width: 140}}
                                                        onClick={() => {
                                                            onSendReply()
                                                        }}>
                                                    {t('MyReceiveNote.MyReceiveNoteDetail.btSendReply')}
                                                </Button>
                                            }
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
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
export default MyReceiveNoteDetail
