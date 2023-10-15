import {useLocation, useNavigate} from "react-router-dom";
import {apiGetMyNote, apiGetMyPNote, apiListSubNoteList, apiReplyMyNote, apiRequestRsaPublicKey} from "../../api/Api";
import {Decrypt, Decrypt2, Encrypt, GenerateKey, GenerateRandomString16, RSAencrypt} from "../../common/crypto";
import {saveNoteId, saveTagList} from "../../store/noteDataSlice";
import {saveEditTags} from "../../store/tagSlice";
import {useEffect, useState} from "react";
import {
    Alert,
    AlertColor,
    Breadcrumbs,
    Button,
    Card,
    CardContent, CardHeader, Chip,
    CircularProgress, Divider, Paper,
    Snackbar, Stack,
    TextField
} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useTheme} from "@mui/material/styles";
import Header1 from "../common/Header1";
import moment from "moment";
import CryptoJS from "crypto-js";
import SubNoteRow from "./SubNoteRow";
import {useDispatch, useSelector} from "react-redux";
import Footer1 from "../common/Footer1";
import Footer2 from "../common/Footer2";

const HistoryNoteDetail = () => {
    const noteId = useSelector((state: any) => state.noteDataSlice.noteId)
    const [loading, setLoading] = useState(true)
    const [createTime, setCreateTime] = useState(null)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState<AlertColor>()
    const [showMsg, setShowMsg] = useState(false)
    const {t} = useTranslation()
    const theme = useTheme()
    const navigate = useNavigate()
    const [commentTitle, setCommentTitle] = useState('')
    const [saving, setSaving] = useState(false)
    const [comment, setComment] = useState('')
    const [subNoteList, setSubNoteList] = useState([])
    const [pNoteTitle, setPNoteTitle] = useState('')
    const [pNoteCreateTime, setPNoteCreateTime] = useState()
    const [pNoteId, setPNoteId] = useState('')
    const dispatch = useDispatch()


    useEffect(() => {
        loadAllData()
    }, [noteId])

    const loadAllData = () => {
        let params = {
            noteId,
            encryptKey: {},
            keyToken: "",
        }
        apiRequestRsaPublicKey().then((res1: any) => {
            if (res1.code === 0) {
                const keyAES_1 = GenerateRandomString16();
                params.encryptKey = RSAencrypt(keyAES_1, res1.data.publicKey);
                params.keyToken = res1.data.keyToken;

                apiGetMyNote(params).then((res: any) => {
                    if (res.code === 0) {
                        let note = res.data.note;
                        setCreateTime(note.createTime);
                        setTitle(note.title);
                        setCommentTitle('Re: ' + note.title)
                        console.log(1)
                        if (note.content) {
                            console.log(2)
                            if (note.encrypt === 1) {
                                console.log(3)
                                let strKey = note.userEncodeKey;
                                strKey = Decrypt2(strKey, keyAES_1);
                                let content = Decrypt(note.content, strKey, strKey);
                                setContent(content);
                            } else {
                                setContent(note.content);
                            }
                        }
                        apiListSubNoteList(params).then((res2: any) => {
                            if (res2.code === 0) {
                                setSubNoteList(res2.data.subNoteList)
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

                        apiGetMyPNote(params).then((res3: any) => {
                            if (res3.code === 0) {
                                if (res3.data.pNote) {
                                    setPNoteTitle(res3.data.pNote.title)
                                    setPNoteCreateTime(res3.data.pNote.createTime)
                                    setPNoteId(res3.data.pNote.noteId)
                                } else {
                                    setPNoteTitle('')
                                    setPNoteId('')
                                }
                            }
                        })
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
                setMsg(t('syserr.' + res1.code))
                setMsgType('error')
                setShowMsg(true)
            }
        }).catch(() => {
            setMsg(t('syserr.10001'))
            setMsgType('error')
            setShowMsg(true)
        })
    }

    const onSaveComment = () => {
        if (!commentTitle) {
            setMsg(t('history.noTitle'))
            setMsgType('error')
            setShowMsg(true)
            return;
        }
        if (!comment) {
            setMsg(t('history.noContent'))
            setMsgType('error')
            setShowMsg(true)
            return;
        }
        let params = {
            pid: noteId,
            content: comment,
            title: commentTitle,
            keyToken: '',
            encryptKey: {},
        };

        setSaving(true);

        const uuid = GenerateKey();
        const keyAES = CryptoJS.SHA256(uuid);
        const keyAESBase64 = CryptoJS.enc.Base64.stringify(keyAES);
        params.content = Encrypt(comment, keyAESBase64, keyAESBase64);
        params.encryptKey = keyAESBase64;

        apiRequestRsaPublicKey()
            .then((res2: any) => {
                if (res2.code === 0) {
                    params.encryptKey = RSAencrypt(params.encryptKey, res2.data.publicKey);
                    params.keyToken = res2.data.keyToken;
                    apiReplyMyNote(params).then((res: any) => {
                        if (res.code === 0) {
                            setMsg(t('history.tipReplySuccess'))
                            setMsgType('success')
                            setShowMsg(true)
                            setTimeout(() => {
                                navigate(-1)
                            }, 2000)
                        } else {
                            setMsg(t('syserr.' + res.code))
                            setMsgType('error')
                            setShowMsg(true)
                            setSaving(false);
                        }
                    })
                        .catch(() => {
                            setMsg(t('syserr.10001'))
                            setMsgType('error')
                            setShowMsg(true)
                            setSaving(false);
                        });
                } else {
                    setMsg(t('syserr.' + res2.code))
                    setMsgType('error')
                    setShowMsg(true)
                    setSaving(false);
                }
            })
            .catch(() => {
                setMsg(t('syserr.10001'))
                setMsgType('error')
                setShowMsg(true)
                setSaving(false);
            });
    };

    return (
        <div>
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
                        <span>{t('history.title')}</span>
                    </Breadcrumbs>

                    {loading ?
                        <div style={{textAlign: "center", marginTop: 200}}>
                            <CircularProgress/>
                        </div>
                        :
                        // note detail
                        <div style={{marginTop: 10, background: theme.palette.background.default}}>
                            <Card style={{
                                background: theme.palette.background.default,
                                border: '1px solid',
                                borderColor: theme.palette.primary.main
                            }}>
                                <CardHeader titleTypographyProps={{}} title={t('history.noteInfo')}/>
                                <CardContent style={{}}>
                                    <TextField
                                        label={t('MyNotes.title')}
                                        variant='standard'
                                        style={{marginTop: 20, width: '100%'}}
                                        value={title}
                                    />
                                    <div style={{marginTop: 10, fontSize: 14}}>
                                        {t('note.createTime')}: {moment(createTime).format('LLL')}
                                    </div>
                                    <TextField
                                        label={t('MyNotes.content')}
                                        multiline
                                        style={{marginTop: 40, width: '100%'}}
                                        value={content}
                                    />
                                </CardContent>
                            </Card>


                            {/*father note*/}
                            {pNoteId ?
                                <Card style={{
                                    marginTop: 20, background: theme.palette.background.default,
                                    border: '1px solid',
                                    borderColor: theme.palette.primary.main
                                }}>
                                    <CardHeader
                                        titleTypographyProps={{}}
                                        title={t('history.pNote')}>
                                    </CardHeader>
                                    <CardContent>
                                        <Stack direction='row' spacing={1} alignItems='center'>
                                            <Button onClick={() => {
                                                dispatch(saveNoteId(pNoteId))
                                            }}>{pNoteTitle}</Button>
                                            <Chip size='small' label={moment(pNoteCreateTime).format('ll')}/>
                                        </Stack>
                                    </CardContent>
                                </Card>
                                : null
                            }
                            <div>

                            </div>

                            {/*reply note*/}
                            <Card style={{
                                marginTop: 20, background: theme.palette.background.default,
                                border: '1px solid',
                                borderColor: theme.palette.primary.main
                            }}>
                                <CardHeader title={t('history.reply')}/>
                                <CardContent>
                                    <TextField
                                        variant='standard'
                                        label={t('history.replyTitle')}
                                        style={{marginTop: 20, width: '100%'}}
                                        value={commentTitle}
                                        onChange={e => {
                                            setCommentTitle(e.target.value)
                                        }}
                                    />
                                    <TextField
                                        multiline
                                        label={t('history.replyContent')}
                                        style={{marginTop: 20, width: '100%'}}
                                        onChange={e => {
                                            setComment(e.target.value)
                                        }}
                                    />
                                    <div style={{textAlign: 'center', marginTop: 20}}>
                                        {
                                            saving ?
                                                <CircularProgress/>
                                                :
                                                <Button variant='contained' onClick={() => {
                                                    onSaveComment()
                                                }}>{t('history.btReply')}</Button>
                                        }
                                    </div>
                                </CardContent>
                            </Card>

                            {/*history reply list*/}
                            {subNoteList.length > 0 ?
                                <Card style={{
                                    marginTop: 20, background: theme.palette.background.default,
                                    border: '1px solid',
                                    borderColor: theme.palette.primary.main
                                }}>
                                    <CardHeader title={t('history.historyReply')}/>
                                    <CardContent>
                                        {
                                            subNoteList.map((item, index) => (
                                                <SubNoteRow data={item} key={index}/>
                                            ))
                                        }
                                    </CardContent>
                                </Card>
                                :
                                null
                            }
                        </div>
                    }
                </div>
            </div>
            <Footer2/>
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
        </div>
    )
}
export default HistoryNoteDetail

