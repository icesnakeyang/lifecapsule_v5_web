import {saveEditTags, saveHotTags} from "../../store/tagSlice";
import {apiListHotNoteTags} from "../../api/Api";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import HotTagRow from "./HotTagRow";
import {Grid, Stack} from "@mui/material";

const HotTags1 = () => {
    const hotTags = useSelector((state: any) => state.tagSlice.hotTags)
    const editTags = useSelector((state: any) => state.tagSlice.editTags)
    const dispatch = useDispatch()

    useEffect(() => {
        apiListHotNoteTags().then((res: any) => {
            if (res.code === 0) {
                dispatch(saveHotTags(res.data.tagList))
            }
        })
    }, [])

    return (
        hotTags && hotTags.length > 0 ?
           <Grid container rowSpacing={1} columnSpacing={1}>
                {hotTags.map((item: any, index: any) => (
                    <HotTagRow item={item} key={index} onSelectTag={(data: any) => {
                        if (editTags.length === 0) {
                            let tags = [
                                {

                                    tagName: data.tagName

                                }]
                            dispatch(saveEditTags(tags))
                        } else {
                            let tags: any = []
                            let cc = 0;
                            editTags.map((item2: any) => {
                                if (data.tagName === item2.tagName) {
                                    cc++
                                } else {
                                    tags.push(item2)
                                }
                            })
                            if (cc === 0) {
                                tags.push(data)
                                dispatch(saveEditTags(tags))
                            }
                        }
                    }}/>
                ))
                }
           </Grid>
            : null
    )
}
export default HotTags1
