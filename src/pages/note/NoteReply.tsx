import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {
    Alert,
    AlertColor,
    Breadcrumbs,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Snackbar,
    TextField
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {useNavigate} from "react-router-dom";
import Header1 from "../common/Header1";
import {saveNoteId, savePTitle} from "../../store/noteDataSlice";
import {apiRequestRsaPublicKey, apiSaveMyNote} from "../../api/Api";
import {Encrypt, GenerateKey, RSAencrypt} from "../../common/crypto";
import CryptoJS from "crypto-js";

const NoteReply = () => {
    const pid = useSelector((state: any) => state.noteDataSlice.noteId)
    const [content, setContent] = useState('')
    const {t} = useTranslation()
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState<AlertColor>()
    const [showMsg, setShowMsg] = useState(false)
    const theme = useTheme()
    const navigate = useNavigate()
    const pTitle = useSelector((state: any) => state.noteDataSlice.pTitle)
    const dispatch = useDispatch()
    const [saving, setSaving] = useState(false)

    const onSave = () => {
        let params = {
            title: pTitle,
            content,
            pid,
            encryptKey: {},
            keyToken: '',
            encrypt: true
        }
        console.log(params)
        setSaving(true)
        /**
         * 加密保存
         */
        const uuid = GenerateKey();
        const keyAES = CryptoJS.SHA256(uuid);
        const keyAESBase64 = CryptoJS.enc.Base64.stringify(keyAES);
        params.content = Encrypt(content, keyAESBase64, keyAESBase64);
        params.encryptKey = keyAESBase64;
        apiRequestRsaPublicKey()
            .then((res1: any) => {
                if (res1.code === 0) {
                    params.encryptKey =
                        RSAencrypt(params.encryptKey, res1.data.publicKey) || "";
                    params.keyToken = res1.data.keyToken;
                    apiSaveMyNote(params)
                        .then((res: any) => {
                            if (res.code === 0) {
                                setMsg(t("MyNotes.NoteNew.tipNoteSaveSuccess"))
                                setMsgType('success')
                                setShowMsg(true)
                                setTimeout(() => {
                                    navigate(-1);
                                }, 1000)

                            } else {
                                console.log('error:' + res.code)
                                setMsg(t("syserr." + res.code))
                                setMsgType('error')
                                setShowMsg(true)
                                setSaving(false);
                            }
                        }).catch(() => {
                        setMsg(t("syserr.10001"))
                        setMsgType('error')
                        setShowMsg(true)
                        setSaving(false);
                    })
                } else {
                    setMsg(t("syserr." + res1.code))
                    setMsgType('error')
                    setShowMsg(true)
                    setSaving(false);
                }
            }).catch(() => {
            setMsg(t("syserr.10001"))
            setMsgType('error')
            setShowMsg(true)
            setSaving(false);
        })
    }

    return (
        <div>
            <Header1/>
            <div style={{display: 'flex', justifyContent: "center"}}>
                <div style={{width: '100%', maxWidth: 1080}}>
                    <Breadcrumbs style={{marginTop: 60}}>
                        <Button onClick={() => {
                            navigate('/Dashboard1')
                        }}>{t('nav.home')}</Button>
                        <Button onClick={() => {
                            navigate(-1)
                        }}>{t('nav.back')}</Button>
                    </Breadcrumbs>
                    <Card style={{background: theme.palette.background.default, marginTop: 20}} raised>
                        <CardContent>
                            <TextField
                                variant='standard'
                                label={t('MyNotes.title')}
                                style={{width: '100%'}}
                                value={pTitle}
                                onChange={e => {
                                    dispatch(savePTitle(e.target.value))
                                }}
                            />

                            <TextField
                                multiline
                                label={t('MyNotes.content')}
                                style={{width: '100%', marginTop: 20}}
                                onChange={e => {
                                    setContent(e.target.value)
                                }}
                            />
                            <div style={{textAlign: "center", marginTop: 20}}>
                                {saving ?
                                    <CircularProgress/>
                                    :
                                    <Button variant='contained' onClick={() => {
                                        onSave()
                                    }}>{t('common.btSave')}</Button>
                                }
                            </div>
                        </CardContent>
                    </Card>
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
export default NoteReply
