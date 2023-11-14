import {useTheme} from "@mui/material/styles";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import Header1 from "../../common/Header1";
import {Alert, AlertColor, Breadcrumbs, Button, Card, CircularProgress, Grid, Snackbar} from "@mui/material";
import {apiListLoveLetter} from "../../../api/Api";
import LoveLetterRow1 from "./LoveLetterRow1";
import SearchBox from "../../common/SearchBox";
import {Pagination} from "@mui/lab";
import {useDispatch} from "react-redux";
import {clearNoteState} from "../../../store/noteDataSlice";

const LoveLetterList = () => {
    const theme = useTheme()
    const navigate = useNavigate()
    const {t} = useTranslation()
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [noteList, setNoteList] = useState([])
    const [totalNote, setTotalNote] = useState(0)
    const [totalPage, setTotalPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState<AlertColor>()
    const [showMsg, setShowMsg] = useState(false)
    const [searchKey, setSearchKey] = useState('')
    const dispatch = useDispatch()

    useEffect(() => {
        loadAllData()
    }, [pageIndex, pageSize])

    const loadAllData = () => {
        let params = {
            pageIndex,
            pageSize,
            searchKey
        }
        apiListLoveLetter(params).then((res: any) => {
            if (res.code === 0) {
                setNoteList(res.data.noteList)
                setTotalNote(res.data.totalNote)
                setTotalPage(Math.ceil(res.data.totalNote / pageSize))
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
    }

    return (
        <div>
            <Header1/>
            <div style={{display: "flex", justifyContent: 'center', padding: 10}}>
                <div style={{width: '100%', maxWidth: 1080}}>
                    <Breadcrumbs style={{marginTop: 60}}>
                        <Button onClick={() => {
                            navigate('/Dashboard1')
                        }}>{t('nav.home')}</Button>
                        <Button onClick={() => {
                            navigate(-1)
                        }}>{t('nav.back')}</Button>
                        <span>{t('loveLetter.title')}</span>
                    </Breadcrumbs>

                    <Card style={{marginTop: 10, padding: 20, background: theme.palette.background.default}}>
                        <Grid container rowSpacing={1} columnSpacing={0}>
                            <Grid item xs={12} sm={3} md={2} lg={2} xl={2}
                                  style={{display: 'flex', alignItems: 'center'}}>
                                <Button variant='contained' onClick={() => {
                                    dispatch(clearNoteState())
                                    navigate('/LoveLetterNew')
                                }}>{t('loveLetter.btNewLoveLetter')}</Button>
                            </Grid>
                            <Grid item xs={12} sm={9} md={6} lg={4} xl={4} style={{}}>
                                <SearchBox searchKey={searchKey}
                                           setSearchKey={setSearchKey}
                                           pageSize={pageSize} pageIndex={pageIndex} setPageIndex={setPageIndex}
                                           onLoadAllData={loadAllData}/>
                            </Grid>
                        </Grid>
                    </Card>

                    {
                        loading ?
                            <div style={{textAlign: "center", marginTop: 200}}>
                                <CircularProgress/>
                            </div>
                            :
                            noteList.length > 0 ?
                                <div>
                                    {
                                        noteList.map((item: any, index: any) => (
                                            <LoveLetterRow1 data={item} key={index}/>
                                        ))
                                    }
                                    <Pagination style={{marginTop: 10}} count={totalPage} page={pageIndex}
                                                onChange={(e, page) => {
                                                    setPageIndex(page)
                                                }}/>
                                </div>
                                :
                                <div style={{textAlign: "center", marginTop: 200}}>
                                    {t('loveLetter.tip4')}
                                    <Button style={{marginLeft: 10}}
                                            variant='contained'
                                            size='small'
                                            onClick={() => {
                                                dispatch(clearNoteState())
                                                navigate('/LoveLetterNew')
                                            }}
                                    >{t('loveLetter.btNewLoveLetter')}</Button>
                                </div>
                    }
                </div>
            </div>
            <Snackbar open={showMsg}
                      autoHideDuration={2000}
                      anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                      onClose={() => {
                          setShowMsg(false)
                      }}>
                <Alert variant={"filled"} severity={msgType}>{msg}</Alert>
            </Snackbar>
        </div>
    )
}
export default LoveLetterList
