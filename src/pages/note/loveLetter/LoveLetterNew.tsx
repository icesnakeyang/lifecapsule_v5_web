import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useTheme} from "@mui/material/styles";
import Header1 from "../../common/Header1";
import {Breadcrumbs, Button, Card, CardContent, CardHeader, CircularProgress, TextField} from "@mui/material";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DemoContainer} from "@mui/x-date-pickers/internals/demo";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import dayjs, {Dayjs} from "dayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {useState} from "react";

const LoveLetterNew = () => {
    const {t} = useTranslation()
    const navigate = useNavigate()
    const theme = useTheme()
    const [sendTime, setSendTime] = useState<Dayjs | null>(dayjs('2022-04-17T15:30'));
    const [saving, setSaving] = useState(false)

    const onCreateLoveLetter = () => {
        let params = {
            sendTime
        }
        setSaving(true)
        console.log(params)
        setTimeout(() => {
            setSaving(false)
        }, 2000)

    }

    return (
        <div>
            <Header1/>
            <div style={{display: 'flex', justifyContent: 'center', padding: 10}}>
                <div style={{width: '100%', maxWidth: 1080}}>
                    <Breadcrumbs style={{marginTop: 60}}>
                        <Button onClick={() => {
                            navigate('/Dashboard1')
                        }}>{t('nav.home')}</Button>
                        <Button onClick={() => {
                            navigate('/LoveLetterList')
                        }}>{t('nav.loveLetter')}</Button>
                        <Button onClick={() => {
                            navigate(-1)
                        }}>{t('nav.back')}</Button>
                    </Breadcrumbs>

                    <Card style={{marginTop: 10}}>
                        <CardContent>
                            <TextField/>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DateTimePicker']}>
                                    <DateTimePicker
                                        ampm={false}
                                        label={t('MyNotes.SendPage.DatetimeSend.sendTime')}
                                        onAccept={e => {
                                            // const selectedDate=e as Date
                                            const selectedDate = dayjs(e as Date)
                                            console.log(selectedDate)
                                            // console.log(e.value())
                                            setSendTime(selectedDate)
                                        }}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </CardContent>
                    </Card>
                    <div style={{textAlign: 'center', marginTop: 20}}>
                        {saving ?
                            <CircularProgress/>
                            :
                            <Button variant='contained' onClick={() => {
                                onCreateLoveLetter()
                            }}>Create</Button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
export default LoveLetterNew
