import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {apiWebPublishNoteToTopic} from "../../api/Api";
import {
    Alert,
    AlertColor,
    Breadcrumbs,
    Button,
    CardContent,
    Collapse,
    IconButton,
    Snackbar,
    TextField
} from "@mui/material";
import Header1 from "../common/Header1";
import {useTheme} from "@mui/material/styles";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const PublishToTopic = () => {
    const {t} = useTranslation()
    const [title, setTitle] = useState('')
    const sendNoteTitle = useSelector((state: any) => state.noteSendSlice.sendNoteTitle)
    const [authorName, setAuthorName] = useState('')
    const nickname = useSelector((state: any) => state.loginSlice.nickname)
    const [content, setContent] = useState('')
    const sendNoteContent = useSelector((state: any) => state.noteSendSlice.sendNoteContent)
    const [saving, setSaving] = useState(false)
    const noteId = useSelector((state: any) => state.noteDataSlice.noteId)
    const navigate = useNavigate()
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState<AlertColor>('success')
    const [showMsg, setShowMsg] = useState(false)
    const theme = useTheme()
    const [showTip1, setShowTip1] = useState(false)

    useEffect(() => {
        setTitle(sendNoteTitle)
        setAuthorName(nickname)
        setContent(sendNoteContent)
    }, [])

    const onSend = () => {
        if (!title) {
            setMsg(t('MyNotes.SendPage.tipNoTitle'))
            setMsgType('error')
            setShowMsg(true)
            return;
        }
        if (!authorName) {
            setMsg(t('MyNotes.SendPage.PublishToTopic.tipNoAuthorName'))
            setMsgType('error')
            setShowMsg(true)
            return;
        }
        if (!content) {
            setMsg(t('MyNotes.SendPage.PublishToTopic.tipNoContent'))
            setMsgType('error')
            setShowMsg(true)
            return;
        }

        let params = {
            title,
            content,
            authorName,
            noteId
        }
        setSaving(true)
        apiWebPublishNoteToTopic(params).then((res: any) => {
            if (res.code === 0) {
                setMsg(t('MyNotes.SendPage.PublishToTopic.tipPublishTopicSuccess'))
                setMsgType('success')
                setShowMsg(true)
                setTimeout(() => {
                    navigate(-1)
                }, 2000)

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
        })
    }
    return (
        <div>
            <Header1/>
            <Breadcrumbs sx={{marginTop: 8}}>
                <Button onClick={() => {
                    navigate(-1)
                }}>{t('nav.back')}</Button>
            </Breadcrumbs>

            <div style={{display: 'flex', justifyContent: 'center'}}>
                <div style={{maxWidth: 720, width: '100%'}}>
                    {/*说明*/}
                    <div style={{
                        marginTop: 20
                    }}>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <div style={{
                                color: theme.palette.primary.main,
                                marginLeft: 10,
                                fontSize: 20
                            }}> {t('MyNotes.SendPage.PublishToTopic.tipPublishToTopic')}</div>

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
                            <CardContent>
                                <div style={{
                                    marginTop: 10,
                                    color: theme.palette.primary.main
                                }}> {t('MyNotes.SendPage.PublishToTopic.tipPublishToTopic1')}</div>
                                <div style={{
                                    marginTop: 10,
                                    color: theme.palette.primary.main
                                }}> {t('MyNotes.SendPage.PublishToTopic.tipPublishToTopic2')}</div>
                            </CardContent>
                        </Collapse>
                    </div>

                    <div style={{
                        marginTop: 20
                    }}>
                        {/*title*/}
                        <div
                            style={{marginTop: 20}}></div>
                        <TextField
                            variant='standard'
                            label={t('MyNotes.SendPage.PublishToTopic.title')}
                            style={{marginTop: 5, width: '100%'}}
                            value={title}
                            onChange={(e: any) => {
                                setTitle(e.target.value);
                            }}/>
                        <div style={{color: theme.palette.primary.main, marginTop: 5, fontSize: 14}}>
                            {t('MyNotes.SendPage.PublishToTopic.tipTitle')}</div>


                        {/*Author name*/}

                        <div
                            style={{marginTop: 20}}></div>
                        <TextField
                            variant='standard'
                            label={t('MyNotes.SendPage.PublishToTopic.authorName')}
                            style={{marginTop: 5, width: '100%'}}
                            onChange={e => setAuthorName(e.target.value)}
                            value={authorName}
                        />
                        <div
                            style={{
                                color: theme.palette.primary.main,
                                marginTop: 5,
                                fontSize: 14
                            }}>  {t('MyNotes.SendPage.PublishToTopic.tipAuthorName')}</div>


                        <div
                            style={{marginTop: 20}}></div>
                        <TextField
                            multiline
                            label={t('MyNotes.SendPage.PublishToTopic.publishContent')}
                            style={{marginTop: 5, width: '100%'}}
                            value={content} onChange={(e: any) => {
                            setContent(e.target.value)
                        }}/>
                        <div
                            style={{
                                color: theme.palette.primary.main,
                                marginTop: 5,
                                fontSize: 14
                            }}> {t('MyNotes.SendPage.PublishToTopic.tipContent')}</div>

                        <div style={{margin: 20, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            {saving ?
                                <Button
                                >{t('MyNotes.SendPage.PublishToTopic.btPublishing')}
                                </Button> :
                                <Button
                                    variant='contained'
                                    onClick={() => {
                                    onSend();
                                }}> {t('MyNotes.SendPage.PublishToTopic.btPublish')}</Button>
                            }
                        </div>
                    </div>
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
export default PublishToTopic
