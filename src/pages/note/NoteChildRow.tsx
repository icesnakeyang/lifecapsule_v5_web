import {Button, Paper} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {useDispatch} from "react-redux";
import {saveNoteId} from "../../store/noteDataSlice";

const NoteChildRow = (data: any) => {
    const item = data.data
    const theme = useTheme()
    const dispatch = useDispatch()

    return (
        <Paper style={{margin: 5, padding: 5, background: theme.palette.background.default}}>
            <Button onClick={() => {
                dispatch(saveNoteId(item.noteId))
            }}>
                {item.title}
            </Button>
        </Paper>
    )
}
export default NoteChildRow
