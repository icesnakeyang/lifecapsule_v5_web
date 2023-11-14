import {useDispatch, useSelector} from "react-redux";
import {noteDataSlice} from "../../../store/noteDataSlice";
import Header1 from "../../common/Header1";
import {
    AlertColor, Box,
    Breadcrumbs,
    Button,
    Card,
    CardContent,
    CardHeader, Chip, CircularProgress, Dialog, DialogContent,
    DialogTitle, Divider, FormControl, FormHelperText,
    Grid,
    IconButton, InputLabel, MenuItem, Select, Stack,
    TextField
} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {apiGetLoveLetterTrigger, apiListMyContact, apiRequestRsaPublicKey} from "../../../api/Api";
import {useEffect, useRef, useState} from "react";
import MsgBox from "../../common/msgbox/MsgBox";
import {Decrypt, Decrypt2, GenerateRandomString16, RSAencrypt} from "../../../common/crypto";
import {TriggerModel} from "../../../model/TriggerModel";
import {useTheme} from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import SendContactRow from "../../send/SendContactRow";
import {
    saveSendNote,
    saveSendNoteContent,
    saveSendNoteTitle,
    saveSendToEmail,
    saveSendToName
} from "../../../store/noteSendSlice";
import GroupIcon from "@mui/icons-material/Group";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DemoContainer} from "@mui/x-date-pickers/internals/demo";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import dayjs, {Dayjs} from "dayjs";
import {Simulate} from "react-dom/test-utils";
import select = Simulate.select;
import {SendNoteModel} from "../../../model/SendNoteModel";

const LoveLetterTriggerEdit = () => {
    const triggerId = useSelector((state: any) => state.noteDataSlice.triggerId)
    const {t} = useTranslation()
    const navigate = useNavigate()
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState<AlertColor>('success')
    const [showMsg, setShowMsg] = useState(false)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [createTime, setCreateTime] = useState()
    const [fromName, setFromName] = useState('')
    const sendToEmail = useSelector((state: any) => state.noteSendSlice.sendToEmail)
    const sendToName = useSelector((state: any) => state.noteSendSlice.sendToName)
    const [toEmailStatus, setToEmailStatus] = useState('')
    const [trigger, setTrigger] = useState<TriggerModel>()
    const [triggerType, setTriggerType] = useState('WAIT')
    const theme = useTheme()
    const [modalContact, setModalContact] = useState(false)
    const [contactList, setContactList] = useState([])
    const dispatch = useDispatch()
    const [sendTime, setSendTime] = useState<Dayjs | null>();
    const [saving, setSaving] = useState(false)
    const sendNoteTitle = useSelector((state: any) => state.noteSendSlice.sendNoteTitle)
    const sendNoteContent = useSelector((state: any) => state.noteSendSlice.sendNoteContent)
    /**
     * 读取noteinfo
     * 如果有trigger就读取trigger
     * 发送人
     * 内容预览
     * 设置发送条件
     * 定时发送，倒计时发送，api触发，api触发模板列表，选择api触发模板，设置参数，保存
     * 触发条件列表。
     * 一个trigger只有一个触发条件和一个接收人，如果要发送多个人，或者多个条件发送，则在noteInfo下创建多个trigger
     */

    useEffect(() => {
        loadAllData()
    }, [])

    const loadAllData = () => {
        if (triggerId) {
            let params = {
                triggerId,
                encryptKey: {},
                keyToken: ''
            }
            apiRequestRsaPublicKey().then((res1: any) => {
                if (res1.code === 0) {
                    const keyAES_1 = GenerateRandomString16()
                    params.encryptKey = RSAencrypt(keyAES_1, res1.data.publicKey)
                    params.keyToken = res1.data.keyToken
                    apiGetLoveLetterTrigger(params).then((res: any) => {
                        if (res.code === 0) {
                            const trigger = res.data.trigger
                            setTitle(trigger.title)
                            setCreateTime(trigger.createTime)
                            let data: SendNoteModel = {
                                title: trigger.title,
                                content: ''
                            }
                            if (trigger.userEncodeKey && trigger.noteContent) {
                                let strKey = trigger.userEncodeKey
                                strKey = Decrypt2(strKey, keyAES_1)
                                let theContent = Decrypt(trigger.noteContent, strKey, strKey)
                                setContent(theContent)
                                data.content = theContent
                                dispatch(saveSendNote(data))
                            }
                            setFromName(trigger.fromName)
                            dispatch(saveSendToEmail(trigger.toEmail))
                            dispatch(saveSendToName(trigger.toName))
                            setTrigger(trigger)
                            if(trigger.triggerType) {
                                setTriggerType(trigger.triggerType)
                                if (trigger.triggerType === 'TIMER_TYPE_DATETIME') {
                                    //用户指定发送时间
                                    const triggerTime = dayjs(trigger.triggerTime)
                                    setSendTime(triggerTime)
                                }
                                if (trigger.triggerType === 'TIMER_TYPE_PRIMARY') {
                                    //跟随系统倒计时发送
                                }
                            }else{
                                setTriggerType('WAIT')
                            }
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

        let params = {
            pageIndex: 1,
            pageSize: 200
        }
        apiListMyContact(params).then((res: any) => {
            if (res.code === 0) {
                setContactList(res.data.contactList)
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

    }

    const onSave = () => {
        let params = {
            title,
            toName: sendToName,
            toEmail: sendToEmail,
            fromName,
            triggerType,
            sendTime,
            triggerId
        }
        setSaving(true)
        console.log(params)
        setTimeout(() => {
            setSaving(false)
        }, 2000)
    }

    return (
        <div>
            <Header1/>
            <div style={{display: 'flex', justifyContent: "center", padding: 10}}>
                <div style={{width: '100%', maxWidth: 1080}}>
                    <Breadcrumbs style={{marginTop: 60}}>
                        <Button onClick={() => {
                            navigate('/Dashboard1')
                        }}>{t('nav.home')}</Button>
                        <Button onClick={() => {
                            navigate(-1)
                        }}>{t('nav.back')}</Button>
                    </Breadcrumbs>

                    <div style={{marginTop: 20}}>
                        <Card style={{
                            background: theme.palette.background.default,
                            border: '1px solid',
                            borderColor: theme.palette.primary.main
                        }}>
                            <CardHeader title={t('loveLetter.trigger.title')}/>
                            <CardContent>
                                <Grid container columnSpacing={2} rowSpacing={6}>
                                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                        {/*title*/}
                                        <TextField
                                            label={t('loveLetter.loveLetterTitle')}
                                            style={{width: '100%'}}
                                            variant='standard'
                                            value={sendNoteTitle}
                                            onChange={e =>{
                                                console.log(e.target.value)
                                                dispatch(saveSendNoteTitle(e.target.value))
                                            }}
                                        />

                                        {/*sendToName*/}
                                        <div style={{marginTop: 20}}>
                                            <Stack direction='row'>
                                                <TextField
                                                    variant='standard'
                                                    label={t('MyNotes.SendPage.toName')}
                                                    style={{width: '100%'}}
                                                    onChange={(e: any) => dispatch(saveSendToName(e.target.value))}
                                                    value={sendToName}
                                                />
                                                <Button style={{marginTop: 5}} onClick={() => {
                                                    setModalContact(true)
                                                }}><GroupIcon/>
                                                </Button>
                                            </Stack>
                                        </div>

                                        {/*sendToEmail*/}
                                        <TextField
                                            label={t('loveLetter.trigger.toEmail')}
                                            variant='standard'
                                            style={{width: '100%', marginTop: 20}}
                                            onChange={e => {
                                                dispatch(saveSendToEmail(e.target.value))
                                            }}
                                            value={sendToEmail}
                                        />

                                        {/*fromName*/}
                                        <TextField
                                            label={t('loveLetter.trigger.fromName')}
                                            variant='standard'
                                            style={{width: '100%', marginTop: 20}}
                                            onChange={e => {
                                                setFromName(e.target.value)
                                            }}
                                            value={fromName}
                                        />
                                        <div style={{marginTop: 20}}>
                                            <Stack direction='row' spacing={1}>
                                                <span>{t('loveLetter.trigger.sendStatus')}</span>
                                                {trigger ?
                                                    <>
                                                        <span>
                                                        {trigger.toEmailStatus ?
                                                            <Chip size='small'
                                                                  label={t('loveLetter.trigger.emailComplete')}/>
                                                            :
                                                            <Chip size='small'
                                                                  label={t('loveLetter.trigger.emailNotSent')}/>
                                                        }
                                                        </span>
                                                        <span>
                                                            {trigger.toUserStatus ?
                                                                <Chip size='small'
                                                                      label={t('loveLetter.trigger.messageComplete')}/>
                                                                :
                                                                <Chip size='small'
                                                                      label={t('loveLetter.trigger.messageNotSent')}/>
                                                            }
                                                        </span>
                                                    </>
                                                    :
                                                    null
                                                }
                                            </Stack>
                                        </div>

                                        <div style={{marginTop: 20}}>
                                            <FormControl
                                                variant='outlined'
                                                style={{marginTop: 20, width: '100%'}}>
                                                <InputLabel>{t('Trigger.triggerType')}</InputLabel>
                                                <Select
                                                    value={triggerType}
                                                    onChange={(e) => {
                                                        setTriggerType(e.target.value)
                                                    }}
                                                    label='Triiger Type'
                                                    style={{marginTop: 0}}
                                                >
                                                    <MenuItem
                                                        value='WAIT'>{t('loveLetter.trigger.unSet')}</MenuItem>
                                                    <MenuItem
                                                        value='TIMER_TYPE_PRIMARY'>{t('Trigger.TIMER_TYPE_PRIMARY')}</MenuItem>
                                                    <MenuItem
                                                        value='TIMER_TYPE_DATETIME'>{t('Trigger.TIMER_TYPE_DATETIME')}</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <div>trigger type: {triggerType}</div>
                                            {
                                                triggerType === 'TIMER_TYPE_DATETIME' ?
                                                    <>
                                                        <div
                                                            style={{marginTop: 10}}>{t('loveLetter.trigger.TIMER_TYPE_DATETIME')}</div>
                                                        <div style={{marginTop: 10}}>
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
                                                        <div style={{
                                                            color: theme.palette.primary.main,
                                                            marginTop: 5,
                                                            fontSize: 14
                                                        }}>{t('MyNotes.SendPage.DatetimeSend.tipSendTime')}</div>
                                                    </>
                                                    :
                                                    triggerType === 'TIMER_TYPE_PRIMARY' ?
                                                        <>
                                                            <div
                                                                style={{marginTop: 10}}>{t('loveLetter.trigger.TIMER_TYPE_PRIMARY')}</div>
                                                        </>
                                                        :
                                                        triggerType === 'WAIT' ?
                                                            <div
                                                                style={{marginTop: 10}}>{t('loveLetter.trigger.tipUnset')}</div>
                                                            :
                                                            null
                                            }
                                        </div>
                                        <div style={{textAlign: 'center', marginTop: 20}}>
                                            {
                                                saving ?
                                                    <CircularProgress/>
                                                    :
                                                    <Button variant='contained' onClick={() => {
                                                        onSave()
                                                    }}>save</Button>
                                            }
                                        </div>

                                    </Grid>

                                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                        <Card style={{
                                            background: theme.palette.background.default,
                                            height: '100%',
                                            border: '1px solid',
                                            borderColor: theme.palette.primary.main
                                        }}>
                                            <CardContent>
                                                <div
                                                    style={{width: '100%', textAlign: 'center'}}>
                                                    {t('MyNotes.SendPage.preview')}
                                                </div>
                                                <div style={{
                                                    fontSize: 20,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    display: 'flex',
                                                    fontWeight: 'bold',
                                                    marginTop: 2
                                                }}>{sendNoteTitle}</div>
                                                <Box
                                                    sx={{marginTop: 2}}>{t('MyNotes.SendPage.fromName')}: {fromName}</Box>
                                                <Box
                                                    sx={{marginTop: 1}}>{t('MyNotes.SendPage.toName')}: {sendToName}</Box>
                                                <Divider style={{padding: 10}}/>
                                                <div style={{whiteSpace: 'pre-line'}}>{sendNoteContent}</div>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <MsgBox msg={msg} msgType={msgType} showMsg={showMsg} closeMsgBox={() => setShowMsg(false)}
                    onLoadAllData={() => {
                    }}/>

            <Dialog open={modalContact}
                    fullWidth
                    style={{}}
            >
                <DialogTitle
                    style={{background: theme.palette.background.default}}>
                    {t('MyNotes.SendPage.recentContact')}
                    <IconButton
                        aria-label="close"
                        onClick={() => {
                            setModalContact(false)
                        }}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent style={{background: theme.palette.background.default}}>
                    {contactList.length > 0 ?
                        contactList.map((item: any, index) => (
                            <SendContactRow item={item} key={index} onSelect={() => setModalContact(false)}/>
                        )) : null
                    }
                </DialogContent>
            </Dialog>
        </div>
    )
}
export default LoveLetterTriggerEdit
