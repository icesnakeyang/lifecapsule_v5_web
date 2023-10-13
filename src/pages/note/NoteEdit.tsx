import {
    Alert,
    AlertColor,
    Box,
    Breadcrumbs,
    Button, CircularProgress,
    Container,
    Dialog, DialogActions, DialogContent, DialogContentText,
    Snackbar,
    Stack,
    Switch,
    TextField
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {saveEditing} from "../../store/commonSlice";
import {apiDeleteMyNote, apiGetMyNote, apiRequestRsaPublicKey, apiSaveMyNote, apiSaveMyNoteTags} from "../../api/Api";
import {Decrypt, Decrypt2, Encrypt, GenerateKey, GenerateRandomString16, RSAencrypt} from "../../common/crypto";
import {saveNoteId, saveTagList} from "../../store/noteDataSlice";
import {saveEditTags} from "../../store/tagSlice";
import {TagModel} from "../../model/TagModel";
import SendIcon from '@mui/icons-material/Send';
import {saveSendNote} from "../../store/noteSendSlice";
import {SendNoteModel} from "../../model/SendNoteModel";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import NoteEditTagRow from "../tag/NoteEditTagRow";
import moment from "moment";
import InfoIcon from '@mui/icons-material/Info';
import TagEditModal from "../tag/TagEditModal";
import CryptoJS from "crypto-js";
import {useNavigate} from "react-router-dom";
import {useTheme} from "@mui/material/styles";
import Header1 from "../common/Header1";

const NoteEdit = () => {
    const noteId = useSelector((state: any) => state.noteDataSlice.noteId)
    const [title, setTitle] = useState("");
    const [encrypt, setEncrypt] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [content, setContent] = useState("");
    const editingRedux = useSelector((state: any) => state.commonSlice.editing);
    const [createTime, setCreateTime] = useState(null);
    const [modalTag, setModalTag] = useState(false)
    const [tagEdit] = useState('')
    const editTags = useSelector((state: any) => state.tagSlice.editTags)
    const [showTipEncrypt, setShowTipEncrypt] = useState(false)
    const theme = useTheme()
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState<AlertColor>('success')
    const [showMsg, setShowMsg] = useState(false)

    useEffect(() => {
        loadAllData();
        return () => {
        };
    }, [noteId]);

    useEffect(() => {
        dispatch(saveEditing(0));
    }, []);

    useEffect(() => {
        if (editingRedux > 1) {
            setEditing(true);
        } else {
            setEditing(false);
        }
    }, [editingRedux]);

    const loadAllData = () => {
        let params = {
            noteId,
            encryptKey: {},
            keyToken: "",
        };
        apiRequestRsaPublicKey().then((res: any) => {
            if (res.code === 0) {
                const keyAES_1 = GenerateRandomString16();
                params.encryptKey = RSAencrypt(keyAES_1, res.data.publicKey);
                params.keyToken = res.data.keyToken;

                apiGetMyNote(params).then((res: any) => {
                    if (res.code === 0) {
                        let note = res.data.note;
                        setCreateTime(note.createTime);
                        setTitle(note.title);
                        if (note.encrypt === 1) {
                            let strKey = note.userEncodeKey;
                            strKey = Decrypt2(strKey, keyAES_1);
                            let content = Decrypt(note.content, strKey, strKey);
                            setEncrypt(true);
                            setContent(content);
                        } else {
                            setEncrypt(false);
                            setContent(note.content);
                        }
                        dispatch(saveTagList(res.data.noteTagList))
                        dispatch(saveEditTags(res.data.noteTagList))
                    }
                });
            }
        });


    };

    const onSaveNote = () => {
        let params = {
            title,
            noteId,
            encrypt: 1,
            content: "",
            encryptKey: "",
            keyToken: "",
        };
        setSaving(true);
        if (encrypt) {
            /**
             * 1加密，0不加密
             */
            params.encrypt = 1;
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
                                    setMsg(t("MyNotes.NoteEdit.tipNoteSaveSuccess"))
                                    setMsgType("success")
                                    setShowMsg(true)
                                    // this.$router.back()
                                    setSaving(false);
                                    setEditing(false);
                                    dispatch(saveEditing(1));
                                } else {
                                    setMsg(t("syserr." + res.code))
                                    setMsgType("error")
                                    setShowMsg(true)
                                    setSaving(false);
                                }
                            })
                            .catch(() => {
                                setMsg(t("syserr.10001"))
                                setMsgType("error")
                                setShowMsg(true)
                                setSaving(false);
                            });
                    } else {
                        setMsg(t("syserr." + res.code))
                        setMsgType("error")
                        setShowMsg(true)
                        setSaving(false);
                    }
                })
                .catch(() => {
                    setMsg(t("syserr.10001"))
                    setMsgType("error")
                    setShowMsg(true)
                    setSaving(false);
                });
        } else {
            params.encrypt = 0;
            params.content = content;
            setSaving(true);
            apiSaveMyNote(params)
                .then((res: any) => {
                    if (res.code === 0) {
                        setMsg(t("MyNotes.NoteEdit.tipNoteSaveSuccess"))
                        setMsgType("success")
                        setShowMsg(true)
                    } else {
                        setMsg(t("syserr." + res.code))
                        setMsgType("error")
                        setShowMsg(true)
                    }
                    setEditing(false);
                    setSaving(false);
                })
                .catch(() => {
                    setMsg(t("syserr.10001"))
                    setMsgType("error")
                    setShowMsg(true)
                    setSaving(false);
                });
        }
        // apiSaveMyNote
    };

    const onAddTag = () => {
        if (!tagEdit) {
            return
        }
        if (!editTags || editTags.length === 0) {
            let list = [
                {
                    tagName: tagEdit
                }
            ]
            dispatch(saveEditTags(list))
        } else {
            let cc = 0;
            let tags: TagModel[] = []
            editTags.map((item: any) => {
                tags.push(item)
                if (item.tagName === tagEdit) {
                    cc++
                }
            })
            if (cc === 0) {
                const data = {
                    tagName: tagEdit
                }
                tags.push(data)
            }
            dispatch(saveEditTags(tags))
        }
    }

    const onSaveTags = () => {
        /**
         * 保存tag到note
         */
        let params = {
            tagList: editTags,
            noteId
        }
        apiSaveMyNoteTags(params).then((res: any) => {
            if (res.code === 0) {
                // dispatch(loadRefresh())
            } else {
                // message.error(t('syserr.' + res.code))
            }
        }).catch(() => {
            // message.error(t('syserr.10001'))
        })
    }

    return (
        <Box sx={{padding: 0}}>
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
                <Box style={{}}>
                    {/*toolbar*/}
                    <Box style={{display: 'flex', justifyContent: 'flex-end', padding: 10}}>
                        <Stack direction='row' spacing={1}>
                            <Button
                                variant='contained'
                                size='small'
                                onClick={() => {
                                    navigate("/NoteNew");
                                }}
                                style={{background: theme.palette.primary.dark}}
                            >
                                {t("MyNotes.btNewNote")}
                            </Button>
                            <Button
                                variant='contained'
                                size='small'
                                endIcon={<SendIcon/>}
                                onClick={() => {
                                    let data: SendNoteModel = {
                                        content,
                                        title
                                    }
                                    dispatch(saveSendNote(data))
                                    navigate("/SendPage");
                                }}
                                color='secondary'
                            >
                                {t("MyNotes.NoteEdit.btSend")}
                            </Button>
                            <Button
                                variant='contained'
                                size='small'
                                endIcon={<DeleteForeverIcon/>}
                                onClick={() => {
                                    setModalDelete(true);
                                }}
                                color='error'
                            >
                                {t("common.btDelete")}
                            </Button>
                        </Stack>
                    </Box>
                </Box>

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
                            <div style={{color: theme.palette.primary.main}}>
                                {t("MyNotes.NoteEdit.createTime")}：{moment(createTime).format("LLL")}
                            </div>
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

                        <div
                            style={{
                                width: "100%",
                                justifyContent: "center",
                                alignItems: "center",
                                display: "flex",
                                marginTop: 20
                            }}
                        >
                            {saving ? (
                                <CircularProgress/>
                            ) : (
                                <>
                                    {editing ? (
                                        <Button
                                            style={{width: "100px"}}
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
                        </div>
                    </Box>
                </Box>

            </Container>

            <Dialog
                open={modalDelete}
                style={{}}
            >
                <DialogContent style={{background: theme.palette.primary.light}}>
                    <DialogContentText style={{color: theme.palette.primary.contrastText}}>
                        {t("MyNotes.NoteEdit.tipNoteDelete")}
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{background: theme.palette.primary.light}}>
                    <Button variant='contained' color='error' onClick={() => {
                        let params = {
                            noteId,
                        };
                        setDeleting(true);
                        setModalDelete(false);

                        apiDeleteMyNote(params)
                            .then((res: any) => {
                                if (res.code === 0) {
                                    setMsg(t("MyNotes.NoteEdit.tipNoteDeleteSuccess"))
                                    setMsgType('success')
                                    setShowMsg(true)
                                    navigate(-1);
                                } else {
                                    setMsg(t("syserr." + res.code))
                                    setMsgType('error')
                                    setShowMsg(true)
                                    setDeleting(false);
                                }
                            })
                            .catch(() => {
                                setMsg(t("syserr.10001"))
                                setMsgType('error')
                                setShowMsg(true)
                                setDeleting(false);
                            });
                    }}>{t('common.btConfirm')}</Button>
                    <Button variant='contained' color='secondary' onClick={() => {
                        setModalDelete(false)
                    }}>{t('common.btCancel')}</Button>
                </DialogActions>
            </Dialog>

            {
                modalTag ?
                    <TagEditModal visible={modalTag} hideModal={() => setModalTag(false)}/> : null
            }
            <Snackbar open={showMsg}
                      autoHideDuration={2000}
                      anchorOrigin={{vertical: "top", horizontal: 'center'}}
                      onClose={() => {
                          console.log('close')
                          setShowMsg(false)
                      }}
            >
                <Alert variant={"filled"} severity={msgType}>{msg}</Alert>
            </Snackbar>
        </Box>
    )
}
export default NoteEdit;
