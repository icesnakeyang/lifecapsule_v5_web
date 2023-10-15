import {Button, Paper} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {saveNoteId} from "../../../store/noteDataSlice";

const LoveLetterRow1 = (data: any) => {
    const item = data.data
    const theme = useTheme()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    return (
        <Paper style={{
            marginTop: 10,
            background: theme.palette.background.default,
            border: '1px solid',
            borderColor: theme.palette.primary.main
        }}>
            <Button onClick={() => {
                dispatch(saveNoteId(item.noteId))
                navigate('/LoveLetterEdit')
            }}>{item.title}</Button>

        </Paper>
    )
}
export default LoveLetterRow1
