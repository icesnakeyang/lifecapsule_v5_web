import moment from "moment";
import {Button, Chip, Paper, Stack} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {useDispatch} from "react-redux";
import {saveNoteId} from "../../store/noteDataSlice";

const SubNoteRow = (data: any) => {
    const item = data.data
    const theme = useTheme()
    const dispatch = useDispatch()
    return (
        <Paper style={{
            padding: 0, marginTop: 10, background: theme.palette.background.default,
            border: '1px solid',
            borderColor: theme.palette.primary.main
        }}>
            <Stack direction='row' spacing={1} alignItems='center'>
                <Button style={{}} onClick={() => {
                    dispatch(saveNoteId(item.noteId))
                }}>{item.title}</Button>
                <Chip size='small' style={{color: theme.palette.primary.main}}
                      label={moment(item.createTime).format('ll')}/>
            </Stack>
        </Paper>
    )
}
export default SubNoteRow
