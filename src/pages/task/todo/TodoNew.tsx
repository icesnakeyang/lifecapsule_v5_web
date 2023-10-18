import Header1 from "../../common/Header1";
import {
    Alert, AlertColor,
    Breadcrumbs,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Snackbar,
    TextField
} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {clearCurrentProject} from "../../../store/projectSlice";
import {saveTodoTaskContent, saveTodoTaskTitle} from "../../../store/taskTodoSlice";
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import {apiCreateMyTaskTodo, apiRequestRsaPublicKey, apiUpdateMyTaskTodo} from "../../../api/Api";
import {Encrypt, GenerateKey, RSAencrypt} from "../../../common/crypto";
import CryptoJS from "crypto-js";

const TodoNew = () => {
    const {t} = useTranslation()
    const navigate = useNavigate()
    const currentProjectName = useSelector((state: any) => state.projectSlice.currentProjectName)
    const dispatch = useDispatch()
    const [todoTaskTitle, setTodoTaskTitle] = useState('')
    const [todoTaskContent, setTodoTaskContent] = useState('')
    const [saving, setSaving] = useState(false)
    const currentProjectId = useSelector((state: any) => state.projectSlice.currentProjectId)
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState<AlertColor>()
    const [showMsg, setShowMsg] = useState(false)

    const saveTodo = () => {
        if (!todoTaskTitle) {
            setMsg(t('task.tipNoTitle'))
            setMsgType('error')
            setShowMsg(true)
            return
        }
        let params = {
            title: todoTaskTitle,
            content: todoTaskContent,
            projectId: currentProjectId,
            encryptKey: "",
            keyToken: "",
        }
        setSaving(true)
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
                    apiCreateMyTaskTodo(params).then((res: any) => {
                        if (res.code === 0) {
                            setMsg(t("task.tipSaveSuccess"))
                            setMsgType('success')
                            setShowMsg(true)
                            setTimeout(() => {
                                navigate(-1)
                            }, 1000)
                        } else {
                            setMsg(t("syserr." + res.code))
                            setMsgType('error')
                            setShowMsg(true)
                            setSaving(false)
                        }
                    }).catch(() => {
                        setMsg(t("syserr.10001"))
                        setMsgType('error')
                        setShowMsg(true)
                        setSaving(false)
                    })
                } else {
                    setMsg(t("syserr." + res1.code))
                    setMsgType('error')
                    setShowMsg(true)
                    setSaving(false)
                }
            }).catch(() => {
            setMsg(t("syserr.10001"))
            setMsgType('error')
            setShowMsg(true)
            setSaving(false)
        })
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
                            onChange={(e: any) => setTodoTaskTitle(e.target.value)}
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
                                setTodoTaskContent(e.target.value)
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
export default TodoNew
