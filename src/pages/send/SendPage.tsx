import {Box, Breadcrumbs, Button, Grid, Paper} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import Header1 from "../common/Header1";

const SendPage = () => {
    const theme = useTheme()
    const navigate = useNavigate()
    const {t} = useTranslation()

    return (
        <div>
            <Header1/>
            <div style={{display: 'flex', justifyContent: 'center', padding: 10}}>
                <div style={{width: '100%', maxWidth: 1080}}>
                    <Breadcrumbs style={{marginTop: 60}}>
                        <Button onClick={() => {
                            navigate('/Dashboard1')
                        }}>
                            {t("common.home")}
                        </Button>
                        <Button onClick={() => {
                            navigate(-1)
                        }}>
                            {t("nav.back")}
                        </Button>
                    </Breadcrumbs>

                    <Box sx={{display: 'flex', justifyContent: 'center', padding: 0}}>
                        <Box sx={{
                            display: 'flex',
                            maxWidth: 1080,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Grid style={{
                                display: 'flex',
                                justifyContent: 'center',
                                padding: 10,
                                marginTop: 0
                            }}
                                  container rowSpacing={2} columnSpacing={{xs: 0, sm: 2, md: 2}}>
                                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}
                                      style={{display: 'flex', justifyContent: 'center'}}>
                                    <Paper style={{
                                        minHeight: 140,
                                        background: theme.palette.primary.dark,
                                        maxWidth: 350,
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        <Box style={{margin: 20}}>
                                            <Button variant='contained'
                                                    style={{
                                                        width: '100%',
                                                        // background: theme.palette.warning.main,
                                                        // color: theme.palette.warning.contrastText
                                                    }}
                                                    onClick={() => {
                                                        navigate('/InstantSend')
                                                    }}>
                                                {t('MyNotes.SendPage.sendInstantly')}
                                            </Button>
                                            <Box style={{
                                                margin: 20,
                                                color: theme.palette.primary.light
                                            }}>{t('MyNotes.SendPage.tipSendInstantly')}</Box>
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}
                                      style={{display: 'flex', justifyContent: 'center'}}>
                                    <Paper style={{
                                        minHeight: 140, background: theme.palette.primary.dark,
                                        maxWidth: 350, width: '100%',
                                        display: 'flex', flexDirection: 'column'
                                    }}>
                                        <Box style={{margin: 20}}>
                                            <Button
                                                variant='contained'
                                                style={{
                                                    width: '100%'
                                                }}
                                                onClick={() => {
                                                    navigate('/PrimarySend')
                                                }}>{t('MyNotes.SendPage.primaryCountdown')}</Button>

                                            <Box style={{
                                                marginTop: 10,
                                                color: theme.palette.primary.light
                                            }}>{t('MyNotes.SendPage.tipPrimaryCountdown')}</Box>
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}
                                      style={{display: 'flex', justifyContent: 'center'}}>
                                    <Paper style={{
                                        minHeight: 140, background: theme.palette.primary.dark,
                                        maxWidth: 350, width: '100%',
                                        display: 'flex', flexDirection: 'column'
                                    }}>
                                        <Box style={{margin: 20}}>
                                            <Button
                                                variant='contained'
                                                style={{
                                                    width: '100%'
                                                }}
                                                onClick={() => {
                                                    navigate('/DatetimeSend')
                                                }}>{t('MyNotes.SendPage.sendByDatetime')}</Button>
                                            <Box style={{
                                                marginTop: 10,
                                                color: theme.palette.primary.light
                                            }}>{t('MyNotes.SendPage.tipSendByDatetime')}</Box>
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}
                                      style={{display: 'flex', justifyContent: 'center'}}>
                                    <Paper style={{
                                        minHeight: 140, background: theme.palette.primary.dark,
                                        maxWidth: 350, width: '100%',
                                        display: 'flex', flexDirection: 'column'
                                    }}>
                                        <Box style={{margin: 20}}>
                                            <Button
                                                variant='contained'
                                                style={{
                                                    width: '100%'
                                                }}
                                                onClick={() => {
                                                    navigate('/PublishToTopic')
                                                }}>{t('MyNotes.SendPage.publishToTopic')}</Button>
                                            <Box style={{
                                                marginTop: 10,
                                                color: theme.palette.primary.light
                                            }}>{t('MyNotes.SendPage.tipPublishToTopic')}</Box>
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}
                                      style={{display: 'flex', justifyContent: 'center'}}>
                                    <Paper style={{
                                        minHeight: 140, background:
                                        theme.palette.primary.dark,
                                        maxWidth: 350, width: '100%',
                                        display: 'flex', flexDirection: 'column'
                                    }}>
                                        <Box style={{margin: 20}}>
                                            <Button
                                                variant='contained'
                                                style={{
                                                    width: '100%'
                                                }}
                                                onClick={() => {
                                                    navigate('/PublishToMotto')
                                                }}>{t('MyNotes.SendPage.publishToMotto')}</Button>
                                            <Box style={{
                                                marginTop: 10,
                                                color: theme.palette.primary.light
                                            }}>{t('MyNotes.SendPage.tipPublishToMotto')}</Box>
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}
                                      style={{display: 'flex', justifyContent: 'center'}}>
                                    <Paper style={{
                                        minHeight: 140, background: theme.palette.primary.dark,
                                        maxWidth: 350, width: '100%',
                                        display: 'flex', flexDirection: 'column'
                                    }}>
                                        <Box style={{margin: 20}}>
                                            <Button
                                                variant='contained'
                                                style={{
                                                    width: '100%'
                                                }}
                                                onClick={() => {
                                                    navigate("/PublishToPublicWeb")
                                                }}>{t('MyNotes.SendPage.publishToPublic')}</Button>
                                            <Box style={{
                                                marginTop: 10,
                                                color: theme.palette.primary.light
                                            }}>{t('MyNotes.SendPage.tipPublishToPublic')}</Box>
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </div>
            </div>
        </div>
    )
}
export default SendPage
