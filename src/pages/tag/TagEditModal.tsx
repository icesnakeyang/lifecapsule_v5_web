import NoteEditTagRowEdit from "./NoteEditTagRowEdit";
import MyNoteTags1 from "./MyNoteTags1";
import HotTags1 from "./HotTags1";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {saveEditTags} from "../../store/tagSlice";
import {apiSaveMyNoteTags} from "../../api/Api";
import {
    Box,
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Grid,
    Input,
    Modal,
    Stack,
    TextField, useMediaQuery
} from "@mui/material";
import {useTheme} from "@mui/material/styles";

const TagEditModal = ({visible, hideModal}: any) => {
    const {t} = useTranslation()
    const [tagEdit, setTagEdit] = useState('')
    const editTags = useSelector((state: any) => state.tagSlice.editTags)
    const dispatch = useDispatch()
    const noteId = useSelector((state: any) => state.noteDataSlice.noteId)
    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const onAddTag = () => {
        if (!tagEdit) {
            return
        }
        if (!editTags || editTags.length === 0) {
            let list = [
                {
                    tagName: tagEdit
                }
            ]
            dispatch(saveEditTags(list))
        } else {
            let cc = 0;
            let tags = []
            editTags.map((item: any) => {
                tags.push(item)
                if (item.tagName === tagEdit) {
                    cc++
                }
            })
            if (cc === 0) {
                tags.push({tagName: tagEdit})
            }
            dispatch(saveEditTags(tags))
        }
    }

    const onSaveTags = () => {
        if (!noteId) {
            return
        }
        /**
         * 保存tag到note
         */
        let params = {
            tagList: editTags,
            noteId
        }
        apiSaveMyNoteTags(params).then((res: any) => {
            if (res.code === 0) {
                // message.success(t('Tag.tipSaveTagSuccess'))
            } else {
                // message.error(t('syserr.' + res.code))
            }
        }).catch(() => {
            // message.error(t('syserr.10001'))
        })
    }

    return (
        <Dialog
            open={visible}
            onClose={() => {
                onSaveTags()
                hideModal()
            }}
            disableEscapeKeyDown={true}

            // cancelButtonProps={{style: {display: "none"}}}
        >
            <DialogContent style={{background:theme.palette.background.default}}>
                <Box
                    sx={{
                    }}>
                    <Box>
                        <Box sx={{display: 'flex'}}>
                            <TextField variant='standard' label={t('Tag.addTag')} style={{width: '100%'}}
                                       value={tagEdit}
                                       onChange={(e) => {
                                           setTagEdit(e.target.value)
                                       }}/>
                            <Button size='small' variant='contained'
                                    onClick={() => onAddTag()}>{t('common.btAdd')}</Button>
                        </Box>
                    </Box>
                    <Box sx={{marginTop: 1}}>
                        {editTags.length > 0 ?
                            <Grid container columnSpacing={1} rowSpacing={1}>
                                {editTags.map((item: any, index: any) => (
                                    <NoteEditTagRowEdit data={item} key={index}/>
                                ))
                                }
                            </Grid>
                            : null}
                    </Box>

                    <Box sx={{marginTop: 4}}>
                        <Box sx={{}}>{t('Tag.myTags')}</Box>
                        <Box sx={{marginTop: 1}}>
                            <MyNoteTags1/>
                        </Box>
                    </Box>

                    <Box sx={{marginTop: 4}}>
                        <div>{t('Tag.hotTags')}</div>
                        <div style={{marginTop: 10}}>
                            <HotTags1/>
                        </div>
                    </Box>
                </Box>
                <DialogActions>
                    <Button onClick={() => {
                        onSaveTags()
                        hideModal()
                    }}>Close</Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    )
}
export default TagEditModal
