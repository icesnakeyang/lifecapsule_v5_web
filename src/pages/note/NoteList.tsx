import {useDispatch, useSelector} from "react-redux";
import {apiListMyNote, apiListUserNoteTag} from "../../api/Api";
import {useEffect, useState} from "react";
import {saveNoteList, saveNoteListSearchKey, saveNotePageIndex} from "../../store/noteDataSlice";
import {
    Alert,
    AlertColor,
    Box,
    Breadcrumbs,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider, Grid, Hidden,
    IconButton,
    InputBase,
    Modal,
    Paper,
    Snackbar,
    Stack,
    TextField, useMediaQuery
} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import NoteRow1 from "./NoteRow1";
import Header1 from "../common/Header1";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import {useLocaleText} from "@mui/x-date-pickers/internals";
import {useTheme} from "@mui/material/styles";
import NotePageTagRow from "../tag/NotePageTagRow";
import NotePageModalTagRow from "../tag/NotePageModalTagRow";
import CloseIcon from '@mui/icons-material/Close';
import {loadRefresh} from "../../store/commonSlice";
import {Pagination} from "@mui/lab";

const NoteList = () => {
    const notePageIndex = useSelector(
        (state: any) => state.noteDataSlice.notePageIndex
    );
    const notePageSize = useSelector(
        (state: any) => state.noteDataSlice.notePageSize
    );
    const noteListTags = useSelector((state: any) => state.noteDataSlice.noteListTags)
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch()
    const [totalNote, setTotalNote] = useState(0);
    const [showMsg, setShowMsg] = useState(false)
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState<AlertColor>('success')
    const {t} = useTranslation()
    const navigate = useNavigate()
    const [myNoteTags, setMyNoteTags] = useState([])
    const refresh = useSelector((state: any) => state.commonSlice.refresh)
    const noteList =
        useSelector((state: any) => state.noteDataSlice.noteList) || [];
    const theme = useTheme()
    const [modalTag, setModalTag] = useState(false)
    const noteListSearchKey = useSelector((state: any) => state.noteDataSlice.noteListSearchKey)
    const [searchKey, setSearchKey] = useState('')
    const [notePages, setNotePages] = useState(1)

    useEffect(() => {
        loadBaseData()
    }, [])

    useEffect(() => {
        listMyNote()
    }, [refresh, notePageIndex, notePageSize])

    const listMyNote = () => {
        let params = {
            pageIndex: notePageIndex,
            pageSize: notePageSize,
            tagList: noteListTags,
            searchKey
        };
        setLoading(true);
        apiListMyNote(params)
            .then((res: any) => {
                if (res.code === 0) {
                    dispatch(saveNoteList(res.data.noteList));
                    setTotalNote(res.data.totalNote);
                    const totalPages = Math.ceil(res.data.totalNote / notePageSize);
                    setNotePages(totalPages)
                    setLoading(false);
                } else {
                    setMsg(t("syserr." + res.code))
                    setMsgType('error')
                    setShowMsg(true)
                    if (res.code === 10003) {
                        navigate("/guest/LoginPage");
                    }
                }
            })
            .catch((err) => {
                setMsg(t("syserr.10001"))
                setMsgType('error')
                setShowMsg(true)
            });
    };

    const loadBaseData = () => {
        apiListUserNoteTag().then((res: any) => {
            if (res.code === 0) {
                setMyNoteTags(res.data.tagList)
            }
        }).catch(() => {
        })
    }

    const getFun = () => {
        setModalTag(false)
    }

    return (
        <div style={{padding: 10}}>
            <Header1/>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{width: '100%', maxWidth: 1080}}>
                    <Breadcrumbs sx={{marginTop: 8}}>
                        <Button onClick={() => {
                            navigate('/Dashboard1')
                        }}>{t('nav.home')}</Button>
                        <Button onClick={() => {
                            navigate(-1)
                        }}>
                            {t('nav.back')}
                        </Button>
                        <span style={{}}>{t('nav.myNote')}</span>
                    </Breadcrumbs>
                    <Card style={{background: theme.palette.background.default}}>
                        <CardContent>
                            <Grid container rowSpacing={1}>
                                <Hidden mdUp>
                                    <Grid item xs={12} sm={2}>
                                        <Button variant='contained'
                                                onClick={() => {
                                                    navigate('/NoteNew')
                                                }}
                                                startIcon={<AddIcon/>}>{t('noteList.btNew')}</Button>
                                    </Grid>
                                </Hidden>
                                <Hidden mdDown>
                                    <Grid item md={3} lg={3} xl={3}>
                                        <Button variant='contained'
                                                onClick={() => {
                                                    navigate('/NoteNew')
                                                }}
                                                startIcon={<AddIcon/>}>{t('noteList.btCreateNewNote')}</Button>
                                    </Grid>
                                </Hidden>
                                <Grid item xs={12} sm={10} md={8} lg={8} xl={8}>
                                    <InputBase style={{
                                        paddingLeft: 10,
                                        border: '1px solid',
                                        borderColor: theme.palette.primary.main,
                                        width: '85%',
                                    }}
                                               placeholder={t('MyNotes.NoteList.searchHolder')}
                                               onChange={e => {
                                                   setSearchKey(e.target.value.trim())
                                               }}
                                    />
                                    <IconButton type="button" aria-label="search" onClick={() => {
                                        console.log(noteListSearchKey)
                                        dispatch(saveNotePageIndex(1))
                                        dispatch(loadRefresh())
                                    }}>
                                        <SearchIcon style={{color: theme.palette.primary.main}}/>
                                    </IconButton>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <Button onClick={() => {
                                            setModalTag(true)
                                        }}>#{t('Tag.tags')}</Button>
                                        <Grid container rowSpacing={1} columnSpacing={1}>
                                            {noteListTags && noteListTags.length > 0 ?
                                                noteListTags.map((item: any, index: any) => (
                                                    <NotePageTagRow item={item} key={index}/>
                                                )) : null}
                                        </Grid>
                                    </div>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    <div style={{marginTop: 20}}></div>
                    {noteList.length > 0 ?
                        <div>
                            {noteList.map((item: any, index: any) => (
                                <NoteRow1 data={item} key={index}/>
                            ))
                            }
                            <Pagination style={{marginTop: 10}} count={notePages} page={notePageIndex}
                                        onChange={(e, page) => {
                                            dispatch(saveNotePageIndex(page))
                                        }}/>
                        </div>
                        :
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: "center",
                            alignItems: 'center'
                        }}>
                            <div>
                                {t('noteList.noNote')}
                            </div>
                            <div style={{marginTop: 10}}>
                                <Button variant='contained' onClick={() => {
                                    navigate('/NoteNew')
                                }}>{t('noteList.btCreateNow')}</Button>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <Snackbar open={showMsg}
                      autoHideDuration={3000}
                      onClose={() => {
                          setShowMsg(false)
                      }}
                      anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert severity={msgType} variant='filled'>{msg}</Alert>
            </Snackbar>

            <Dialog open={modalTag}>
                <DialogContent style={{padding: 20, minWidth: 300, background: theme.palette.background.default}}>
                    <IconButton
                        aria-label="close"
                        onClick={() => {
                            setModalTag(false)
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
                    <Grid container spacing={0.5} rowSpacing={0.5}>
                        {myNoteTags && myNoteTags.length > 0 ?
                            myNoteTags.map((item: any, index: any) => (
                                <NotePageModalTagRow item={item} key={index} getFun={getFun}/>
                            )) : null}
                    </Grid>
                </DialogContent>
            </Dialog>
        </div>
    )
}
export default NoteList
