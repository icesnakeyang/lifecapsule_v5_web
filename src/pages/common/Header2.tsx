import {Grid, Hidden, IconButton, Paper} from "@mui/material";
import BookIcon from '@mui/icons-material/Book';
import {useNavigate} from "react-router-dom";
import EmailIcon from '@mui/icons-material/Email';
import {useTranslation} from "react-i18next";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import {useTheme} from "@mui/material/styles";
import LockPersonIcon from '@mui/icons-material/LockPerson';
import AirlineSeatIndividualSuiteIcon from '@mui/icons-material/AirlineSeatIndividualSuite';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ScheduleSendIcon from '@mui/icons-material/ScheduleSend';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import TheatersIcon from '@mui/icons-material/Theaters';
const Header2 = () => {
    const navigate = useNavigate()
    const {t} = useTranslation()
    const theme = useTheme()
    return (
        <Grid container rowSpacing={1} columnSpacing={1} style={{
            // display: 'flex', justifyContent: 'center'
        }}>
            {/*myNote*/}
            <Hidden mdUp>
                <Grid item xs={2} sm={2}
                      style={{display: 'flex', justifyContent: 'center'}}>
                    <IconButton onClick={() => {
                        navigate('/NoteList')
                    }}>
                        <BookIcon fontSize='large' color='primary'/>
                    </IconButton>
                </Grid>
            </Hidden>
            <Hidden mdDown>
                <Grid item md={3} lg={1} xl={1}
                      style={{display: 'flex', justifyContent: 'center'}}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: "column"
                    }}>
                        <IconButton onClick={() => {
                            navigate('/NoteList')
                        }}>
                            <BookIcon color='primary' fontSize='large'/>
                        </IconButton>
                        <div style={{color: theme.palette.primary.main, fontSize: 14}}>{t('nav.myNote')}</div>
                    </div>
                </Grid>
            </Hidden>

            {/*myInbox*/}
            <Hidden mdUp>
                <Grid item xs={2} sm={2} style={{display: 'flex', justifyContent: 'center'}}>
                    <IconButton onClick={() => {
                        navigate('/MyReceiveNoteList')
                    }}>
                        <EmailIcon fontSize='large' color='primary'/>
                    </IconButton>
                </Grid>
            </Hidden>
            <Hidden mdDown>
                <Grid item md={3} lg={1} xl={1}
                      style={{display: 'flex', justifyContent: 'center'}}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: "column"
                    }}>
                        <IconButton onClick={() => {
                            navigate('/MyReceiveNoteList')
                        }}>
                            <EmailIcon color='primary' fontSize='large'/>
                        </IconButton>
                        <div style={{color: theme.palette.primary.main, fontSize: 14}}>{t('nav.inbox')}</div>
                    </div>
                </Grid>
            </Hidden>

            {/*todolist*/}
            <Hidden mdUp>
                <Grid item xs={2} sm={2} style={{display: 'flex', justifyContent: 'center'}}>
                    <IconButton onClick={() => {
                        navigate('/TodoPage')
                    }}>
                        <AssignmentTurnedInIcon fontSize='large' color='primary'/>
                    </IconButton>
                </Grid>
            </Hidden>
            <Hidden mdDown>
                <Grid item md={3} lg={1} xl={1}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: "column"
                    }}>
                        <IconButton onClick={() => {
                            navigate('/TodoPage')
                        }}>
                            <AssignmentTurnedInIcon color='primary' fontSize='large'/>
                        </IconButton>
                        <div style={{color: theme.palette.primary.main, fontSize: 14}}>{t('nav.taskTodo')}</div>
                    </div>
                </Grid>
            </Hidden>

            {/*private note*/}
            <Hidden mdUp>
                <Grid item xs={2} sm={2} style={{display: 'flex', justifyContent: 'center'}}>
                    <IconButton onClick={() => {
                        navigate('/NoteList')
                    }}>
                        <LockPersonIcon fontSize='large' color='primary'/>
                    </IconButton>
                </Grid>
            </Hidden>
            <Hidden mdDown>
                <Grid item md={3} lg={1} xl={1}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: "column"
                    }}>
                        <IconButton onClick={() => {
                            navigate('/NoteList')
                        }}>
                            <LockPersonIcon color='primary' fontSize='large'/>
                        </IconButton>
                        <div style={{color: theme.palette.primary.main, fontSize: 14}}>{t('nav.privateDiary')}</div>
                    </div>
                </Grid>
            </Hidden>

            {/*last words*/}
            <Hidden mdUp>
                <Grid item xs={2} sm={2} style={{display: 'flex', justifyContent: 'center'}}>
                    <IconButton onClick={() => {
                        navigate('/NoteList')
                    }}>
                        <AirlineSeatIndividualSuiteIcon fontSize='large' color='primary'/>
                    </IconButton>
                </Grid>
            </Hidden>
            <Hidden mdDown>
                <Grid item md={3} lg={1} xl={1}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: "column"
                    }}>
                        <IconButton onClick={() => {
                            navigate('/NoteList')
                        }}>
                            <AirlineSeatIndividualSuiteIcon color='primary' fontSize='large'/>
                        </IconButton>
                        <div style={{color: theme.palette.primary.main, fontSize: 14}}>{t('nav.lastWords')}</div>
                    </div>
                </Grid>
            </Hidden>

            {/*love letter*/}
            <Hidden mdUp>
                <Grid item xs={2} sm={2} style={{display: 'flex', justifyContent: 'center'}}>
                    <IconButton onClick={() => {
                        navigate('/LoveLetterNew')
                    }}>
                        <FavoriteIcon fontSize='large' color='primary'/>
                    </IconButton>
                </Grid>
            </Hidden>
            <Hidden mdDown>
                <Grid item md={3} lg={1} xl={1}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: "column"
                    }}>
                        <IconButton onClick={() => {
                            navigate('/LoveLetterNew')
                        }}>
                            <FavoriteIcon color='primary' fontSize='large'/>
                        </IconButton>
                        <div style={{color: theme.palette.primary.main, fontSize: 14}}>{t('nav.loveLetter')}</div>
                    </div>
                </Grid>
            </Hidden>

            {/*to future*/}
            <Hidden mdUp>
                <Grid item xs={2} sm={2} style={{display: 'flex', justifyContent: 'center'}}>
                    <IconButton onClick={() => {
                        navigate('/NoteList')
                    }}>
                        <ScheduleSendIcon fontSize='large' color='primary'/>
                    </IconButton>
                </Grid>
            </Hidden>
            <Hidden mdDown>
                <Grid item md={3} lg={1} xl={1}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: "column"
                    }}>
                        <IconButton onClick={() => {
                            navigate('/NoteList')
                        }}>
                            <ScheduleSendIcon color='primary' fontSize='large'/>
                        </IconButton>
                        <div style={{color: theme.palette.primary.main, fontSize: 14}}>{t('nav.toFuture')}</div>
                    </div>
                </Grid>
            </Hidden>

            {/*inpiration*/}
            <Hidden mdUp>
                <Grid item xs={2} sm={2}
                      style={{display: 'flex', justifyContent: 'center'}}>
                    <IconButton onClick={() => {
                        navigate('/NoteList')
                    }}>
                        <PsychologyAltIcon fontSize='large' color='primary'/>
                    </IconButton>
                </Grid>
            </Hidden>
            <Hidden mdDown>
                <Grid item md={3} lg={1} xl={1}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: "column"
                    }}>
                        <IconButton onClick={() => {
                            navigate('/NoteList')
                        }}>
                            <PsychologyAltIcon color='primary' fontSize='large'/>
                        </IconButton>
                        <div style={{color: theme.palette.primary.main, fontSize: 14}}>{t('nav.Inspiration')}</div>
                    </div>
                </Grid>
            </Hidden>

            {/*my memory*/}
            <Hidden mdUp>
                <Grid item xs={2} sm={2}
                      style={{display: 'flex', justifyContent: 'center'}}>
                    <IconButton onClick={() => {
                        navigate('/MyHistoryHome')
                    }}>
                        <PsychologyAltIcon fontSize='large' color='primary'/>
                    </IconButton>
                </Grid>
            </Hidden>
            <Hidden mdDown>
                <Grid item md={3} lg={1} xl={1}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: "column"
                    }}>
                        <IconButton onClick={() => {
                            navigate('/MyHistoryHome')
                        }}>
                            <TheatersIcon color='primary' fontSize='large'/>
                        </IconButton>
                        <div style={{color: theme.palette.primary.main, fontSize: 14}}>{t('nav.myHistory')}</div>
                    </div>
                </Grid>
            </Hidden>
        </Grid>
    )
}
export default Header2
