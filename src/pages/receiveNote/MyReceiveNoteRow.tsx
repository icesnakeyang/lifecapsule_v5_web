import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {Badge, Button, Card, CardContent, CardHeader, Grid, Paper, Stack, Typography} from "@mui/material";
import moment from "moment";
import {useTheme} from "@mui/material/styles";
import {saveSendLogId} from "../../store/noteReceiveSlice";
import FiberNewIcon from '@mui/icons-material/FiberNew';

const MyReceiveNoteRow = (data: any) => {
    const {item} = data;
    const {t} = useTranslation();
    const theme = useTheme()
    const navigate = useNavigate();
    const dispatch = useDispatch()

    // @ts-ignore
    return (
        <Card
            // style={{marginTop: 10, background: theme.palette.background.default}}
            style={{
                marginTop: 10,
                padding: 0,
                background: theme.palette.background.default,
                border: '1px solid',
                borderColor: theme.palette.primary.main
            }}
        >
            <CardContent style={{padding: 10}}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    {item.readTime ?
                        null :
                        <FiberNewIcon
                            style={{color: theme.palette.secondary.main}}/>
                    }
                    <Button size='small' style={{fontSize: 16}} onClick={() => {
                        dispatch(saveSendLogId(item.sendLogId))
                        navigate("/MyReceiveNoteDetail");
                    }}>{item.title}</Button>
                </div>
                <Grid container>
                    <Grid item xs={6} sm={6} md={4} lg={3} xl={2}>
                        <div style={{fontSize: 14}}>
                            {t('common.fromName')}: {item.sendUserNickname}
                        </div>
                    </Grid>
                    <Grid item xs={6} sm={6} md={4} lg={3} xl={2}>
                        <div
                            style={{fontSize: 14}}>
                            {t('MyReceiveNote.MyReceiveNoteDetail.sentTime')}: {moment(item.sendTime).format('ll')}
                        </div>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}
export default MyReceiveNoteRow
