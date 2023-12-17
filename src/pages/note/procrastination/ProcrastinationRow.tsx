import {Button, Paper} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import { saveProcrastinationNoteId } from "../../../store/procrastinationSlice";

const ProcrastinationRow = (data: any) => {
    const item = data.data
    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    return (
        <div>
            <Paper sx={{marginTop: 1, maxWidth: 1080, background: theme.palette.background.default}}>
                <Button variant='outlined' sx={{width: '100%'}} onClick={() => {
                    dispatch(saveProcrastinationNoteId(item.noteId))
                    navigate('/ProcrastinationEdit')
                }}>
                <span style={{color: theme.palette.primary.main}}>
                    {item?.title ? item.title : 'no title'}
                </span>
                </Button>
            </Paper>
        </div>
    )
}
export default ProcrastinationRow
