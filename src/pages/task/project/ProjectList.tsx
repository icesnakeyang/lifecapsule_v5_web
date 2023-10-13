import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {apiListMyProject} from "../../../api/Api";
import {useEffect, useState} from "react";
import ProjectRow from "./ProjectRow";
import {
    Alert,
    AlertColor,
    Breadcrumbs,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Snackbar
} from "@mui/material";
import Header1 from "../../common/Header1";

const ProjectList = () => {
    const {t} = useTranslation()
    const navigate = useNavigate()
    const [projectList, setProjectList] = useState([])
    const [loading, setLoading] = useState(true)
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState<AlertColor>()
    const [showMsg, setShowMsg] = useState(false)

    useEffect(() => {
        loadAllData()
    }, [])

    const loadAllData = () => {
        let params = {}
        apiListMyProject(params).then((res: any) => {
            if (res.code === 0) {
                setProjectList(res.data.projectList)
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
            <div style={{display: 'flex', justifyContent: 'center', padding: 10}}>
                <div style={{width: '100%', maxWidth: 1080}}>
                    <Breadcrumbs style={{marginTop: 60}}>
                        <Button onClick={()=>{
                            navigate('/Dashboard1')
                        }}>{t('nav.home')}</Button>
                        <Button onClick={()=>{
                            navigate(-1)
                        }}>{t('nav.back')}</Button>
                        <span>{t('project.myProjectList')}</span>
                    </Breadcrumbs>

                    <Card style={{marginTop: 10}}>
                        <CardContent>
                            <Grid container>
                                <Grid item>
                                    <Button
                                        variant='contained'
                                        onClick={() => {
                                            navigate('/main/ProjectEdit')
                                        }}
                                    >{t('project.createNewProject')}</Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    {loading ?
                        <div style={{display: 'flex', justifyContent: 'center', marginTop: 200}}>
                            <CircularProgress/>
                        </div> :
                        <div>
                            {projectList.length ?
                                projectList.map((item: any, index: any) => (
                                    <ProjectRow data={item}/>
                                )) :
                                <div>{t('project.noProject')}</div>
                            }
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
export default ProjectList
