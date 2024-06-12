import {
    Alert,
    AlertColor,
    Breadcrumbs,
    Button,
    Card,
    CardContent,
    CardHeader, Chip, Dialog, DialogActions, DialogContent,
    Snackbar, Stack,
    TextField
} from "@mui/material";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {apiLoadNoteAllData, apiRequestRsaPublicKey} from "../../api/Api";
import {Decrypt, Decrypt2, GenerateRandomString16, RSAencrypt} from "../../common/crypto";
import {saveNoteId, savePTitle} from "../../store/noteDataSlice";
import Header1 from "../common/Header1";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import moment from "moment";
import {useTheme} from "@mui/material/styles";
import NoteChildRow from "./NoteChildRow";
import {saveSendLogId} from "../../store/noteReceiveSlice";

const NoteDetail = () => {
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState<AlertColor>()
    const [showMsg, setShowMsg] = useState(false)
    const noteId = useSelector((state: any) => state.noteDataSlice.noteId)
    const [title, setTitle] = useState('')
    const dispatch = useDispatch()
    const [pid, setPid] = useState('')
    const [tagList, setTagList] = useState([])
    const [content, setContent] = useState('')
    const [createTime, setCreateTime] = useState(null)
    const [pTitle, setPTitle] = useState('')
    const [pContent, setPContent] = useState('')
    const [pNoteType, setPNoteType] = useState(null)
    const [pTime, setPTime] = useState(null)
    const [sendLogId, setSendLogId] = useState('')
    const [childList, setChildList] = useState([])
    const {t} = useTranslation()
    const navigate = useNavigate()
    const theme = useTheme()
    const [modalReply, setModalReply] = useState(false)

    useEffect(() => {
        loadAllData()
    }, [noteId])

    useEffect(() => {
        loadAllData()
    }, [])

    const loadAllData = () => {
        let params = {
            noteId,
            encryptKey: {},
            keyToken: ''
        }
        apiRequestRsaPublicKey().then((res1: any) => {
            if (res1.code === 0) {
                const keyAES_1 = GenerateRandomString16()
                params.encryptKey = RSAencrypt(keyAES_1, res1.data.publicKey)
                params.keyToken = res1.data.keyToken
                apiLoadNoteAllData(params).then((res: any) => {
                    if (res.code === 0) {
                        let note = res.data.noteDetail
                        if (note.content && note.encrypt === 1) {
                            let strKey = note.userEncodeKey
                            strKey = Decrypt2(strKey, keyAES_1)
                            let content = Decrypt(note.content, strKey, strKey)
                            setContent(content)
                            setCreateTime(note.createTime)
                        }
                        setTitle(note.title)
                        dispatch(savePTitle('Re:' + note.title))
                        setPid(note.pid)
                        setTagList(note.tagList)
                        if (res.data.noteParent) {
                            let pnote = res.data.noteParent
                            setPTitle(pnote.title)
                            setPTitle(pnote.userEncodeKey)
                            if (pnote.userEncodeKey) {
                                let strKey = pnote.userEncodeKey
                                strKey = Decrypt2(strKey, keyAES_1)
                                let content = Decrypt(pnote.content, strKey, strKey)
                                setPContent(content)
                            } else {
                            }
                            setPTime(pnote.sendTime)
                            setPNoteType(pnote.noteType)
                            if (pnote.sendLogId) {
                                setSendLogId(pnote.sendLogId)
                            }
                        }
                        if (res.data.child) {
                            setChildList(res.data.child)
                        }
                    } else {
                    }
                })
            }
        })
    }

    return (
        <div>
            <Header1/>
            <div style={{display: 'flex', justifyContent: "center", padding: 10}}>
                <div style={{maxWidth: 1080, width: '100%'}}>
                    <Breadcrumbs
                        style={{marginTop: 60}}>
                        <Button onClick={() => {
                            navigate('/Dashboard1')
                        }}>{t('nav.home')}</Button>
                        <Button onClick={() => {
                            navigate(-1)
                        }}>{t('nav.back')}</Button>
                    </Breadcrumbs>
                    <Card style={{
                        background: theme.palette.background.default, marginTop: 20,
                        border: '1px solid',
                        borderColor: theme.palette.primary.main
                    }}
                          raised
                    >
                        <CardHeader title={t('MyNotes.content')} action={<div>
                            <Button size='small' onClick={() => {
                                navigate('/NoteEdit')
                            }}>{t('common.btEdit')}</Button>
                        </div>}/>
                        <CardContent>
                            <div style={{fontWeight: '600', fontSize: 20}}>
                                {title}
                            </div>
                            <div style={{marginTop: 10}}>
                                {moment(createTime).format('LLL')}
                            </div>
                            {tagList && tagList.length && tagList.length > 0 ?
                                <Stack direction='row' spacing={1}>
                                    {tagList.map((item: any, index) => (
                                        <Chip size='small' label={item.tagName} key={index}/>
                                    ))
                                    }
                                </Stack>
                                :
                                null
                            }
                            <TextField
                                style={{width: '100%', marginTop: 10}}
                                multiline
                                value={content}
                                aria-readonly
                            />
                        </CardContent>
                    </Card>
                    {
                        pid ?
                            <Card style={{
                                background: theme.palette.background.default,
                                border: '1px solid',
                                borderColor: theme.palette.primary.main,
                                marginTop: 20
                            }}
                                  raised>
                                <CardHeader title={t('MyNotes.pNote')}/>
                                <CardContent>
                                    <Button onClick={() => {
                                        if (pNoteType && pNoteType === 'NOTE_SEND_LOG') {
                                            dispatch(saveSendLogId(sendLogId))
                                            navigate('/MyReceiveNoteDetail')
                                        } else {
                                            dispatch(saveNoteId(pid))
                                        }
                                    }}>{pTitle}</Button>
                                </CardContent>
                            </Card>
                            :
                            null
                    }

                    {
                        childList && childList.length && childList.length > 0 ?
                            <Card style={{
                                marginTop: 20, background: theme.palette.background.default,
                                border: '1px solid',
                                borderColor: theme.palette.primary.main
                            }} raised>
                                <CardHeader title={t('MyNotes.childNoteList')} action={<div>
                                    <Button size='small' onClick={() => {
                                        navigate('/NoteReply')
                                    }}>{t('history.btReply')}</Button>
                                </div>}/>
                                <CardContent>
                                    {childList.length > 0 ?
                                        <div>
                                            {childList.map((item, index) => (
                                                <NoteChildRow data={item} key={index}/>
                                            ))
                                            }
                                        </div>
                                        :
                                        '没有子任务'
                                    }
                                </CardContent>
                            </Card>
                            :
                            null
                    }
                </div>
            </div>


            <Dialog open={modalReply} style={{}}>
                <DialogContent style={{
                    width: '100%',
                    background: theme.palette.background.default,
                    maxWidth: 1080,
                    minWidth: 300,
                    padding: 10
                }}>
                    <TextField
                        label={t('history.replyContent')}
                        style={{width: '100%'}}
                        multiline
                    />
                    Let Google help apps determine location. This means sending anonymous
                    location data to Google, even when no apps are running.
                </DialogContent>
                <DialogActions style={{background: theme.palette.background.default}}>
                    <Button variant='contained'>{t('MyNotes.btSaveReply')}</Button>
                    <Button onClick={() => {
                        setModalReply(false)
                    }}>{t('common.btCancel')}</Button>
                </DialogActions>
            </Dialog>
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
export default NoteDetail
