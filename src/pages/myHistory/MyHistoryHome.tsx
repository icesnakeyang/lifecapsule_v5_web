import Header1 from "../common/Header1";
import {
    Alert,
    AlertColor,
    Breadcrumbs,
    Button,
    Card,
    CardContent, CircularProgress, Grid,
    IconButton,
    Snackbar,
    TextField
} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useTheme} from "@mui/material/styles";
import SearchIcon from '@mui/icons-material/Search';
import {apiLoadHistoryHome} from "../../api/Api";
import {useEffect, useState} from "react";
import {Simulate} from "react-dom/test-utils";
import MyHistoryRow from "./MyHistoryRow";

const MyHistoryHome = () => {
    const {t} = useTranslation()
    const navigate = useNavigate()
    const theme = useTheme()
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [searchKey, setSearchKey] = useState('')
    const [loading, setLoading] = useState(true)
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState<AlertColor>()
    const [showMsg, setShowMsg] = useState(false)
    const [noteList, setNoteList] = useState([])

    useEffect(() => {
        loadAllData()
    }, [pageIndex, pageSize])

    const loadAllData = () => {
        let params = {
            pageIndex,
            pageSize,
            searchKey
        };
        apiLoadHistoryHome(params)
            .then((res: any) => {
                if (res.code === 0) {
                    // dispatch(saveHistoryNoteList(res.data.noteList));
                    // setLoading(false);
                    setNoteList(res.data.noteList)
                    setLoading(false)
                } else {
                    setMsg(t('syserr.' + res.code))
                    setMsgType('error')
                    setShowMsg(true)
                    if (res.code === 10003) {
                        setTimeout(() => {
                            navigate('/LoginPage')
                        }, 2000)
                    }
                }
            })
            .catch(() => {
                setMsg(t('syserr.10001'))
                setMsgType('error')
                setShowMsg(true)
            });
    };

    return (
        <div>
            <Header1/>
            <div style={{display: 'flex', justifyContent: 'center', padding: 10}}>
                <div style={{maxWidth: 1080, width: '100%'}}>
                    <Breadcrumbs style={{marginTop: 60}}>
                        <Button onClick={() => {
                            navigate('/Dashboard1')
                        }}>{t('nav.home')}</Button>
                        <Button onClick={() => {
                            navigate(-1)
                        }}>{t('nav.back')}</Button>
                        <span>{t('history.title')}</span>
                    </Breadcrumbs>

                    <Card style={{
                        marginTop: 10, background: theme.palette.background.default
                    }}>
                        <CardContent>
                            <Grid container>
                                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <TextField
                                            style={{width: '100%', padding: 0}}
                                            placeholder={t('history.searchHolder')}
                                            onChange={e => {
                                                setSearchKey(e.target.value)
                                            }}
                                        />
                                        <IconButton onClick={() => {
                                            if (pageIndex !== 1) {
                                                setPageIndex(1)
                                            } else {
                                                loadAllData()
                                            }
                                        }}>
                                            <SearchIcon style={{color: theme.palette.primary.main}}/>
                                        </IconButton>
                                    </div>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {
                        loading ?
                            <div style={{textAlign: 'center', marginTop: 200}}>
                                <CircularProgress/>
                            </div>
                            :
                            <div>
                                {noteList.length > 0 ?
                                    <div>
                                        {noteList.map((item, index) => (
                                            <MyHistoryRow data={item} key={index}/>
                                        ))
                                        }
                                    </div>
                                    :
                                    <div>no data</div>
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
export default MyHistoryHome
