import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {apiPublishNoteToPublicWeb} from "../../api/Api";
import {Alert, AlertColor, Breadcrumbs, Button, Collapse, IconButton, Snackbar, TextField} from "@mui/material";
import Header1 from "../common/Header1";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {useLocaleText} from "@mui/x-date-pickers/internals";
import {useTheme} from "@mui/material/styles";

const PublishToPublicWeb = () => {
    const sendNoteTitle = useSelector((state: any) => state.noteSendSlice.sendNoteTitle)
    const sendNoteContent = useSelector((state: any) => state.noteSendSlice.sendNoteContent)
    const {t} = useTranslation()
    const [saving, setSaving] = useState(false)
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const nickname = useSelector((state: any) => state.loginSlice.nickname)
    const [authorName, setAuthorName] = useState('')
    const noteId = useSelector((state: any) => state.noteDataSlice.noteId)
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState<AlertColor>('success')
    const [showMsg, setShowMsg] = useState(false)
    const [showTip1, setShowTip1] = useState(false)
    const theme = useTheme()

    useEffect(() => {
        setTitle(sendNoteTitle)
        setContent(sendNoteContent)
        setAuthorName(nickname)
    }, [])

    const onPublish = () => {
        let params = {
            title,
            content,
            authorName,
            noteId
        }
        setSaving(true)
        apiPublishNoteToPublicWeb(params).then((res: any) => {
            if (res.code === 0) {
                setMsg(t('MyNotes.SendPage.PublishToPublicWeb.tipPublishToWebSuccess'))
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
        <div style={{width: '100%', height: '100vh'}}>
            <Header1/>
            <Breadcrumbs sx={{marginTop: 8}}>
                <Button onClick={() => {
                    navigate(-1)
                }}>{t('nav.back')}</Button>
            </Breadcrumbs>

            <div style={{display: 'flex', justifyContent: 'center', width: '100%', padding: 10}}>
                <div style={{width: '100%', maxWidth: 720}}>
                    <div style={{}}>
                        {/*说明*/}
                        <div style={{
                            marginTop: 20,
                            display: 'flex',
                            flexDirection: "column",
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <div style={{
                                    color: theme.palette.primary.main,
                                    fontSize: 20
                                }}> {t('MyNotes.SendPage.PublishToPublicWeb.tip1')}</div>
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

                            <div style={{}}>
                                <Collapse in={showTip1}>
                                    <div style={{
                                        marginTop: 10,
                                        color: theme.palette.primary.main,
                                        fontSize: 14
                                    }}> {t('MyNotes.SendPage.PublishToPublicWeb.tip2')}</div>
                                    <div style={{
                                        marginTop: 10,
                                        color: theme.palette.primary.main,
                                        fontSize: 14
                                    }}> {t('MyNotes.SendPage.PublishToPublicWeb.tip3')}</div>
                                </Collapse>
                            </div>
                        </div>

                        <div style={{
                            marginTop: 20,
                        }}>
                            {/*title*/}
                            <div
                                style={{marginTop: 20}}>
                                <TextField
                                    label={t('MyNotes.SendPage.title')}
                                    style={{marginTop: 5, width: '100%'}} value={title} onChange={(e: any) => {
                                    setTitle(e.target.value);
                                }}/>
                                <div style={{color: theme.palette.primary.main, marginTop: 5, fontSize: 14}}>
                                    {t('MyNotes.SendPage.PublishToPublicWeb.tipTitle')}</div>
                            </div>

                            {/*from name*/}
                            <div
                                style={{marginTop: 20}}>
                                <TextField
                                    label={t('MyNotes.SendPage.PublishToPublicWeb.authorName')}
                                    style={{marginTop: 5, width: '100%'}}
                                    onChange={e => setAuthorName(e.target.value)}
                                    value={authorName}
                                />
                                <div
                                    style={{
                                        color: theme.palette.primary.main,
                                        marginTop: 5,
                                        fontSize: 14
                                    }}>  {t('MyNotes.SendPage.PublishToPublicWeb.tipAuthorName')}</div>
                            </div>

                            <div
                                style={{marginTop: 20}}>
                                <TextField
                                    multiline
                                    label={t('MyNotes.SendPage.PublishToPublicWeb.articleContent')}
                                    style={{marginTop: 5, width: '100%'}}
                                    value={content} onChange={(e: any) => {
                                    setContent(e.target.value)
                                }}/>
                            </div>

                            <div style={{
                                marginTop: 20,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {saving ?
                                    <Button
                                        style={{width: 140}}
                                    >{t('MyNotes.SendPage.PublishToPublicWeb.btPublishing')}
                                    </Button> :
                                    <Button variant='contained' style={{width: 140}} onClick={() => {
                                        onPublish();
                                    }}> {t('MyNotes.SendPage.PublishToPublicWeb.btPublish')}</Button>
                                }
                            </div>
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
export default PublishToPublicWeb
