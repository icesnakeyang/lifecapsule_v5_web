import {Card, CardContent, CardHeader, TextField} from "@mui/material";
import React, {FC} from "react";
import {useTheme} from "@mui/material/styles";
import {useTranslation} from "react-i18next";

interface CardHappyMomentProps {
    happyYesterday: string
    onChangeHappyYesterday: (value: string) => void
}

const CardHappyMoment: React.FC<CardHappyMomentProps> = ({happyYesterday, onChangeHappyYesterday}) => {
    const theme = useTheme()
    const {t} = useTranslation()
    return (
        <Card style={{
            background: theme.palette.background.default,
            border: '1px solid',
            borderColor: theme.palette.primary.main
        }}>
            <CardHeader title={t('AntiProcrastination.yesterday')}/>
            <CardContent>
                <TextField
                    style={{width: '100%'}}
                    multiline
                    value={happyYesterday}
                    onChange={e => {
                        onChangeHappyYesterday(e.target.value)
                    }}
                />
                <div style={{marginTop: 10}}>{t('AntiProcrastination.tipYesterday')}</div>
            </CardContent>
        </Card>
    )
}
export default CardHappyMoment
