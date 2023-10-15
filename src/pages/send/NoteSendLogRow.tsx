import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {Button, Card, CardContent, CardHeader, Grid} from "@mui/material";
import moment from "moment";
import {useTheme} from "@mui/material/styles";

const NoteSendLogRow = (data: any) => {
    const {item} = data
    const {t} = useTranslation()
    const navigate = useNavigate()
    const theme = useTheme()

    return (
        <Card style={{
            background: theme.palette.background.default,
            marginTop: 10,
            border: '1px solid',
            borderColor: theme.palette.primary.main
        }}>
            <CardContent style={{padding: 5}}>
                <Button size='small' style={{fontSize:16}} onClick={() => {
                    navigate('/MySendNoteDetail', {state: {sendLogId: item.sendLogId}})
                }}>{item.title}</Button>
                <Grid container rowSpacing={1}>
                    <Grid item xs={12} sm={5} md={3} lg={3} xl={3}
                          style={{}}>{t('MyNoteSend.sendTime')}: {moment(item.sendTime).format('ll')}</Grid>
                    <Grid item xs={12} sm={7} md={5} lg={4} xl={4}
                          style={{fontSize: 14}}>{t('MyNoteSend.toName')}: {item.toName}</Grid>
                    <Grid item xs={12} sm={12} md={4} lg={5} xl={5}
                          style={{fontSize: 14}}>{t('MyNoteSend.toEmail')}: {item.toEmail}</Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}
export default NoteSendLogRow
