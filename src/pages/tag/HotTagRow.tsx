import {Chip, Grid} from "@mui/material";

const HotTagRow = (data: any) => {
    console.log(data)
    const {item} = data
    const onSelectTag = () => {
        data.onSelectTag(item)
    }
    return (
        <Grid item>
            <Chip style={{marginBottom: 10}} color='primary' size='small' label={item.tagName} onClick={onSelectTag}/>
        </Grid>
    )
}
export default HotTagRow
