import {Box, Button, Chip, Grid, Paper} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useTheme} from "@mui/material/styles";
import {saveNoteId} from "../../store/noteDataSlice";

const NoteRow1 = (data: any) => {
    const row = data.data;
    const navigate = useNavigate();
    const {t} = useTranslation();
    const dispatch = useDispatch()
    const theme = useTheme()

    return (
        <Paper sx={{marginTop: 1, maxWidth: 1080, background: theme.palette.background.default}}>
            <Button variant='outlined' sx={{width: '100%'}} onClick={() => {
                dispatch(saveNoteId(row.noteId))
                // navigate('/NoteEdit')
                navigate('/NoteDetail')
            }}>
                <span style={{color: theme.palette.primary.main}}>
                    {row?.title ? row.title : 'no title'}
                </span>
            </Button>
        </Paper>
    )
}
export default NoteRow1
