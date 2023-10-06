import {useEffect} from "react";
import {apiListUserNoteTag} from "../../api/Api";
import {useDispatch, useSelector} from "react-redux";
import {saveEditTags, saveMyAllNoteTags} from "../../store/tagSlice";
import MyAllTagRow from "./MyAllTagRow";
import {useTranslation} from "react-i18next";
import {Grid, Stack} from "@mui/material";

const MyNoteTags1 = () => {
    const myAllNoteTags = useSelector((state: any) => state.tagSlice.myAllNoteTags)
    const editTags = useSelector((state: any) => state.tagSlice.editTags)
    const dispatch = useDispatch()
    const {t} = useTranslation()

    useEffect(() => {
        apiListUserNoteTag().then((res: any) => {
            if (res.code === 0) {
                dispatch(saveMyAllNoteTags(res.data.tagList))
            }
        }).catch(() => {
        })
    }, [])
    return (
        myAllNoteTags && myAllNoteTags.length > 0 ?
            <Grid container rowSpacing={1} columnSpacing={1}>
                {myAllNoteTags.map((item: any, index: any) => (
                    <MyAllTagRow item={item} key={index} onSelectTag={(data: any) => {
                        console.log(1)
                        if (editTags.length === 0) {
                            console.log(2)
                            let tags = [
                                {
                                        tagName: data.tagName
                                }]
                            dispatch(saveEditTags(tags))
                        } else {
                            console.log(3)
                            console.log(editTags)
                            let tags: any = []
                            let cc = 0;
                            editTags.map((item2: any) => {
                                if (data.tagName === item2.tagName) {
                                    cc++
                                } else {
                                    tags.push(item2)
                                }
                            })
                            console.log(4)
                            if (cc === 0) {
                                console.log(5)
                                tags.push(data)
                                dispatch(saveEditTags(tags))
                            }
                        }
                    }}/>
                ))
                }
            </Grid>
            : <div style={{}}>{t('Tag.tipNoMyTag')}</div>
    )
}
export default MyNoteTags1
