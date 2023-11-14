import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {
    apiDeleteMyNote,
    apiGetLoveLetter,
    apiGetMyNote,
    apiRequestRsaPublicKey,
    apiSaveLoveLetter
} from "../../../api/Api";
import {Decrypt, Decrypt2, Encrypt, GenerateKey, GenerateRandomString16, RSAencrypt} from "../../../common/crypto";
import {clearTriggerId, saveTagList, saveTriggerId} from "../../../store/noteDataSlice";
import {saveEditTags} from "../../../store/tagSlice";
import {NoteModel} from "../../../model/NoteModel";
import Header1 from "../../common/Header1";
import {doesSectionFormatHaveLeadingZeros} from "@mui/x-date-pickers/internals/hooks/useField/useField.utils";
import {
    Alert,
    AlertColor,
    Breadcrumbs,
    Button,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Stack,
    Switch,
    TextField
} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useTheme} from "@mui/material/styles";
import moment from "moment";
import InfoIcon from "@mui/icons-material/Info";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DemoContainer} from "@mui/x-date-pickers/internals/demo";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import dayjs, {Dayjs} from "dayjs";
import Footer2 from "../../common/Footer2";
import CryptoJS from "crypto-js";
import SendIcon from "@mui/icons-material/Send";
import {SendNoteModel} from "../../../model/SendNoteModel";
import {
    clearSendData,
    saveSendNote,
    saveSendNoteContent,
    saveSendNoteTitle,
    saveSendToName
} from "../../../store/noteSendSlice";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import TriggerListBox from "../../common/trigger/TriggerListBox";

const LoveLetterEdit = () => {
    const noteId = useSelector((state: any) => state.noteDataSlice.noteId)
    const [encrypt, setEncrypt] = useState(true)
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(true)
    const {t} = useTranslation()
    const navigate = useNavigate()
    const theme = useTheme()
    const [title, setTitle] = useState('')
    const [toEmail, setToEmail] = useState('');
    const [toName, setToName] = useState('');
    const [fromName, setFromName] = useState('');
    const [sendTime, setSendTime] = useState<Dayjs | null>(null)
    const [triggerType, setTriggerType] = useState('')
    const [sendTrigger, setSendTrigger] = useState(false)
    const [createTime, setCreateTime] = useState<Date>()
    const [saving, setSaving] = useState(false)
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState<AlertColor>()
    const [showMsg, setShowMsg] = useState(false)
    const dispatch = useDispatch()
    const [modalDelete, setModalDelete] = useState(false)
    const [triggerList, setTriggerList] = useState([])

    useEffect(() => {
        loadAllData()
    }, [])

    const loadAllData = () => {
        let params = {
            noteId,
            encryptKey: {},
            keyToken: "",
        };
        setLoading(true)
        apiRequestRsaPublicKey().then((res2: any) => {
            if (res2.code === 0) {
                const keyAES_1 = GenerateRandomString16();
                params.encryptKey = RSAencrypt(keyAES_1, res2.data.publicKey);
                params.keyToken = res2.data.keyToken;

                apiGetLoveLetter(params).then((res: any) => {
                    if (res.code === 0) {
                        let note = res.data.note
                        setTitle(note.title)
                        let strKey = note.userEncodeKey;
                        strKey = Decrypt2(strKey, keyAES_1);
                        let content = Decrypt(note.content, strKey, strKey);
                        setEncrypt(true);
                        setContent(content);
                        let data = {
                            title: note.title,
                            content
                        }
                        if (note.triggerType) {
                            setToEmail(note.toEmail)
                            setToName(note.toName)
                            setFromName(note.fromName)
                            if (note.triggerType === 'TIMER_TYPE_DATETIME') {
                                //用户指定发送时间
                                setSendTrigger(true)
                                const triggerTime = dayjs(note.triggerTime)
                                setSendTime(triggerTime)
                                setTriggerType(note.triggerType)
                            }
                            if (note.triggerType === 'TIMER_TYPE_PRIMARY') {
                                //跟随系统倒计时发送
                                setTriggerType(note.triggerType)
                            }
                        } else {
                        }
                        dispatch(saveSendNote(data))
                        setCreateTime(note.createTime)
                        setTriggerList(note.triggerList)
                        setLoading(false)
                    }
                })
            }
        })
    }

    const onAddTrigger = () => {
        dispatch(clearTriggerId())
        navigate('/LoveLetterTriggerEdit')
    }

    const onDetail = (triggerId: string) => {
        dispatch(saveTriggerId(triggerId))
        navigate('/LoveLetterTriggerEdit')
    }

    const onSave = () => {
        if (!title) {
            setMsg(t('loveLetter.tipNoTitle'))
            setMsgType('error')
            setShowMsg(true)
            return
        }
        if (!content) {
            setMsg(t('loveLetter.tipNoContent'))
            setMsgType('error')
            setShowMsg(true)
            return
        }
        let params = {
            title,
            content,
            toEmail,
            toName,
            fromName,
            triggerType,
            sendDateTime: sendTime,
            encryptKey: "",
            keyToken: "",
            noteId
        }

        setSaving(true)
        if (!sendTrigger) {
            params.sendDateTime = null
            params.triggerType = ''
        }

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
                    apiSaveLoveLetter(params)
                        .then((res: any) => {
                            if (res.code === 0) {
                                setMsg(t("loveLetter.tipSaveLoveLetterSuccess"))
                                setMsgType('success')
                                setShowMsg(true)
                                setTimeout(() => {
                                    navigate(-1);
                                }, 1000)
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
                } else {
                    setMsg(t('syserr.' + res1.code))
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
            <div style={{display: 'flex', justifyContent: 'center', padding: 10}}>
                <div style={{width: '100%', maxWidth: 1080}}>
                    <Breadcrumbs style={{marginTop: 60}}>
                        <Button onClick={() => {
                            navigate('/Dashboard1')
                        }}>{t('nav.home')}</Button>
                        <Button onClick={() => {
                            navigate('/LoveLetterList')
                        }}>{t('nav.loveLetter')}</Button>
                        <Button onClick={() => {
                            navigate(-1)
                        }}>{t('nav.back')}</Button>
                    </Breadcrumbs>

                    {loading ?
                        <div style={{textAlign: "center", marginTop: 200}}>
                            <CircularProgress/>
                        </div>
                        :
                        <div>
                            <Card style={{
                                marginTop: 10, background: theme.palette.background.default,
                                border: '1px solid',
                                borderColor: theme.palette.primary.main
                            }}>
                                <CardHeader title={t('loveLetter.editLoveLetter')}/>
                                <CardContent>
                                    <TextField
                                        variant='standard'
                                        label={t('loveLetter.loveLetterTitle')}
                                        value={title}
                                        style={{width: '100%'}}
                                        onChange={e => {
                                            setTitle(e.target.value)
                                        }}
                                    />
                                    <div style={{marginTop: 10, fontSize: 14}}>
                                        {t('loveLetter.createTime')}: {moment(createTime).format('lll')}
                                    </div>
                                    <TextField
                                        multiline
                                        variant='outlined'
                                        label={t('loveLetter.letterContent')}
                                        value={content}
                                        style={{marginTop: 20, width: '100%'}}
                                        onChange={e => {
                                            setContent(e.target.value)
                                        }}
                                    />
                                </CardContent>
                            </Card>

                            {sendTrigger ?
                                <div style={{marginTop: 10}}>
                                    <Card style={{
                                        background: theme.palette.background.default,
                                        border: '1px solid',
                                        borderColor: theme.palette.primary.main
                                    }}>
                                        <CardHeader title={t('recipient.setRecipient')}/>
                                        <CardContent>
                                            <div style={{marginTop: 10}}>
                                                <div>
                                                    {t('loveLetter.tipTrigger1')}
                                                </div>
                                                <div>
                                                    {t('loveLetter.tipTrigger2')}
                                                </div>

                                                {/* email to */}
                                                <TextField
                                                    variant='standard'
                                                    label={t('loveLetter.to')}
                                                    style={{width: '100%', marginTop: 20}}
                                                    onChange={e => {
                                                        setToEmail(e.target.value);
                                                    }}
                                                    value={toEmail}
                                                />

                                                {/* to name */}
                                                <TextField
                                                    variant='standard'
                                                    label={t('loveLetter.toName')}
                                                    style={{marginTop: 20, width: '100%'}}
                                                    onChange={e => {
                                                        setToName(e.target.value)
                                                    }}
                                                    value={toName}
                                                />

                                                <div
                                                    style={{marginTop: 10}}>
                                                    {t('loveLetter.tipToName')}
                                                </div>

                                                {/* from name */}
                                                <TextField
                                                    variant='standard'
                                                    label={t('loveLetter.fromName')}
                                                    style={{width: '100%', marginTop: 20}}
                                                    onChange={e => {
                                                        setFromName(e.target.value);
                                                    }}
                                                    value={fromName}
                                                />
                                                <div style={{marginTop: 10}}>
                                                    {t('loveLetter.tipFromName')}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card style={{
                                        background: theme.palette.background.default,
                                        border: '1px solid',
                                        borderColor: theme.palette.primary.main,
                                        marginTop: 20
                                    }}>
                                        <CardHeader title={t('Trigger.sendCondition')}/>
                                        <CardContent>
                                            <FormControl variant="outlined"
                                                         style={{marginTop: 20, width: '100%'}}>
                                                <InputLabel>{t('Trigger.triggerType')}</InputLabel>
                                                <Select
                                                    value={triggerType}
                                                    onChange={(e) => {
                                                        setTriggerType(e.target.value)
                                                    }}
                                                    label="Triiger Type"
                                                    style={{marginTop: 0}}
                                                >
                                                    <MenuItem
                                                        value='TIMER_TYPE_PRIMARY'>{t('Trigger.TIMER_TYPE_PRIMARY')}</MenuItem>
                                                    <MenuItem
                                                        value='TIMER_TYPE_DATETIME'>{t('Trigger.TIMER_TYPE_DATETIME')}</MenuItem>
                                                </Select>
                                            </FormControl>
                                            {triggerType === 'TIMER_TYPE_DATETIME' ?
                                                <div style={{marginTop: 20}}>
                                                    <div>{t('Trigger.tip6')}</div>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DemoContainer components={['DateTimePicker']}>
                                                            <DateTimePicker
                                                                ampm={false}
                                                                label={t('MyNotes.SendPage.DatetimeSend.sendTime')}
                                                                onAccept={e => {
                                                                    // const selectedDate=e as Date
                                                                    const selectedDate = e ? dayjs(e) : null
                                                                    setSendTime(selectedDate)
                                                                    // setSendTime(e as Date)
                                                                }}
                                                                value={sendTime}
                                                            />
                                                        </DemoContainer>
                                                    </LocalizationProvider>
                                                </div>
                                                :
                                                triggerType === 'TIMER_TYPE_PRIMARY' ?
                                                    <div style={{marginTop: 20}}>
                                                        {t('Trigger.tip5')}
                                                    </div>
                                                    :
                                                    null
                                            }
                                        </CardContent>
                                    </Card>
                                </div>
                                : null}
                            <div style={{marginTop: 20, textAlign: 'center'}}>
                                {saving ?
                                    <CircularProgress/>
                                    :
                                    <Button variant='contained' onClick={() => {
                                        onSave()
                                    }}>{t('common.btSave')}</Button>
                                }
                            </div>
                            {
                                triggerList.length > 0 ?
                                    <TriggerListBox
                                        data={{
                                            title: t('loveLetter.trigger.title'),
                                            list: triggerList,
                                            onAddTrigger,
                                            onDetail
                                        }}/>
                                    :
                                    <Card style={{
                                        marginTop: 40, background: theme.palette.background.default,
                                        border: '1px solid', borderColor: theme.palette.primary.main
                                    }}>
                                        <CardHeader title={t('loveLetter.trigger.title')}
                                                    action={
                                                        <div>
                                                            <Button
                                                                variant='contained'
                                                                onClick={()=>{
                                                                    dispatch(clearSendData())
                                                                    dispatch(saveSendNoteTitle(title))
                                                                    dispatch(saveSendNoteContent(content))
                                                                    dispatch(clearTriggerId())
                                                                    navigate('/LoveLetterTriggerEdit')
                                                                }}
                                                            >{t('loveLetter.btAddTrigger')}</Button>
                                                        </div>
                                                    }
                                        />
                                        <CardContent>
                                            {t('loveLetter.tipTrigger1')}
                                        </CardContent>
                                    </Card>
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
                          setShowMsg(false)
                      }}
            >
                <Alert variant={"filled"} severity={msgType}>{msg}</Alert>
            </Snackbar>

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
                        setSaving(true);
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
                                    setSaving(false);
                                }
                            })
                            .catch(() => {
                                setMsg(t("syserr.10001"))
                                setMsgType('error')
                                setShowMsg(true)
                                setSaving(false);
                            });
                    }}>{t('common.btConfirm')}</Button>
                    <Button variant='contained' color='secondary' onClick={() => {
                        setModalDelete(false)
                    }}>{t('common.btCancel')}</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
export default LoveLetterEdit
