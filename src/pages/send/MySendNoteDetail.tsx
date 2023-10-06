import {useEffect, useState} from "react";
import {
    Alert,
    AlertColor,
    Breadcrumbs,
    Button,
    Card,
    CardContent, Chip,
    CircularProgress, Grid,
    Snackbar, Stack,
    TextField
} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import {apiGetMyNoteSendOutLog, apiRequestRsaPublicKey} from "../../api/Api";
import {Decrypt, Decrypt2, GenerateRandomString16, RSAencrypt} from "../../common/crypto";
import {useTranslation} from "react-i18next";
import moment from "moment";
import Header1 from "../common/Header1";
import CryptoJS from "crypto-js";
import {useTheme} from "@mui/material/styles";
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';

const MySendNoteDetail = () => {
    const para = useLocation().state;
    const sendLogId = useLocation().state.sendLogId
    const [loading, setLoading] = useState(false)
    const [sendLog, setSendLog] = useState<any>();
    const [decode, setDecode] = useState("");
    const [noteContent, setNoteContent] = useState("");
    const [triggerType, setTriggerType] = useState("");
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState<AlertColor>('success')
    const [showMsg, setShowMsg] = useState(false)
    const {t} = useTranslation()
    const navigate = useNavigate()
    const theme = useTheme()

    useEffect(() => {
        console.log(para)
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

                apiGetMyNoteSendOutLog(params)
                    .then((res: any) => {
                        if (res.code === 0) {
                            let data = res.data.noteSendLog;
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
                            setSendLog(res.data.noteSendLog);
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
                const keyAES = CryptoJS.SHA256(decode);
                const keyAESBase64 = CryptoJS.enc.Base64.stringify(keyAES);
                let content = Decrypt(sendLog.content, keyAESBase64, keyAESBase64);
                setNoteContent(content);
            } catch (err) {
                console.log(err)
            }
        }
    };
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
                    {loading ? (
                            <div
                                style={{textAlign: 'center', marginTop: 200}}
                            >
                                <CircularProgress/>
                            </div>
                        ) :
                        sendLog ?
                            <div
                                style={{}}
                            >
                                <div style={{fontSize: 20, marginTop: 10, marginBottom: 10}}>
                                    {sendLog.title}
                                </div>
                                <div>
                                    {t("Trigger.triggerType")}：<Chip label={t("Trigger." + triggerType)}/>
                                </div>
                                <div
                                    style={{
                                        marginTop: 10,
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    {t("MyNoteSend.MySendNoteDetail.sendToUser")}：
                                    <PersonIcon style={{color: theme.palette.primary.main}}/>
                                    {sendLog.toName}
                                    <EmailIcon
                                        style={{marginLeft: 10, color: theme.palette.primary.main}}/> {sendLog.toEmail}
                                </div>
                                <div
                                    style={{
                                        marginTop: 10,
                                    }}
                                >
                                    {t("MyNoteSend.sendTime")}：
                                    {moment(sendLog.sendTime).format("LLL")}
                                </div>
                                <div style={{marginTop: 10}}>
                                    <Stack direction='row'>
                                        <div style={{
                                            alignItems: 'center',
                                            display: 'flex'
                                        }}>{t('MyNoteSend.MySendNoteDetail.readTime')}：
                                        </div>
                                        {sendLog.readTime ?
                                            <span>{t('MyNoteSend.MySendNoteDetail.readTime')}</span> :
                                            <span><Chip size='small' style={{background: '#f6af02'}}
                                                        label={t('MyNoteSend.MySendNoteDetail.unRead')}/></span>
                                        }
                                    </Stack>
                                </div>
                                <TextField
                                    label={t("MyNoteSend.MySendNoteDetail.content")}
                                    multiline
                                    style={{
                                        marginTop: 20,
                                        width: '100%'
                                    }}
                                    value={noteContent}
                                />
                                {triggerType === "INSTANT_MESSAGE" ? (
                                    <div style={{marginTop: 10}}>
                                        <div style={{display: 'flex'}}>
                                            <TextField
                                                label={t("MyNoteSend.MySendNoteDetail.encode")}
                                                variant='standard'
                                                style={{}}
                                                onChange={(e) => {
                                                    setDecode(e.target.value);
                                                }}
                                            />
                                            <Button
                                                variant='contained'
                                                onClick={() => {
                                                    onDecode();
                                                }}
                                            >
                                                {t("MyNoteSend.MySendNoteDetail.btDecode")}{" "}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div></div>
                                )}
                            </div>
                            : null
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
                <Alert variant='filled' severity={msgType}>{msg}</Alert>
            </Snackbar>
        </div>
    )
}
export default MySendNoteDetail
