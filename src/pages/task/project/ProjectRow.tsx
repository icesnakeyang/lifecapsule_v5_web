import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {saveCurrentProjectId, saveCurrentProjectName} from "../../../store/projectSlice";
import {saveDoNotLoadToDoTask} from "../../../store/commonSlice";
import {Button, Card, CardContent, Grid, IconButton, Paper} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {useTranslation} from "react-i18next";
import BorderColorIcon from '@mui/icons-material/BorderColor';

const ProjectRow = (data: any) => {
    const item = data.data
    const theme = useTheme()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {t} = useTranslation()

    return (
        <Paper style={{marginTop: 10, padding: 10}}>

            <Button variant='contained' size='small' onClick={() => {
                dispatch(saveCurrentProjectId(item.projectId))
                dispatch(saveCurrentProjectName(item.projectName))
                dispatch(saveDoNotLoadToDoTask(true))
                navigate(-1)
            }}>
                {t('common.btSelect')}
            </Button>
            <span style={{marginLeft: 10}}>{item.projectName}</span>

            <IconButton
                style={{marginLeft: 10, color: theme.palette.primary.main}}
                size='small'
                onClick={() => {
                    navigate('/ProjectEdit', {state: {projectId: item.projectId}})
                }}>
                <BorderColorIcon style={{fontSize: 18}}/>
            </IconButton>


        </Paper>
    )
}
export default ProjectRow
