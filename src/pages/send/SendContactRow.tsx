import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {Box, Button, Card, CardContent, CardHeader, Grid, IconButton, Paper, Stack} from "@mui/material";
import {saveSendToEmail, saveSendToName} from "../../store/noteSendSlice";
import {useTheme} from "@mui/material/styles";

const SendContactRow = (data: any) => {
    const {t} = useTranslation()
    const {item, onSelect} = data
    const dispatch = useDispatch()
    const theme = useTheme()
    return (
        <Card style={{
            marginTop: 5,
            background: theme.palette.background.default,
            border: '1px solid',
            borderColor: theme.palette.primary.main
        }}>
            <CardContent style={{padding:10}}>
                <Grid container rowSpacing={1} alignItems='center'>
                    <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                        <Button onClick={()=>{
                            let data = {
                                contactName: item.contactName,
                                email: item.email
                            }
                            dispatch(saveSendToName(item.contactName))
                            dispatch(saveSendToEmail(item.email))
                            onSelect(data)
                        }}>{item.contactName}</Button>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                        {item.email}
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}
export default SendContactRow
