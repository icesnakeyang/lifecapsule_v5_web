import {Box, Grid} from "@mui/material";
import {useLocaleText} from "@mui/x-date-pickers/internals";
import {useTheme} from "@mui/material/styles";

const Footer1 = () => {
    const theme = useTheme()
    return (
        <div style={{
            background: theme.palette.primary.main,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
        }}>
            <Grid container>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={2}>
                    <div style={{textAlign: 'center', height: 40, lineHeight: '40px'}}>
                        <a href="/user_privacy" style={{color: theme.palette.primary.contrastText}}>User Private
                            Policy</a>
                    </div>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={3}>
                    <div style={{
                        textAlign: 'center',
                        height: 40,
                        lineHeight: '40px',
                        color: theme.palette.primary.contrastText
                    }}>
                        Contact us: support@tellmeafter.com
                    </div>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={4}>
                    <div style={{textAlign: 'center', height: 40, lineHeight: '40px'}}>
                        <a href="#" style={{color: theme.palette.primary.contrastText}}>Copyright © GOGOYANG DATATECH
                            LIMIT</a>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}
export default Footer1
