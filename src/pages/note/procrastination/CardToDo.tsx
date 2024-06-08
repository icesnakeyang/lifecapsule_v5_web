import {Card, CardContent, CardHeader, TextField} from "@mui/material";
import React from "react";
import {useTheme} from "@mui/material/styles";
import {useTranslation} from "react-i18next";

interface CardToDoProps {
    todayGoal: string
    onChangeTodayGoal: (value: string) => void
}

const CardToDo: React.FC<CardToDoProps> = ({todayGoal, onChangeTodayGoal}) => {
    const theme = useTheme()
    const {t} = useTranslation()

    return (
        <Card style={{
            background: theme.palette.background.default,
            border: '1px solid',
            borderColor: theme.palette.primary.main
        }}>
            <CardHeader title={t('AntiProcrastination.whatToDoToday')}/>
            <CardContent>
                <TextField
                    style={{width: '100%'}}
                    multiline
                    value={todayGoal}
                    onChange={e => {
                        onChangeTodayGoal(e.target.value)
                    }}
                />
                <div style={{marginTop: 10}}>{t('AntiProcrastination.tipTodayGoal')}</div>
            </CardContent>
        </Card>
    )
}
export default CardToDo
