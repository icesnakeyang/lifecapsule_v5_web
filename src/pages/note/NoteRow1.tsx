import {Box, Button, Chip, Grid, Paper, Stack} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useTheme} from "@mui/material/styles";
import {saveNoteId} from "../../store/noteDataSlice";

const NoteRow1 = (data: any) => {
    const row = data.data;
    const navigate = useNavigate();
    const {t} = useTranslation();
    const dispatch = useDispatch()
    const theme = useTheme()
    console.log(row)

    return (
        <Paper sx={{marginTop: 1, maxWidth: 1080, background: theme.palette.background.default}}>
            <div style={{}}>
                <Button sx={{width: '100%'}} onClick={() => {
                    dispatch(saveNoteId(row.noteId))
                    // navigate('/NoteEdit')
                    navigate('/NoteDetail')
                }}>
                <span style={{color: theme.palette.primary.main}}>
                    {row?.title ? row.title : 'no title'}
                </span>
                </Button>
                {row && row.tagList && row.tagList.length > 0 ?
                    <div style={{display: "flex", justifyContent: "center", padding: 5}}>
                        <Stack direction='row' spacing={1}>
                            {
                                row.tagList.map((item: any, index: any) => (
                                    <Chip size='small'
                                          label={item.tagName} key={index}/>
                                ))
                            }
                        </Stack>
                    </div>
                    :
                    null
                }
            </div>

        </Paper>
    )
}
export default NoteRow1
