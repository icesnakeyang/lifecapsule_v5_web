import {Button, Card, CardContent, Chip, Grid, IconButton, Paper, Stack} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useTheme} from "@mui/material/styles";
import BorderColorIcon from "@mui/icons-material/BorderColor";

const TriggerListBoxRow = ({data}: { data: { item: any, onDetail: (triggerId:string) => void } }) => {
    const item = data.item
    console.log(item)
    const {t} = useTranslation()
    const theme = useTheme()
    return (
        <Card style={{
            border: '1px solid', borderColor: theme.palette.primary.main,
            background: theme.palette.background.default
        }}>
            <CardContent>
                <Grid container rowSpacing={1} alignItems='center'>
                    <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                        <IconButton onClick={() => {
                            data.onDetail(item.triggerId)
                        }}>
                            <BorderColorIcon style={{color: theme.palette.primary.main}}/>
                        </IconButton>
                    </Grid>
                    <Grid item xs={5} sm={5} md={4} lg={4} xl={4}>
                        {t('loveLetter.trigger.to')}: {item.toName}
                    </Grid>
                    <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                        {t('loveLetter.trigger.triggerType')}: {t(`Trigger.${item.triggerType}`)}
                    </Grid>
                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                        <Stack direction='row' spacing={1} alignItems='center'>
                            {item.toEmailStatus === 'SEND_COMPLETE' ?
                                <Chip size='small' label={t('loveLetter.trigger.emailComplete')}/>
                                :
                                <Chip size='small' label={t('loveLetter.trigger.emailNotSent')}/>
                            }
                            {
                                item.toUserStatus === 'SEND_COMPLETE' ?
                                    <Chip size='small' label={t('loveLetter.trigger.messageComplete')}/>
                                    :
                                    <Chip size='small' label={t('loveLetter.trigger.messageNotSent')}/>
                            }
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}
export default TriggerListBoxRow
