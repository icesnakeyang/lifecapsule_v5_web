import {Button, Grid, Hidden, Paper, Stack} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import moment from "moment";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {saveNoteId} from "../../store/noteDataSlice";

const NoteRowDashboard = (data: any) => {
    const row = data.data
    const theme = useTheme()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    return (
        <Paper sx={{
            margin: 1,
            padding: 1,
            background: theme.palette.background.default,
            // background: theme.palette.secondary.main,
            // background: 'red',
            // color: theme.palette.primary.main
            color: theme.palette.primary.main,
            borderBottom: '1px solid',
            borderColor: theme.palette.primary.main
        }}>
            <Grid container spacing={1} style={{}}>
                <Hidden mdDown>
                    <Grid item md={2}
                          style={{display: 'flex', alignItems: 'center', justifyContent: 'right'}}>
                    <span style={{textAlign: 'left'}}>
                    {moment(row.createTime).format('ll')}
                        </span>
                    </Grid>
                </Hidden>
                <Grid item xs={12} sm={12} md={10} style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                }}>
                    <Button
                        onClick={() => {
                        console.log(row.noteId)
                        dispatch(saveNoteId(row.noteId))
                        navigate('/NoteEdit')
                    }}
                            style={{width:'100%'}}
                    >
                        <span style={{
                            color: theme.palette.primary.main,
                            textAlign: 'left'
                        }}>
                        {row.title}
                            </span>
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    )
}
export default NoteRowDashboard
