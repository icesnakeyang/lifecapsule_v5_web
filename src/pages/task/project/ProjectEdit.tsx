import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {apiGetProject, apiSaveMyProject} from "../../../api/Api";
import {useTheme} from "@mui/material/styles";
import {
    Alert,
    AlertColor,
    Breadcrumbs,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Snackbar,
    TextField
} from "@mui/material";
import Header1 from "../../common/Header1";

const ProjectEdit = () => {
    const params: any = useLocation().state
    const projectId = params && params.projectId
    const {t} = useTranslation()
    const navigate = useNavigate()
    const [projectName, setProjectName] = useState('')
    const [saving, setSaving] = useState(false)
    const theme = useTheme()
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState<AlertColor>()
    const [showMsg, setShowMsg] = useState(false)

    useEffect(() => {
        if (projectId != null) {
            if (projectId) {
                loadAllData()
            }
        }
    }, [])

    const loadAllData = () => {
        let params = {
            projectId
        }
        apiGetProject(params).then((res: any) => {
            if (res.code === 0) {
                setProjectName(res.data.project.projectName)
            }
        })
    }

    const onSaveProject = () => {
        let params = {
            projectName,
            projectId
        }
        setSaving(true)
        apiSaveMyProject(params).then((res: any) => {
            if (res.code === 0) {
                setMsg(t('project.tipSaveSuccess'))
                setMsgType('success')
                setShowMsg(true)
                setTimeout(() => {
                    navigate(-1)
                }, 2000)
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
                        <span>{t('project.editProject')}</span>
                    </Breadcrumbs>

                    <Card style={{marginTop: 10}}>
                        <CardContent>
                            <TextField
                                label={t('project.projectName')}
                                variant='standard'
                                style={{width: '100%'}}
                                placeholder={t('project.projectNameHolder')}
                                value={projectName}
                                onChange={e => {
                                    setProjectName(e.target.value)
                                }}/>

                            <div style={{
                                marginTop: 20,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {saving ?
                                    <CircularProgress/> :
                                    <Button
                                        variant='contained'
                                        onClick={() => {
                                            onSaveProject()
                                        }
                                        }>{t('project.btSave')}</Button>}
                            </div>
                        </CardContent>
                    </Card>
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
export default ProjectEdit
