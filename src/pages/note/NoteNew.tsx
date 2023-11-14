import {
    Alert, AlertColor,
    Box,
    Breadcrumbs,
    Button, CircularProgress,
    Container,
    Snackbar,
    Stack,
    Switch,
    TextField
} from "@mui/material";
import Header1 from "../common/Header1";
import NoteEditTagRow from "../tag/NoteEditTagRow";
import InfoIcon from "@mui/icons-material/Info";
import {apiRequestRsaPublicKey, apiSaveMyNote} from "../../api/Api";
import TagEditModal from "../tag/TagEditModal";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useTheme} from "@mui/material/styles";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Encrypt, GenerateKey, RSAencrypt} from "../../common/crypto";
import CryptoJS from "crypto-js";
import {saveNoteId} from "../../store/noteDataSlice";

const NoteNew = () => {
    const navigate = useNavigate()
    const {t} = useTranslation()
    const theme = useTheme()
    const [content, setContent] = useState('')
    const [title, setTitle] = useState('')
    const dispatch = useDispatch()
    const [editing, setEditing] = useState(false)
    const [modalTag, setModalTag] = useState(false)
    const editTags = useSelector((state: any) => state.tagSlice.editTags)
    const [encrypt, setEncrypt] = useState(true);
    const [showTipEncrypt, setShowTipEncrypt] = useState(false)
    const [saving, setSaving] = useState(false);
    const [msg, setMsg]=useState('')
    const [msgType, setMsgType]=useState<AlertColor>('success')
    const [showMsg, setShowMsg]=useState(false)

    const onSaveNote = () => {
        let params = {
            title,
            encrypt,
            content,
            encryptKey: "",
            keyToken: "",
            tagList: editTags
        };
        setSaving(true);
        if (encrypt) {
            /**
             * 加密保存
             */
            const uuid = GenerateKey();
            const keyAES = CryptoJS.SHA256(uuid);
            const keyAESBase64 = CryptoJS.enc.Base64.stringify(keyAES);
            params.content = Encrypt(content, keyAESBase64, keyAESBase64);
            params.encryptKey = keyAESBase64;
            apiRequestRsaPublicKey()
                .then((res: any) => {
                    if (res.code === 0) {
                        params.encryptKey =
                            RSAencrypt(params.encryptKey, res.data.publicKey) || "";
                        params.keyToken = res.data.keyToken;
                        apiSaveMyNote(params)
                            .then((res: any) => {
                                if (res.code === 0) {
                                    setMsg(t("MyNotes.NoteNew.tipNoteSaveSuccess"))
                                    setMsgType('success')
                                    setShowMsg(true)
                                    let noteId = res.data.noteId;
                                    dispatch(saveNoteId(noteId))
                                    navigate("/NoteEdit");
                                } else {
                                    setMsg(t("syserr." + res.code))
                                    setMsgType('error')
                                    setShowMsg(true)
                                    setSaving(false);
                                }
                            })
                            .catch(() => {
                                setMsg(t("syserr.10001"))
                                setMsgType('error')
                                setShowMsg(true)
                                setSaving(false);
                            });
                    } else {
                        setMsg(t("syserr." + res.code))
                        setMsgType('error')
                        setShowMsg(true)
                        setSaving(false);
                    }
                })
                .catch(() => {
                    setMsg(t("syserr.10001"))
                    setMsgType('error')
                    setShowMsg(true)
                    setSaving(false);
                });
        } else {
            params.encrypt = false
            apiSaveMyNote(params)
                .then((res: any) => {
                    if (res.code === 0) {
                        setMsg(t("MyNotes.NoteNew.tipNoteSaveSuccess"))
                        setMsgType('success')
                        setShowMsg(true)
                        navigate(-1);
                    } else {
                        setMsg(t("syserr." + res.code))
                        setMsgType('error')
                        setShowMsg(true)
                        setSaving(false);
                    }
                })
                .catch(() => {
                    setMsg(t("syserr.10001"))
                    setMsgType('error')
                    setShowMsg(true)
                    setSaving(false);
                });
        }
    };

    return (
        <Box>
            <Header1/>
            <Container>
                <Breadcrumbs sx={{marginTop: 8}}>
                    <Button onClick={() => {
                        navigate('/Dashboard1')
                    }}>
                        {t("common.home")}
                    </Button>
                    <Button onClick={() => {
                        navigate(-1)
                    }}>
                        {t("nav.back")}
                    </Button>
                </Breadcrumbs>

                {/*笔记详情*/}
                <Box sx={{padding: 0, display: 'flex', justifyContent: 'center'}}>
                    <Box
                        sx={{width: '100%'}}>
                        {/*title*/}
                        <Box>
                            <TextField
                                variant='standard'
                                label={t("MyNotes.NoteEdit.title")}
                                value={title}
                                placeholder={t("MyNotes.titleHolder")}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    setEditing(true);
                                }}
                                style={{width: '100%'}}
                            />
                        </Box>

                        {/*tags*/}
                        <Box sx={{marginTop: 2}}>
                            <Box style={{padding: 10}}>
                                <Stack direction='row' spacing={1} flexWrap='wrap'
                                       alignItems='center'>
                                    <Button variant='contained' size='small' onClick={() => {
                                        setModalTag(true)
                                    }}>
                                        # {t('MyNotes.editTag')}
                                    </Button>
                                    {editTags.length > 0 ?
                                        editTags.map((item: any, index: any) => (
                                            <NoteEditTagRow item={item} key={index}/>
                                        ))
                                        : null
                                    }
                                </Stack>
                            </Box>
                        </Box>

                        <Box>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <div>{t('MyNotes.NoteNew.encrypt')}：</div>
                                <Switch checked={encrypt} onChange={() => setEncrypt(!encrypt)}/>
                                <div style={{marginLeft: 10}}>
                                    {encrypt ? <span>{t('MyNotes.NoteNew.encrypt')}</span> :
                                        <span>{t('MyNotes.NoteNew.noEncrypt')}</span>}
                                </div>
                                <InfoIcon
                                    style={{color: theme.palette.primary.dark, marginLeft: 10, cursor: 'pointer'}}
                                    onClick={() => {
                                        setShowTipEncrypt(!showTipEncrypt)
                                    }}/>
                            </div>
                            <div style={{
                                color: theme.palette.primary.dark,
                                marginTop: 10,
                                display: 'flex',
                                alignItems: 'flex-start'
                            }}>
                                {showTipEncrypt ?
                                    <div
                                        style={{marginLeft: 10, marginTop: 3}}>  {t('MyNotes.NoteNew.tipEncrypt')}</div>
                                    : null}
                            </div>
                        </Box>

                        <Box sx={{marginTop: 2}}>
                            <div style={{color: theme.palette.primary.main}}>
                                {t("MyNotes.content")}
                            </div>
                            <TextField
                                style={{width: '100%'}}
                                multiline
                                value={content}
                                placeholder={t("MyNotes.titleHolder")}
                                onChange={(e) => {
                                    setContent(e.target.value);
                                    setEditing(true);
                                }}
                            />
                        </Box>

                        <Box
                            sx={{
                                width: "100%",
                                justifyContent: "center",
                                alignItems: "center",
                                display: "flex",
                                marginTop: 1
                            }}
                        >
                            {saving ? (
                                <CircularProgress style={{marginTop:20}}/>
                            ) : (
                                <>
                                    {editing ? (
                                        <Button
                                            style={{width: "100px", marginTop:20}}
                                            variant='contained'
                                            onClick={() => {
                                                onSaveNote();
                                            }}
                                        >
                                            {t("common.btSave")}
                                        </Button>
                                    ) : null}
                                </>
                            )}
                        </Box>
                    </Box>
                </Box>

            </Container>

            {
                modalTag ?
                    <TagEditModal visible={modalTag} hideModal={() => setModalTag(false)}/> : null
            }
            <Snackbar open={showMsg}
                      autoHideDuration={2000}
                      anchorOrigin={{vertical: "top", horizontal: 'center'}}
                      onClose={() => {
                          setShowMsg(false)
                      }}
            >
                <Alert variant={"filled"} severity={msgType}>{msg}</Alert>
            </Snackbar>
        </Box>
    )
}
export default NoteNew
