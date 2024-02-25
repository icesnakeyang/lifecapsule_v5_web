import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {apiListMyAntiDelayNote} from "../../../api/Api";
import {Alert, AlertColor, Breadcrumbs, Button, Card, CardContent, CircularProgress, Snackbar} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useTheme} from "@mui/material/styles";
import Header1 from "../../common/Header1";
import {useNavigate} from "react-router-dom";
import ProcrastinationRow from "./ProcrastinationRow";
import {saveNotePageIndex} from "../../../store/noteDataSlice";
import {Pagination} from "@mui/lab";
import {saveProcrastinationPageIndex} from "../../../store/procrastinationSlice";

const ProcrastinationList = () => {
    const procrastinationPageIndex = useSelector((state: any) => state.procrastinationSlice.procrastinationPageIndex)
    const procrastinationPageSize = useSelector((state: any) => state.procrastinationSlice.procrastinationPageSize)
    const [loading, setLoading] = useState(true)
    const [showMsg, setShowMsg] = useState(false)
    const [msgType, setMsgType] = useState<AlertColor>()
    const [msg, setMsg] = useState('')
    const {t} = useTranslation()
    const [noteList, setNoteList] = useState([])
    const [totalNote, setTotalNote] = useState(0)
    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [notePages, setNotePages] = useState(1)

    useEffect(() => {
        listProcrastination()
    }, [procrastinationPageIndex, procrastinationPageSize])

    const listProcrastination = () => {
        let params = {
            pageIndex: procrastinationPageIndex,
            pageSize: procrastinationPageSize
        }
        setLoading(true)
        apiListMyAntiDelayNote(params).then((res: any) => {
            if (res.code === 0) {
                setNoteList(res.data.noteList)
                setTotalNote(res.data.totalNote)
                const totalPages = Math.ceil(res.data.totalNote / procrastinationPageSize);

                setNotePages(totalPages)
                setLoading(false)
            } else {
                setMsg(t('syserr.' + res.code))
                setMsgType('error')
                setShowMsg(true)
                if(res.code===10003){
                    navigate('/LoginPage')
                }
            }
        }).catch(() => {
            setMsg('成功')
            setMsgType('error')
            setShowMsg(true)
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
                        }}>
                            {t('nav.home')}
                        </Button>
                        <Button onClick={() => {
                            navigate(-1)
                        }}>
                            {t('nav.back')}
                        </Button>
                    </Breadcrumbs>

                    {loading ?
                        <div style={{textAlign: "center", marginTop: 200}}>
                            <CircularProgress/>
                        </div>
                        :
                        <div style={{marginTop: 20}}>
                            <Card style={{
                                background: theme.palette.background.default,
                                border: '1px solid',
                                borderColor: theme.palette.primary.main
                            }}>
                                <CardContent>
                                    <Button variant='contained' onClick={() => {
                                        navigate('/ProcrastinationNew')
                                    }}>{t('AntiProcrastination.btAddNew')}</Button>
                                </CardContent>
                            </Card>
                            {noteList && noteList.length > 0 ?
                                <div>
                                    {
                                        noteList.map((item, index) => (
                                            <ProcrastinationRow data={item} key={index}/>
                                        ))
                                    }
                                    <Pagination style={{marginTop: 10}} count={notePages}
                                                page={procrastinationPageIndex}
                                                onChange={(e, page) => {
                                                    console.log(page)
                                                    dispatch(dispatch(saveProcrastinationPageIndex(page)))
                                                }}/>

                                </div>
                                :
                                <div>

                                </div>
                            }
                        </div>
                    }
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
export default ProcrastinationList
