import {Card, CardContent, CardHeader, TextField} from "@mui/material";
import React from "react";
import {useTheme} from "@mui/material/styles";
import {useTranslation} from "react-i18next";

interface CardLongGoalProps {
    longGoal: string
    onChangeLongGoal: (value: string) => void
}

const CardLongGoal: React.FC<CardLongGoalProps> = ({longGoal, onChangeLongGoal}) => {
    const theme = useTheme()
    const {t} = useTranslation()
    return (
        <Card style={{
            background: theme.palette.background.default,
            border: '1px solid',
            borderColor: theme.palette.primary.main
        }}>
            <CardHeader title={t('AntiProcrastination.longGoal')}/>
            <CardContent>
                <TextField
                    style={{width: '100%'}}
                    multiline
                    value={longGoal}
                    onChange={e => {
                        onChangeLongGoal(e.target.value)
                    }}
                />
                <div style={{marginTop: 10}}>{t('AntiProcrastination.tipLongGoal1')}</div>
                <div style={{}}>{t('AntiProcrastination.tipLongGoal2')}</div>
                <div style={{}}>{t('AntiProcrastination.tipLongGoal3')}</div>
                <div style={{}}>{t('AntiProcrastination.tipLongGoal4')}</div>
            </CardContent>
        </Card>
    )
}
export default CardLongGoal
