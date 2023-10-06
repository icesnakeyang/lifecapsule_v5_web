import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {
    apiListTheme,
    apiLoadMyNoteSendStatistic, apiSaveUserLanguage,
    apiSignInByNothing,
    apiSignToken,
} from "../api/Api";
import {saveLoginData} from "../store/loginSlice";
import {
    saveTotalReceiveNote,
    saveTotalReceiveNoteUnread,
    saveTotalSendNote,
    saveTotalSendNoteUnread,
} from "../store/noteSendSlice";
import i18n from "i18next";
import {saveLanguage, saveThemeMode} from "../store/commonSlice";
import {useTranslation} from "react-i18next";
import {Box, Button, ButtonProps, Container, Grid, IconButton, Paper, styled} from "@mui/material";
import Header1 from "./common/Header1";
import {useTheme} from "@mui/material/styles";
import {blue, green, purple} from "@mui/material/colors";
import Footer1 from "./common/Footer1";

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import {LoginModel} from "../model/LoginModel";

const Home = () => {
        const {t} = useTranslation();
        const navigate = useNavigate();
        const token = localStorage.getItem("lifecapsule_token")
        const dispatch = useDispatch();
        const language = useSelector((state: any) => state.commonSlice.language)
        const lan = i18n.language
        const theme = useTheme()

        /**
         * if not set language, default english
         * else read custom language from server side
         */
        useEffect(() => {
            if (!language) {
                i18n.changeLanguage('en')
                dispatch(saveLanguage("en"))
                apiSaveUserLanguage({language: "en"})
            } else {
                i18n.changeLanguage(language)
                // dispatch(saveLanguage(language))
                // apiSaveUserLanguage({language: language})
            }

        }, [language])

        const onSignIn = () => {
            if (!token) {
                /**
                 * 如果没有token，就注册一个新用户
                 */
                // navigate("/guest/login");
                apiSignInByNothing().then((res: any) => {
                    if (res.code === 0) {
                        dispatch(saveLoginData(res.data));
                        localStorage.setItem("lifecapsule3_token", res.data.token);
                        navigate("/Dashboard1");
                    }
                });
            } else {
                apiSignToken().then((res: any) => {
                    if (res.code === 0) {
                        const data: LoginModel = {
                            token: res.data.user.token,
                            nickname: res.data.user.nickname,
                            userStatus: res.data.user.userStatus,
                            timerPrimary: res.data.timerPrimary,
                            loginName: 'ada'
                        };
                        dispatch(saveLoginData(data));

                        apiLoadMyNoteSendStatistic().then((res: any) => {
                            if (res.code === 0) {
                                dispatch(saveTotalReceiveNote(res.data.totalReceive));
                                dispatch(saveTotalReceiveNoteUnread(res.data.totalReceiveUnread));
                                dispatch(saveTotalSendNote(res.data.totalSend));
                                dispatch(saveTotalSendNoteUnread(res.data.totalSendUnread));
                            }
                        });
                        navigate("/Dashboard1");
                    } else {
                        navigate("/guest/LoginPage")
                    }
                });
            }
        };

        return (
            <Box
                style={{}}
            >
                {/*header*/}
                <Header1/>
                {/*banner*/}
                <div style={{marginTop: 55}}>
                    <div>
                        <img src='/ban10.jpg' width='100%' height='450px'/>
                    </div>
                </div>

                {/*Sign button*/}
                <div style={{textAlign: 'center', marginTop: 20}}>
                    <Button style={{width: 240, height: 60, fontSize: 24}} variant='contained'
                            onClick={() => {
                                onSignIn();
                            }}>Start Now</Button>
                </div>

                {/*private MyNotes, Encrypt Share, deep social*/}
                <div style={{display: 'flex', justifyContent: 'center', marginTop: 30}}>
                    <div style={{maxWidth: 1080}}>
                        <Grid container rowSpacing={1} columnSpacing={1}>
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <div style={{height: '100%', background: '#ff0080',}}>
                                    <div style={{
                                        color: '#fff',
                                        fontSize: 28,

                                        height: 50,
                                        textAlign: "center",
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        display: 'flex'
                                    }}>
                                        {t("webSite.home.privateNote")}
                                    </div>
                                    <div style={{marginTop: 0}}>
                                        {/*<img src='/notebook.jpeg' width='100%'/>*/}
                                        <img src='/notebook1.jpeg' width='100%'/>
                                    </div>
                                    <div style={{margin: 10}}>
                                        <div style={{color: '#fff', fontSize: 14, marginTop: 20, lineHeight: 2}}>
                                            {t("webSite.home.privateNote1")}
                                        </div>
                                        <div style={{color: '#fff', fontSize: 14, marginTop: 20, lineHeight: 2}}>
                                            {t("webSite.home.privateNote2")}
                                        </div>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4}
                                  lg={4} xl={4}>
                                <div style={{height: '100%', background: '#008040',}}>
                                    <div style={{
                                        color: '#fff',
                                        fontSize: 28,

                                        height: 50,
                                        textAlign: "center",
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        display: 'flex'
                                    }}>
                                        {t("webSite.home.encryptedSharing")}
                                    </div>
                                    <div style={{marginTop: 0}}>
                                        <img src='/letter1.jpeg' width='100%'/>
                                    </div>
                                    <div style={{margin: 10}}>
                                        <div style={{color: '#fff', fontSize: 14, marginTop: 20, lineHeight: 2}}>
                                            {t("webSite.home.encryptedSharing1")}
                                        </div>
                                        <div style={{color: '#fff', fontSize: 14, marginTop: 20, lineHeight: 2}}>
                                            {t("webSite.home.encryptedSharing2")}
                                        </div>
                                    </div>
                                </div>
                            </Grid>

                            <Grid item
                                  xs={12} sm={12}
                                  md={4}
                                  lg={4} xl={4}>
                                <div style={{height: '100%', background: '#004080'}}>
                                    <div style={{
                                        color: '#fff',
                                        fontSize: 28,
                                        height: 50,
                                        textAlign: "center",
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        display: 'flex'
                                    }}>
                                        {t("webSite.home.deepMindSocial")}
                                    </div>
                                    <div style={{marginTop: 0}}>
                                        <img src='/talk1.jpeg' width='100%'/>
                                    </div>
                                    <div style={{margin: 10}}>
                                        <div style={{color: '#fff', fontSize: 14, marginTop: 20, lineHeight: 2}}>
                                            {t("webSite.home.deepMindSocial1")}
                                        </div>
                                        <div style={{color: '#fff', fontSize: 14, marginTop: 20, lineHeight: 2}}>
                                            {t("webSite.home.deepMindSocial2")}
                                        </div>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </div>

                {/*What is lifecapsule*/}
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <div style={{padding: 20, marginTop: 80, maxWidth: 1080}}>
                        <div style={{
                            border: '2px solid red',
                            padding: 20,
                            borderRadius: 10
                        }}>
                            <Grid container>
                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6} style={{}}>
                                    <div style={{
                                        fontSize: 28,
                                        fontWeight: 'bold',
                                        color: '#f6027d'
                                    }}>{t('webSite.home.whatIsLifeCapsule')}</div>

                                    <div style={{
                                        fontSize: 14,
                                        lineHeight: 2.0,
                                        marginTop: 10
                                    }}>{t('webSite.home.whatIsLifeCapsule1')}</div>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}
                                      style={{padding: 20}}>
                                    <div style={{height: 300}}>
                                        <img src='/pic4.jpg' width='100%' height='100%' style={{objectFit: 'scale-down'}}/>
                                    </div>
                                </Grid>
                            </Grid>

                            <div>

                            </div>
                        </div>
                        <div style={{border: '2px solid red', padding: 20, borderRadius: 10, marginTop: 20}}>
                            <div style={{
                                fontSize: 28,
                                fontWeight: 'bold',
                                color: '#027d41'
                            }}>{t('webSite.home.whatIsLifeCapsule2')}</div>
                            <div style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                marginTop: 10
                            }}>{t('webSite.home.whatIsLifeCapsule3')}</div>
                            <div style={{fontSize: 14, lineHeight: 2.0}}>{t('webSite.home.whatIsLifeCapsule4')}</div>
                            <div style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                marginTop: 10
                            }}>{t('webSite.home.whatIsLifeCapsule5')}</div>
                            <div style={{fontSize: 14, lineHeight: 2.0}}>{t('webSite.home.whatIsLifeCapsule6')}</div>
                            <div style={{fontSize: 14, lineHeight: 2.0}}>{t('webSite.home.whatIsLifeCapsule7')}</div>

                            <div style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                marginTop: 10
                            }}>{t('webSite.home.whatIsLifeCapsule8')}</div>
                            <div style={{fontSize: 14, lineHeight: 2.0}}>{t('webSite.home.whatIsLifeCapsule9')}</div>

                            <div style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                marginTop: 10
                            }}>{t('webSite.home.whatIsLifeCapsule10')}</div>
                            <div style={{fontSize: 14, lineHeight: 2.0}}>{t('webSite.home.whatIsLifeCapsule11')}</div>

                            <div style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                marginTop: 10
                            }}>{t('webSite.home.whatIsLifeCapsule12')}</div>
                            <div style={{fontSize: 14, lineHeight: 2.0}}>{t('webSite.home.whatIsLifeCapsule13')}</div>
                            <div style={{fontSize: 14, lineHeight: 2.0}}>{t('webSite.home.whatIsLifeCapsule14')}</div>
                            <div style={{fontSize: 14, lineHeight: 2.0}}>{t('webSite.home.whatIsLifeCapsule15')}</div>
                            <div style={{fontSize: 14, lineHeight: 2.0}}>{t('webSite.home.whatIsLifeCapsule16')}</div>
                            <div style={{fontSize: 14, lineHeight: 2.0}}>{t('webSite.home.whatIsLifeCapsule17')}</div>
                            <div style={{fontSize: 14, lineHeight: 2.0}}>{t('webSite.home.whatIsLifeCapsule18')}</div>
                        </div>
                    </div>

                    {/*Sign button*/}
                    <div style={{textAlign: 'center', marginTop: 20}}>
                        <Button style={{width: 240, height: 60, fontSize: 24}} variant='contained'
                                onClick={() => {
                                    onSignIn();
                                }}>Start Now</Button>
                    </div>

                    <div style={{padding:10}}>
                        <div style={{background: 'purple', padding: 20, maxWidth: 1080, borderRadius: 10, marginTop: 60}}>
                            <Grid container>
                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                    <div style={{padding: 20}}>
                                        <div style={{fontSize: 28, fontWeight: 'bold', color: '#fff'}}>
                                            {t('webSite.home.confidentialRules')}
                                        </div>
                                        <div style={{
                                            fontSize: 14,
                                            marginTop: 20,
                                            color: '#fff',
                                            lineHeight: 2
                                        }}>{t('webSite.home.confidentialRules1')}</div>
                                    </div>
                                </Grid>
                                <Grid xs={12} sm={6} md={6} lg={6} xl={6}>
                                    <div style={{height: 300}}>
                                        <img src='/pic5.jpeg' width='100%' height='100%' style={{objectFit: 'cover'}}/>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>

                        <div style={{background: 'green', padding: 20, borderRadius: 10, maxWidth: 1080, marginTop: 40}}>
                            <Grid container>
                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                    <div>
                                        <img src='/pic7.jpeg' width='100%' height='100%' style={{objectFit: 'cover'}}/>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6} style={{padding: 20}}>
                                    <div style={{fontSize: 28, fontWeight: 'bold', color: '#fff'}}>
                                        {t('webSite.home.cloudSynchronization')}
                                    </div>
                                    <div style={{
                                        fontSize: 14,
                                        marginTop: 20,
                                        color: '#fff',
                                        lineHeight: 2
                                    }}>{t('webSite.home.cloudSynchronization1')}</div>
                                </Grid>
                            </Grid>
                        </div>

                        <div style={{background: 'darkblue', padding: 20, borderRadius: 10, maxWidth: 1080, marginTop: 40}}>
                            <Grid container>
                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6} style={{padding: 20}}>
                                    <div style={{fontSize: 28, fontWeight: 'bold', color: '#fff'}}>
                                        {t('webSite.home.crossPlatform')}
                                    </div>
                                    <div style={{
                                        fontSize: 14,
                                        marginTop: 20,
                                        color: '#fff',
                                        lineHeight: 2
                                    }}>{t('webSite.home.crossPlatform1')}</div>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                    <div>
                                        <img src='/pic11.png' width='100%' height='100%' style={{objectFit: 'fill'}}/>
                                        {/*<img src='/pic7.jpeg' width='100%' height='100%' style={{objectFit: 'cover'}}/>*/}
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </div>
                <div style={{marginTop: 50}}></div>
                <Footer1/>
            </Box>
        )
    }
;

export default Home;
