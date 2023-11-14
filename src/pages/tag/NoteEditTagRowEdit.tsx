import {useDispatch, useSelector} from "react-redux";
import {saveEditTags} from "../../store/tagSlice";
import {Tag} from "@mui/icons-material";
import {Chip, Grid} from "@mui/material";

const NoteEditTagRowEdit = (data: any) => {
    const item = data.data
    const editTags = useSelector((state: any) => state.tagSlice.editTags)
    const dispatch = useDispatch()

    const onRemoveTag = () => {
        let tags: any = []
        editTags.forEach((row: any) => {
            if (item.tagName === row.tagName) {
            } else {
                tags.push(row)
            }
        })
        dispatch(saveEditTags(tags))
    }

    return (
        <Grid item>
            <Chip style={{marginBottom: 0}} color='primary' label={item.tagName} size='small' onDelete={() => {
                onRemoveTag()
            }}/>
        </Grid>
    )
}
export default NoteEditTagRowEdit
