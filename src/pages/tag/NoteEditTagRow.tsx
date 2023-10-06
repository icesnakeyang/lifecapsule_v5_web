import {Chip} from "@mui/material";

const NoteEditTagRow = (data: any) => {
    const {item} = data
    return (
        <Chip style={{marginTop: 5, marginBottom: 5}} size='small' label={item.tagName}/>
    )
}
export default NoteEditTagRow
