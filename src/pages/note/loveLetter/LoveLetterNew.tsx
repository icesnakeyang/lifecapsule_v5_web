import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useTheme} from "@mui/material/styles";
import Header1 from "../../common/Header1";
import {
    Alert, AlertColor,
    Breadcrumbs,
    Button,
    Card,
    CardContent,
    CardHeader,
    CircularProgress, FormControl, FormControlLabel, FormGroup,
    IconButton, InputLabel, MenuItem, Select, Snackbar, Switch,
    TextField
} from "@mui/material";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DemoContainer} from "@mui/x-date-pickers/internals/demo";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import dayjs, {Dayjs} from "dayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {useState} from "react";
import InfoIcon from '@mui/icons-material/Info';
import moment from "moment";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import {Encrypt, GenerateKey, RSAencrypt} from "../../../common/crypto";
import CryptoJS from "crypto-js";
import {apiRequestRsaPublicKey, apiSaveLoveLetter, apiSaveMyNote} from "../../../api/Api";
import {saveNoteId} from "../../../store/noteDataSlice";

const LoveLetterNew = () => {
    const {t} = useTranslation()
    const navigate = useNavigate()
    const theme = useTheme()
    // const [sendTime, setSendTime] = useState<Dayjs | null>(dayjs('2022-04-17T15:30'));
    const [sendTime, setSendTime] = useState<Date | null>(null);
    const [saving, setSaving] = useState(false)
    const [title, setTitle] = useState('')
    const [showTrigger, setShowTrigger] = useState(false);
    const [toEmail, setToEmail] = useState('');
    const [toName, setToName] = useState('');
    const [fromName, setFromName] = useState('');
    const [content, setContent] = useState('');
    const [isSetSendTime, setIsSetSendTime] = useState(false)
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState<AlertColor>()
    const [showMsg, setShowMsg] = useState(false)
    const [triggerType, setTriggerType] = useState('WAIT')

    const onCreateLoveLetter = () => {
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
            sendDateTime: sendTime,
            title,
            content,
            toEmail,
            toName,
            fromName,
            encryptKey: "",
            keyToken: "",
            triggerType
        }
        setSaving(true)
        if (!showTrigger) {
            params.triggerType = ''
        }else{
            if(params.triggerType==='WAIT'){
                params.triggerType=''
            }
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

                    <Card style={{
                        marginTop: 10,
                        background: theme.palette.background.default,
                        border: '1px solid',
                        borderColor: theme.palette.primary.main
                    }}>
                        <CardContent>
                            {/* title */}
                            <TextField label={t('loveLetter.loveLetterTitle')}
                                       variant='standard'
                                       style={{width: '100%'}}
                                       onChange={e => {
                                           setTitle(e.target.value);
                                       }}
                            />
                            <div style={{marginTop: 10}}>{t('loveLetter.tipLoveLetterTitle')}</div>

                            {/* content */}
                            <div
                            >
                                <TextField
                                    multiline={true}
                                    minRows={5}
                                    style={{marginTop: 20, width: '100%'}}
                                    label={t('loveLetter.contentHolder')}
                                    onChange={e => {
                                        setContent(e.target.value);
                                    }}
                                    value={content}
                                />
                            </div>

                            {/* trigger */}
                            <div
                                style={{
                                    marginTop: 20
                                }}>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <InfoIcon style={{color: theme.palette.primary.main}}/>
                                    <div style={{marginLeft: 10}}> {t('loveLetter.tipTrigger')}</div>
                                    <Switch checked={showTrigger} onChange={() => {
                                        setShowTrigger(!showTrigger)
                                    }}/>
                                </div>

                                {showTrigger ? (
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
                                            {
                                                triggerType === 'TIMER_TYPE_DATETIME' ?
                                                    <>
                                                        <div
                                                            style={{marginTop: 10}}>{t('loveLetter.trigger.TIMER_TYPE_DATETIME')}</div>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DemoContainer components={['DateTimePicker']}>
                                                                <DateTimePicker
                                                                    ampm={false}
                                                                    label={t('MyNotes.SendPage.DatetimeSend.sendTime')}
                                                                    onAccept={e => {
                                                                        // const selectedDate=e as Date
                                                                        // const selectedDate = e ? dayjs(e as Date) : null
                                                                        // setSendTime(selectedDate)
                                                                        setSendTime(e as Date)
                                                                    }}
                                                                    value={sendTime}
                                                                />
                                                            </DemoContainer>
                                                        </LocalizationProvider>
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
                                    </div>
                                ) : null}
                            </div>
                        </CardContent>
                    </Card>
                    <div style={{textAlign: 'center', marginTop: 20}}>
                        {saving ?
                            <CircularProgress/>
                            :
                            <Button variant='contained' onClick={() => {
                                onCreateLoveLetter()
                            }}>{t('common.btSubmit')}</Button>
                        }
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
                <Alert variant={"filled"} severity={msgType}>{msg}</Alert>
            </Snackbar>
        </div>
    )
}
export default LoveLetterNew
