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
        <Card style={{marginTop: 5, background: theme.palette.primary.dark}}>
            <CardHeader title={item.contactName}
                        style={{color: theme.palette.primary.light}}
                        action={
                            <Button variant='contained' size='small' onClick={() => {
                                let data = {
                                    contactName: item.contactName,
                                    email: item.email
                                }
                                dispatch(saveSendToName(item.contactName))
                                dispatch(saveSendToEmail(item.email))
                                onSelect(data)
                                // 这里要调用父组件的onOk方法
                            }}>{t('common.btSelect')}</Button>
                        }
            >
            </CardHeader>
            <CardContent>
                <span style={{color: theme.palette.primary.contrastText}}>
                {item.email}
                    </span>
            </CardContent>
        </Card>
    )
}
export default SendContactRow
