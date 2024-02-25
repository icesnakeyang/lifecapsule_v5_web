import {Button, Chip, Grid, Paper} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {saveNoteId} from "../../store/noteDataSlice";
import moment from "moment";
import {useTranslation} from "react-i18next";
import {saveProcrastinationNoteId} from "../../store/procrastinationSlice";
import LoveLetterEdit from "../note/loveLetter/LoveLetterEdit";

const MyHistoryRow = (data: any) => {
    const row = data.data
    const theme = useTheme()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {t} = useTranslation()
    return (
        <Paper style={{
            marginTop: 10, padding: 10, background: theme.palette.background.default,
            border: '1px solid', borderColor: theme.palette.primary.main
        }}>

            <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Button onClick={() => {
                        dispatch(saveNoteId(row.noteId))
                        console.log(row)
                        if (!row.noteType) {
                            dispatch(saveNoteId(row.noteId))
                            navigate('/NoteDetail')
                        } else {
                            if (row.noteType === 'ANTI_DELAY_NOTE') {
                                dispatch(saveProcrastinationNoteId(row.noteId))
                                navigate('/ProcrastinationEdit')
                            }
                            if (row.noteType === 'LOVE_LETTER') {
                                dispatch(saveNoteId(row.noteId))
                                navigate('/LoveLetterEdit')
                            }
                        }
                    }}>
                        {row.title}
                    </Button>
                </Grid>
                <Grid item xs={6} sm={3} md={2} lg={2} xl={2}>
                    <span style={{fontSize: 12}}>
                    {moment(row.createTime).format('ll')}
                    </span>
                </Grid>
                <Grid item xs={6} sm={6} md={2} lg={2} xl={2}>
                    <Chip size='small' label={
                        row.noteType ?
                            t('noteType.' + row.noteType)
                            :
                            t('noteType.NOTE')
                    }
                    />
                </Grid>
            </Grid>
        </Paper>

    )
}
export default MyHistoryRow
