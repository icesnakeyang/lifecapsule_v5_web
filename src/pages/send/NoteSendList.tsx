import Header1 from "../common/Header1";
import {Alert, AlertColor, Breadcrumbs, Button, CircularProgress, Snackbar} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Pagination} from "@mui/lab";
import {useDispatch, useSelector} from "react-redux";
import {saveSendPageIndex, saveSendQuePageIndex, saveSendQuePageSize} from "../../store/noteSendSlice";
import TriggerRow from "./TriggerRow";
import NoteSendLogRow from "./NoteSendLogRow";
import {apiListMyNoteSendOutLog, apiListMyTriggerQue} from "../../api/Api";
import {useTheme} from "@mui/material/styles";

const NoteSendList = () => {
    const {t} = useTranslation()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [tabTriggerType, setTabTriggerType] = useState('QUE')
    const [triggerQueList, setTriggerQueList] = useState([])
    const sendQuePageIndex = useSelector((state: any) => state.noteSendSlice.sendQuePageIndex) || 1
    const [totalTriggerQue, setTotalTriggerQue] = useState(0)
    const dispatch = useDispatch()
    const [sendNoteList, setSendNoteList] = useState([])
    const [totalSendNote, setTotalSendNote] = useState(0)
    const sendQuePageSize = useSelector((state: any) => state.noteSendSlice.sendQuePageSize) || 10
    const sendPageIndex = useSelector((state: any) => state.noteSendSlice.sendPageIndex) || 1
    const sendPageSize = useSelector((state: any) => state.noteSendSlice.sendPageSize) || 10
    const [msg, setMsg] = useState()
    const [msgType, setMsgType] = useState<AlertColor>('success')
    const [showMsg, setShowMsg] = useState(false)
    const [totalSendNoteUnread, setTotalSendNoteUnread] = useState([])
    const theme = useTheme()

    /**
     * 读取等待发送的笔记列表
     */
    useEffect(() => {
        loadSendQueData();
    }, [sendQuePageIndex, sendQuePageSize]);

    /**
     * 读取已经发送的笔记列表
     */
    useEffect(() => {
        loadSendOutData()
    }, [sendPageIndex, sendPageSize])

    /**
     * 已经发送的笔记列表
     */
    const loadSendOutData = () => {
        let params = {
            pageIndex: sendPageIndex,
            pageSize: sendPageSize,
        };
        apiListMyNoteSendOutLog(params).then((res: any) => {
            if (res.code === 0) {
                setSendNoteList(res.data.sendNoteList)
                setTotalSendNote(res.data.totalSendNote)
                setTotalSendNoteUnread(res.data.totalSendNoteUnread)
                setLoading(false);
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

    /**
     * 读取等待发送的笔记列表
     */
    const loadSendQueData = () => {
        let params2 = {
            pageIndex: sendQuePageIndex,
            pageSize: sendQuePageSize,
            status: 'ACTIVE'
        }
        apiListMyTriggerQue(params2).then((res: any) => {
            if (res.code === 0) {
                setTriggerQueList(res.data.triggerList)
                setTotalTriggerQue(res.data.totalTrigger)
                setLoading(false)
            } else {
                setMsg(t('syserr.' + res.code))
                setMsgType('error')
                setShowMsg(true)
                setLoading(false)
            }
        }).catch(() => {
            setMsg(t('syserr.10001'))
            setMsgType('error')
            setShowMsg(true)
            setLoading(false)
        })
    };
    return (
        <div style={{}}>
            <Header1/>
            <div style={{display: 'flex', justifyContent: 'center', padding: 10}}>
                <div style={{width: '100%', maxWidth: 1080}}>
                    <Breadcrumbs style={{marginTop: 60}}>
                        <Button onClick={() => {
                            navigate('/Dashboard1')
                        }}>{t("nav.home")}</Button>
                        <Button onClick={() => {
                            navigate(-1)
                        }}>{t("nav.back")}</Button>
                        <Button onClick={() => {
                            navigate('/MyReceiveNoteList')
                        }}>{t('nav.myReceiveNote')}</Button>
                        <span>{t('nav.mySendNote')}</span>
                    </Breadcrumbs>

                    {loading ? (
                        <div style={{textAlign: 'center', marginTop: 200}}>
                            <CircularProgress/>
                        </div>
                    ) : (
                        <div style={{width: "100%", marginTop: 10}}>
                            <div style={{display: 'flex'}}>
                                <div>
                                    {tabTriggerType === 'QUE' ?
                                        <>
                                            <Button
                                                size='small'
                                                variant='contained'
                                                style={{
                                                    width: 140
                                                }}>{t('MyNoteSend.que')}</Button>
                                            <Button
                                                size='small'
                                                variant='outlined'
                                                style={{width: 140, marginLeft: 10}}
                                                onClick={() => {
                                                    setTabTriggerType('SEND_OUT')
                                                }}>{t('MyNoteSend.sendOut')}</Button>
                                        </> :
                                        tabTriggerType === 'SEND_OUT' ?
                                            <>
                                                <Button
                                                    size='small'
                                                    variant='outlined'
                                                    style={{width: 140}} onClick={() => {
                                                    setTabTriggerType('QUE')
                                                }
                                                }>{t('MyNoteSend.que')}</Button>
                                                <Button
                                                    size='small'
                                                    variant='contained'
                                                    style={{
                                                        width: 140,
                                                        marginLeft: 10
                                                    }} onClick={() => {
                                                    setTabTriggerType('SEND_OUT')
                                                }
                                                }>{t('MyNoteSend.sendOut')}</Button>
                                            </> : null
                                    }
                                </div>
                            </div>
                            {
                                tabTriggerType === 'QUE' ?
                                    <>
                                        {triggerQueList.length > 0 ?
                                            <>
                                                {triggerQueList.map((item, index) => (
                                                    <TriggerRow item={item} key={index}/>
                                                ))}
                                                <Pagination style={{marginTop: 20}}
                                                            page={sendQuePageIndex}
                                                            count={totalTriggerQue}
                                                            onChange={(e, page) => {
                                                                dispatch(saveSendQuePageIndex(page))
                                                                // dispatch(saveSendQuePageSize(size))
                                                            }}
                                                />
                                            </>

                                            : 'no trigger to que'
                                        }
                                    </>
                                    :
                                    <div style={{}}>
                                        {sendNoteList.length > 0 ?
                                            <>
                                                {sendNoteList.map((item: any, index: any) => (
                                                    <NoteSendLogRow item={item} key={index}/>
                                                ))}
                                                <Pagination style={{marginTop: 20}} count={totalSendNote}
                                                    // page={sendPageIndex}
                                                            onChange={(e, page) => {
                                                                dispatch(saveSendPageIndex(page))
                                                                // dispatch(saveSendPageSize(size))
                                                            }}
                                                />
                                            </>
                                            : 'no trigger to send'
                                        }
                                    </div>
                            }

                        </div>
                    )}
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
export default NoteSendList
