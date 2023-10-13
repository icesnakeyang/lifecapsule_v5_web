import Header1 from "../../common/Header1";
import {
    Alert, AlertColor,
    Breadcrumbs,
    Button,
    Card,
    Checkbox,
    Chip,
    CircularProgress,
    FormControlLabel,
    FormGroup,
    Grid, Paper, Snackbar
} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {clearCurrentProject} from "../../../store/projectSlice";
import TodoRow from "./TodoRow";
import {Pagination} from "@mui/lab";
import {saveTodoList, saveTodoPageIndex, saveTodoPageSize, saveTotalTodo} from "../../../store/taskTodoSlice";
import {apiListMyTaskTodo} from "../../../api/Api";
import {saveDoNotLoadToDoTask} from "../../../store/commonSlice";
import {useLocaleText} from "@mui/x-date-pickers/internals";
import {useTheme} from "@mui/material/styles";

const TodoPage = () => {
    const {t} = useTranslation()
    const navigate = useNavigate()
    const [hideComplete, setHideComplete] = useState(false);
    const currentProjectName = useSelector((state: any) => state.projectSlice.currentProjectName)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [todoList, setTodoList] = useState([])
    const [totalTodo, setTotalTodo] = useState(0)
    const [pageIndex, setPageIndex] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const currentProjectId = useSelector((state: any) => state.projectSlice.currentProjectId)
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState<AlertColor>()
    const [showMsg, setShowMsg] = useState(false)
    const theme = useTheme()
    useEffect(() => {
        loadAllData();
        return () => {
        };
    }, [pageIndex, pageSize, hideComplete, currentProjectId]);

    useEffect(() => {
        // if (doNotLoadTodoTask) {
        //     dispatch(saveDoNotLoadToDoTask(false))
        // } else {
        //     dispatch(saveTodoPageIndex(1))
        // }
        // loadAllData()
    }, [])

    const loadAllData = () => {
        let params = {
            pageIndex,
            pageSize,
            hideComplete,
            projectId: currentProjectId
        };
        setLoading(true)
        apiListMyTaskTodo(params)
            .then((res: any) => {
                if (res.code === 0) {
                    setTodoList(res.data.taskTodoList)
                    setTotalTodo(res.data.totalTaskTodo)
                    const totalPages = Math.ceil(res.data.totalTaskTodo / pageSize);
                    setTotalPage(totalPages)
                    setLoading(false)
                } else {
                    setMsg(t("syserr." + res.code))
                    setMsgType('error')
                    setShowMsg(true)
                    setTimeout(() => {
                        if (res.code === 10047) {
                            navigate("/guest/LoginPage");
                        }
                    }, 1000)
                }
            })
            .catch(() => {
                setMsg(t("syserr.10001"))
                setMsgType('error')
                setShowMsg(true)
            });
    };

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
                            navigate(-1)
                        }}>{t('nav.back')}</Button>
                        <span>{t("task.myTodoList")}</span>
                    </Breadcrumbs>

                    <Paper style={{
                        marginTop: 10,
                        padding: 10,
                        background: theme.palette.background.default
                    }}>
                        <Grid container>
                            <Grid item xs={6} sm={2} md={2} lg={2} xl={2}>
                                <Button
                                    variant='contained'
                                    onClick={() => {
                                        navigate("/main/TodoNew");
                                    }}
                                >
                                    {t("task.btAddTodo")}
                                </Button>
                            </Grid>
                            <Grid item xs={6} sm={12} md={12} lg={5} xl={4}
                                  style={{display: "flex", alignItems: "center"}}>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={hideComplete} onChange={() => {
                                        console.log(hideComplete)
                                        setHideComplete(!hideComplete)
                                        // setHideComplete(e.target.value);
                                    }}/>} label={t("task.hideComplete")}/>
                                </FormGroup>
                            </Grid>
                            <Grid item xs={24} sm={24} md={24} lg={14} xl={16}
                                  style={{display: 'flex', alignItems: 'center'}}>
                                <Button
                                    onClick={() => {
                                        navigate("/ProjectList")
                                    }}
                                >{t('project.currentProject')}</Button>
                                {currentProjectName &&
                                    <div style={{marginLeft: 10}}>
                                        <Chip
                                            label={currentProjectName}
                                            onDelete={() => {
                                                dispatch(clearCurrentProject())
                                            }}
                                        ></Chip>
                                    </div>
                                }
                            </Grid>
                        </Grid>
                    </Paper>

                    {loading ?
                        <div style={{marginTop: 200, display: 'flex', justifyContent: 'center'}}>
                            <CircularProgress/>
                        </div>
                        :
                        <div style={{marginTop: 10}}>
                            {todoList.map((item: any, index: number) => {
                                return <TodoRow data={item} key={index}/>;
                            })}
                            <Pagination
                                style={{marginTop: 10}}
                                count={totalPage}
                                page={pageIndex}
                                // showTotal={(total) => `${t("MyNotes.totalNotes")}: ${total}`}
                                onChange={(e, page) => {
                                    setPageIndex(page)
                                }}
                            />
                        </div>
                    }

                </div>
            </div>

            <Snackbar open={showMsg}
                      autoHideDuration={2000}
                      anchorOrigin={{vertical: "top", horizontal: 'center'}}
                      onClose={() => {
                          console.log('close')
                          setShowMsg(false)
                      }}
            >
                <Alert variant={"filled"} severity={msgType}>{msg}</Alert>
            </Snackbar>
        </div>
    )
}
export default TodoPage
