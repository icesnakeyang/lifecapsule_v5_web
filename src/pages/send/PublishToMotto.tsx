import {Alert, AlertColor, Breadcrumbs, Button, Collapse, IconButton, Snackbar, TextField} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {apiPublishMotto} from "../../api/Api";
import Header1 from "../common/Header1";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {useTheme} from "@mui/material/styles";

const PublishToMotto = () => {
    const {t} = useTranslation()
    const nickname = useSelector((state: any) => state.loginSlice.nickname)
    const [authorName, setAuthorName] = useState('')
    const [content, setContent] = useState('')
    const sendNoteContent = useSelector((state: any) => state.noteSendSlice.sendNoteContent)
    const [saving, setSaving] = useState(false)
    const noteId = useSelector((state: any) => state.noteDataSlice.noteId)
    const navigate = useNavigate()
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState<AlertColor>('success')
    const [showMsg, setShowMsg] = useState(false)
    const [showTip1, setShowTip1] = useState(false)
    const theme = useTheme()

    useEffect(() => {
        setAuthorName(nickname)
        setContent(sendNoteContent)
    }, [])

    const onPublish = () => {
        let params = {
            authorName,
            content,
            noteId
        }
        setSaving(true)
        apiPublishMotto(params).then((res: any) => {
            if (res.code === 0) {
                setMsg(t('MyNotes.SendPage.PublishToMotto.tipPublishMottoSuccess'))
                setMsgType('success')
                setShowMsg(true)
                setTimeout(() => {
                    navigate(-1)
                }, 2000)

            } else {
                setMsg(t('syserr.' + res.code))
                setMsgType('success')
                setShowMsg(true)
                setSaving(false)
            }
        }).catch(() => {
            setMsg(t('syserr.10001'))
            setMsgType('success')
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
                <div style={{
                    maxWidth: 720,
                    width: '100%'
                }}>
                    {/*说明*/}
                    <div>
                        <div style={{marginTop: 20, display: 'flex', justifyContent: 'center'}}>
                            <div style={{
                                color: theme.palette.primary.main,
                                marginLeft: 10,
                                fontSize: 20
                            }}> {t('MyNotes.SendPage.PublishToMotto.tipPublishToMotto')}</div>
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
                        <div style={{}}>
                            <Collapse in={showTip1}>
                                <div style={{
                                    marginTop: 0,
                                    color: theme.palette.primary.main
                                }}> {t('MyNotes.SendPage.PublishToMotto.tipPublishToMotto1')}</div>
                                <div style={{
                                    marginTop: 0,
                                    color: theme.palette.primary.main
                                }}> {t('MyNotes.SendPage.PublishToMotto.tipPublishToMotto2')}</div>
                            </Collapse>
                        </div>
                    </div>

                    <div style={{
                        marginTop: 20,
                    }}>

                        {/*Author name*/}
                        <div
                            style={{marginTop: 20}}>
                            <TextField
                                label={t('MyNotes.SendPage.PublishToMotto.authorName')}
                                variant='standard'
                                style={{marginTop: 5, width: '100%'}}
                                onChange={e => setAuthorName(e.target.value)}
                                value={authorName}
                            />
                            <div
                                style={{
                                    color: theme.palette.primary.main,
                                    marginTop: 5,
                                    fontSize: 14
                                }}>  {t('MyNotes.SendPage.PublishToMotto.tipAuthorName')}</div>
                        </div>

                        {/*content*/}
                        <div
                            style={{marginTop: 20}}>
                            <TextField
                                multiline
                                label={t('MyNotes.SendPage.PublishToMotto.mottoContent')}
                                style={{marginTop: 5, width: '100%'}}
                                value={content} onChange={(e: any) => {
                                setContent(e.target.value)
                            }}/>
                        </div>

                        <div style={{margin: 20, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            {saving ?
                                <Button
                                >{t('MyNotes.SendPage.PublishToMotto.btPublishing')}
                                </Button> :
                                <Button variant='contained' onClick={() => {
                                    onPublish();
                                }}> {t('MyNotes.SendPage.PublishToMotto.btPublish')}</Button>
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
export default PublishToMotto
