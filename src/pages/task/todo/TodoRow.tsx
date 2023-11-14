import {
    Alert,
    AlertColor,
    Button,
    Card, CardContent,
    Checkbox,
    Dialog, DialogActions,
    DialogContent,
    FormControlLabel,
    Grid, IconButton,
    Paper,
    Snackbar, Stack
} from "@mui/material";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {apiDeleteMyTaskTodo, apiUpdateMyTaskTodoCompleteStatus} from "../../../api/Api";
import moment from "moment";
import {useDispatch} from "react-redux";
import {saveTodoTaskId} from "../../../store/taskTodoSlice";
import {loadRefresh, saveDoNotLoadToDoTask} from "../../../store/commonSlice";
import {useNavigate} from "react-router-dom";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {useTheme} from "@mui/material/styles";

const TodoRow = (data: any) => {
    const item = data.data
    const [complete, setComplete] = useState(false)
    const {t} = useTranslation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [modalDelete, setModalDelete] = useState(false)
    const [saving, setSaving] = useState(false)
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState<AlertColor>()
    const [showMsg, setShowMsg] = useState(false)
    const theme = useTheme()

    useEffect(() => {
        setComplete(item.complete)
    }, [])

    const onDeleteTask = () => {
        let params = {
            taskId: item.taskId,
        };
        setSaving(true);
        apiDeleteMyTaskTodo(params)
            .then((res: any) => {
                if (res.code === 0) {
                    setMsg(t("task.tipDeleteSuccess"));
                    setMsgType('success')
                    setShowMsg(true)
                    dispatch(loadRefresh());
                    setSaving(false)
                } else {
                    setMsg(t("syserr." + res.code));
                    setMsgType('error')
                    setShowMsg(true)
                    setSaving(false);
                    setModalDelete(false);
                }
            })
            .catch(() => {
                setMsg(t("syserr.10001"));
                setMsgType('error')
                setShowMsg(true)
                setSaving(false);
                setModalDelete(false);
            });
    };
    const onUpdateCompleteStatus = (foo: boolean) => {
        let params = {
            taskId: item.taskId,
            complete: foo
        };
        apiUpdateMyTaskTodoCompleteStatus(params)
            .then((res: any) => {
                if (res.code === 0) {
                    dispatch(loadRefresh());
                } else {
                    setMsg(t("syserr." + res.code))
                    setMsgType('error')
                    setShowMsg(true)
                }
            })
            .catch(() => {
                setMsg(t("syserr.10001"))
                setMsgType('error')
                setShowMsg(true)
            });
    };

    return (
        <div style={{marginTop: 10}}>
            <Card style={{
                marginTop: 10,
                padding: 0,
                background: theme.palette.background.default,
                border: '1px solid',
                borderColor: theme.palette.primary.main
            }}>
                <CardContent style={{padding: 0}}>
                    <Grid container rowSpacing={0} columnSpacing={0} style={{}}>
                        <Grid item xs={10} sm={10} md={10} lg={10} xl={10}
                              style={{padding: 0, width: '100%'}}>
                            <div style={{display: 'flex', width: '100%s'}}>
                                <Checkbox
                                    style={{color: theme.palette.primary.main}}
                                    checked={complete}
                                    onChange={(e) => {
                                        setComplete(e.target.checked)
                                        onUpdateCompleteStatus(e.target.checked)
                                    }}
                                ></Checkbox>
                                {complete ? (
                                    <div
                                        style={{
                                            textDecorationLine: "line-through",
                                            textDecorationStyle: "double",
                                            overflow: 'hidden',
                                            wordBreak: "break-all",
                                            marginLeft: 10,
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontSize: 18
                                        }}
                                    >
                                        <Button onClick={() => {
                                            dispatch(saveTodoTaskId(item.taskId))
                                            dispatch(saveDoNotLoadToDoTask(false))
                                            navigate("/TodoEdit");
                                        }}>
                                            {item.taskTitle}
                                        </Button>
                                    </div>
                                ) : (
                                    <div style={{
                                        overflow: 'hidden',
                                        wordBreak: "break-all",
                                        marginLeft: 10,
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: 18
                                    }}>
                                        <Button onClick={() => {
                                            dispatch(saveTodoTaskId(item.taskId))
                                            dispatch(saveDoNotLoadToDoTask(false))
                                            navigate("/TodoEdit");
                                        }}>
                                            {item.taskTitle}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Grid>

                        <Grid item xs={2} sm={2} md={2} lg={2} xl={2} style={{
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <div style={{
                                display: 'flex',
                            }}>
                                <IconButton
                                    onClick={() => setModalDelete(true)}
                                >
                                    <DeleteForeverIcon style={{color: theme.palette.primary.main}}/>
                                </IconButton>
                            </div>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>


            <Dialog open={modalDelete}>
                <DialogContent>
                    {t("task.tipDelete1")}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        onDeleteTask()
                    }}>Delete</Button>
                    <Button onClick={() => {
                        setModalDelete(false)
                    }}>Cancel</Button>
                </DialogActions>
            </Dialog>

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
export default TodoRow
