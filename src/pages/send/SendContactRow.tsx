import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {Avatar, Box, Button, Card, CardContent, CardHeader, Grid, IconButton, Paper, Stack} from "@mui/material";
import {saveSendToEmail, saveSendToName, saveSendToUserCode} from "../../store/noteSendSlice";
import {useTheme} from "@mui/material/styles";
import PinIcon from '@mui/icons-material/Pin';
import EmailIcon from '@mui/icons-material/Email';

const SendContactRow = (data: any) => {
    const {t} = useTranslation()
    const {item, onSelect} = data
    const dispatch = useDispatch()
    const theme = useTheme()
    return (
        <Paper style={{
            marginTop: 5,
            background: theme.palette.background.default,
            border: '1px solid',
            borderColor: theme.palette.primary.main
        }}>
            <Button style={{width: '100%'}} onClick={() => {
                let data = {
                    contactName: item.contactName,
                    email: item.email,
                    userCode: item.userCode
                }
                dispatch(saveSendToName(item.contactName))
                dispatch(saveSendToEmail(item.email))
                dispatch(saveSendToUserCode(item.userCode))
                onSelect(data)
            }}>
                <Grid container>
                    <Grid item xs={12} sm={5} md={4} lg={4} xl={4}>
                        <Stack direction='row' spacing={1}>
                            <Avatar sx={{width: 24, height: 24}}/>
                            <div>{item.contactName}</div>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={7} md={5} lg={5} xl={5}>
                        <Stack direction='row' spacing={1}>
                            <EmailIcon/>
                            <div>{item.email}</div>
                        </Stack>

                    </Grid>
                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                        <Stack direction='row' spacing={1}>
                            <PinIcon/>
                            <div>{item.userCode}</div>
                        </Stack>
                    </Grid>
                </Grid>
            </Button>
        </Paper>
    )
}
export default SendContactRow
