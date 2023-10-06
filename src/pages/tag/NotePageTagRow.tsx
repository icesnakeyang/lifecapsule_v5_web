import {useDispatch, useSelector} from "react-redux";
import {saveNoteListTags} from "../../store/noteDataSlice";
import {loadRefresh} from "../../store/commonSlice";
import {Chip, Grid} from "@mui/material";

const NotePageTagRow = (data: any) => {
    const noteListTags = useSelector((state: any) => state.noteDataSlice.noteListTags)
    const dispatch = useDispatch()
    const {item} = data
    const onSelectTag = () => {
    }
    const onRemoveTag = () => {
        let tags: any = []
        if (noteListTags && noteListTags.length > 0) {
            let cc = 0;
            noteListTags.map((item2: any) => {
                if (item2.tagName === item.tagName) {
                    cc++
                } else {
                    tags.push({tagName: item2.tagName})
                }
            })
        }
        dispatch(saveNoteListTags(tags))
        dispatch(loadRefresh())
    }
    return (
        <Grid item>
            <Chip label={item.tagName} color='primary' size='small' onClick={onSelectTag} onDelete={onRemoveTag}/>
        </Grid>
    )
}
export default NotePageTagRow
