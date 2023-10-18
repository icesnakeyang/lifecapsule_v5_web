import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import CryptoJS from "crypto-js";
import {apiGetMyTaskTodo, apiRequestRsaPublicKey, apiUpdateMyTaskTodo} from "../../../api/Api";
import {Decrypt, Decrypt2, Encrypt, GenerateKey, GenerateRandomString16, RSAencrypt} from "../../../common/crypto";
import {saveTodoTaskContent, saveTodoTaskTitle} from "../../../store/taskTodoSlice";
import {clearCurrentProject, saveCurrentProjectId, saveCurrentProjectName} from "../../../store/projectSlice";
import {
    Alert,
    AlertColor,
    Breadcrumbs,
    Button,
    Chip, CircularProgress,
    Dialog,
    DialogActions,
    DialogContent, Divider,
    Snackbar,
    TextField
} from "@mui/material";
import Header1 from "../../common/Header1";
import {Tag} from "@mui/icons-material";
import {useTheme} from "@mui/material/styles";

const TodoEdit = () => {
        const {t} = useTranslation();
        const [modalDelete, setModalDelete] = useState(false);
        const [saving, setSaving] = useState(false);
        const navigate = useNavigate();
        const dispatch = useDispatch();
        const [loading, setLoading] = useState(true);
        const currentProjectName = useSelector((state: any) => state.projectSlice.currentProjectName)
        const currentProjectId = useSelector((state: any) => state.projectSlice.currentProjectId)
        const doNotLoadTodoTask = useSelector((state: any) => state.commonSlice.doNotLoadTodoTask)
        const todoTaskTitle = useSelector((state: any) => state.taskTodoSlice.todoTaskTitle) || ''
        const todoTaskContent = useSelector((state: any) => state.taskTodoSlice.todoTaskContent)
        const todoTaskId = useSelector((state: any) => state.taskTodoSlice.todoTaskId) || null
        const [msg, setMsg] = useState('')
        const [msgType, setMsgType] = useState<AlertColor>()
        const [showMsg, setShowMsg] = useState(false)
        const theme = useTheme()

        useEffect(() => {
            console.log(todoTaskId)
            if (todoTaskId) {
                //修改
                if (doNotLoadTodoTask) {
                    setLoading(false);
                } else {
                    loadAllData();
                }
            } else {
                //新增
                setLoading(false);
            }
            return () => {
            };
        }, [todoTaskId]);

        const loadAllData = () => {
            let params = {
                taskId: todoTaskId,
                encryptKey: {},
                keyToken: "",
            };
            apiRequestRsaPublicKey().then((res1: any) => {
                    if (res1.code === 0) {
                        const keyAES_1 = GenerateRandomString16();
                        params.encryptKey = RSAencrypt(keyAES_1, res1.data.publicKey);
                        params.keyToken = res1.data.keyToken;

                        apiGetMyTaskTodo(params)
                            .then((res: any) => {
                                    if (res.code === 0) {
                                        dispatch(saveTodoTaskTitle(res.data.taskTodo.taskTitle))
                                        let content = res.data.taskTodo.content;
                                        let strKey = res.data.taskTodo.userEncodeKey;
                                        if (strKey) {
                                            strKey = Decrypt2(strKey, keyAES_1);
                                            content = Decrypt(content, strKey, strKey);
                                        }
                                        dispatch(saveTodoTaskContent(content))
                                        dispatch(saveCurrentProjectId(res.data.taskTodo.projectId))
                                        dispatch(saveCurrentProjectName(res.data.taskTodo.projectName))
                                        setLoading(false);
                                    } else {
                                        setMsg(t("syserr." + res.code))
                                        setMsgType('error')
                                        setShowMsg(true)
                                    }
                                }
                            )
                            .catch(() => {
                                setMsg(t("syserr.10001"))
                                setMsgType('error')
                                setShowMsg(true)
                            });
                    } else {
                        setMsg(t("syserr." + res1.code))
                        setMsgType('error')
                        setShowMsg(true)
                    }
                }
            ).catch(() => {
                setMsg(t("syserr.10001"))
                setMsgType('error')
                setShowMsg(true)
            })
        };

        const saveTodo = () => {
            let params = {
                title: todoTaskTitle,
                content: todoTaskContent,
                taskId: todoTaskId,
                encryptKey: "",
                keyToken: "",
                projectId: currentProjectId
            };
            setSaving(true);
            /**
             * 加密保存
             */
            const uuid = GenerateKey();
            const keyAES = CryptoJS.SHA256(uuid);
            const keyAESBase64 = CryptoJS.enc.Base64.stringify(keyAES);
            params.content = Encrypt(params.content, keyAESBase64, keyAESBase64);
            params.encryptKey = keyAESBase64;
            apiRequestRsaPublicKey()
                .then((res1: any) => {
                    if (res1.code === 0) {
                        params.encryptKey =
                            RSAencrypt(params.encryptKey, res1.data.publicKey) || "";
                        params.keyToken = res1.data.keyToken;
                        apiUpdateMyTaskTodo(params)
                            .then((res: any) => {
                                if (res.code === 0) {
                                    setMsg(t("task.tipSaveSuccess"))
                                    setMsgType('success')
                                    setShowMsg(true)
                                    setTimeout(() => {
                                        navigate(-1);
                                    }, 1000)
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
                    } else {
                        setMsg(t("syserr." + res1.code))
                        setMsgType('error')
                        setShowMsg(true)
                    }
                }).catch(() => {
                setMsg(t("syserr.10001"))
                setMsgType('error')
                setShowMsg(true)
            })
        };

        const deleteTodo = () => {
            setTimeout(() => {
            }, 100);
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
                                navigate('/TodoPage')
                            }}>{t('task.myTodoList')}</Button>
                            <Button onClick={() => {
                                navigate(-1)
                            }}>{t('nav.back')}</Button>
                            <span>{t("task.todoEdit")}</span>
                        </Breadcrumbs>

                        {loading ? (
                            <div
                                style={{
                                    marginTop: "100px",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    display: "flex",
                                }}
                            >
                                <CircularProgress/>
                            </div>
                        ) : (
                            <>
                                <Divider/>
                                <div style={{marginTop: 10, display: 'flex', alignItems: 'center'}}>
                                    <Button
                                        variant='contained'
                                        onClick={() => {
                                            navigate("/ProjectList")
                                        }}
                                    >{t('project.currentProject')}</Button>
                                    {currentProjectName &&
                                        <div style={{marginLeft: 10}}>
                                            <Chip label={currentProjectName} onDelete={() => {
                                                dispatch(clearCurrentProject())
                                            }}/>
                                        </div>
                                    }
                                </div>
                                <div style={{marginTop: 20}}>
                                    <TextField
                                        variant='standard'
                                        label={t("task.title")}
                                        style={{width: '100%'}}
                                        placeholder={t("task.titleHolder")}
                                        onChange={(e: any) => dispatch(saveTodoTaskTitle(e.target.value))}
                                        value={todoTaskTitle}
                                    />
                                </div>
                                <div style={{marginTop: 20}}>
                                    <TextField
                                        multiline
                                        label={t("task.content")}
                                        style={{width: '100%'}}
                                        value={todoTaskContent}
                                        onChange={(e) => {
                                            dispatch(saveTodoTaskContent(e.target.value))
                                        }}
                                    />
                                </div>
                                <div style={{display: "flex", justifyContent: "center"}}>
                                    {saving ? (
                                        <div style={{marginTop: 20}}>
                                            <CircularProgress/>
                                        </div>
                                    ) : (
                                        <Button
                                            variant='contained'
                                            style={{width: "140px", marginTop: 20}}
                                            onClick={() => saveTodo()}
                                        >
                                            {t("task.btSave")}
                                        </Button>
                                    )}
                                </div>
                            </>
                        )}
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

                <Dialog
                    open={modalDelete}
                >
                    <DialogContent>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            deleteTodo()
                        }}>confirm</Button>
                        <Button onClick={() => {
                            setModalDelete(false)
                        }}>cancel</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
            ;
    }
;

export default TodoEdit;
