import {Tag} from "@mui/icons-material";
import {Chip, Grid} from "@mui/material";

const MyAllTagRow = (data: any) => {
    console.log(data)
    const {item} = data
    console.log(item.tagName)
    const onSelectTag = () => {
        data.onSelectTag(item)
    }
    return (
        <Grid item>
            <Chip style={{marginBottom: 0}} color='primary' size='small' label={item.tagName} onClick={onSelectTag}/>
        </Grid>
    )
}
export default MyAllTagRow
