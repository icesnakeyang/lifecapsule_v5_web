import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {Button, Card, CardContent, CardHeader, Chip, Grid, Paper} from "@mui/material";
import moment from "moment";
import {useNavigate} from "react-router-dom";
import {useTheme} from "@mui/material/styles";

const TriggerRow = (data: any) => {
    const {item} = data
    const {t} = useTranslation()
    const navigate = useNavigate()
    const theme = useTheme()
    return (
        <Card style={{
            padding: 0,
            marginTop: 10,
            background: theme.palette.background.default,
            border: '1px solid',
            borderColor: theme.palette.primary.main
        }}>
            <CardHeader
                style={{padding: 0}}
                title={
                    <Button size='small' style={{fontSize:16}} onClick={() => {
                        navigate('/MyTriggerEdit', {state: {triggerId: item.triggerId}})
                    }}>
                        {item.title}
                    </Button>
                }
            />
            <CardContent style={{padding: 10}}>
                <Grid container rowSpacing={1}>
                    <Grid item xs={6} sm={6} md={4} lg={3} xl={3}
                          style={{}}>{t('MyNoteSend.toName')}: {item.toName}</Grid>
                    <Grid item xs={6} sm={6} md={4} lg={3} xl={3}
                          style={{}}>{t('MyNoteSend.toEmail')}: {item.toEmail}</Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={3}
                          style={{}}>{t('Trigger.triggerType')}:
                        <Chip size='small' label={t('Trigger.' + item.triggerType)}/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={3}
                          style={{}}>{t('Trigger.sendTime')}: {moment(item.triggerTime).format('ll')}</Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={3}
                          style={{}}>
                        {t('triggerQue.status')}:<Chip label={t('triggerQue.' + item.status)}/>
                    </Grid>
                    <Grid item xs={24} sm={6} md={4} lg={3} xl={3}
                          style={{}}>{t('triggerQue.isEmailSentAlready')} {item.toEmailStatus ? t('triggerQue.sendAlready') : t('triggerQue.notSend')}</Grid>
                    <Grid item xs={24} sm={12} md={12} lg={6} xl={6}
                          style={{}}>{t('triggerQue.isTheNoteSentYet')} {item.toUserStatus === 'SEND_COMPLETE' ? t('triggerQue.sendAlready') : t("triggerQue.notSend")}</Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}
export default TriggerRow
