import {Badge, Button, Grid, Hidden, Paper} from "@mui/material";
import moment from "moment/moment";
import {saveNoteId} from "../../store/noteDataSlice";
import {useTheme} from "@mui/material/styles";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {saveSendLogId} from "../../store/noteReceiveSlice";
import FiberNewIcon from '@mui/icons-material/FiberNew';

const ReceiveNoteRowDashboard = (data: any) => {
    const row = data.data
    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
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
                    {moment(row.sendTime).format('ll')}
                        </span>
                    </Grid>
                    <Grid item md={2}>
                        {row.sendUserNickname}
                    </Grid>
                </Hidden>
                <Grid item xs={12} sm={12} md={8} style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                }}>
                    <Button
                        onClick={() => {
                            console.log(row.sendLogId)
                            dispatch(saveSendLogId(row.sendLogId))
                            navigate('/MyReceiveNoteDetail')
                        }}
                        style={{width: '100%'}}
                    >
                        <div style={{display: 'flex'}}>
                            {
                                row.readTime ?
                                    null :
                                    <FiberNewIcon/>
                            }

                            <span style={{
                                color: theme.palette.primary.main,
                                textAlign: 'left'
                            }}>{row.title}</span>
                        </div>
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    )
}
export default ReceiveNoteRowDashboard
