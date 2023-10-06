import {useDispatch, useSelector} from "react-redux";
import {saveNoteListTags} from "../../store/noteDataSlice";
import {loadRefresh} from "../../store/commonSlice";
import {Tag} from "@mui/icons-material";
import {Chip, Grid} from "@mui/material";

const NotePageModalTagRow=(data:any)=>{
    const {item} = data
    const noteListTags = useSelector((state: any) => state.noteDataSlice.noteListTags)
    const dispatch = useDispatch()

    const onSelectTag = () => {
        let tags:any = []
        if (noteListTags && noteListTags.length > 0) {
            let cc = 0;
            noteListTags.map((item2: any) => {
                if (item2.tagName === item.tagName) {
                    cc++
                }
                tags.push({tagName: item2.tagName})
            })
            if (cc === 0) {
                tags.push({tagName: item.tagName})
            }
        } else {
            tags.push({tagName: item.tagName})
        }
        dispatch(saveNoteListTags(tags))

        dispatch(loadRefresh())
        data.getFun()
    }
    return(
        <Grid item>
            <a style={{cursor:'pointer'}}>
                <Chip label={item.tagName} onClick={onSelectTag}/>
            </a>
        </Grid>
    )
}
export default NotePageModalTagRow
