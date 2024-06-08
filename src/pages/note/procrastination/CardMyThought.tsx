import {Card, CardActions, CardContent, CardHeader, TextField} from "@mui/material";
import React from "react";
import {useTheme} from "@mui/material/styles";
import {useTranslation} from "react-i18next";

interface CardMyThoughtProps {
    myThought: string
    onChangeMyThought: (value: string) => void
}

const CardMyThought: React.FC<CardMyThoughtProps> = ({myThought, onChangeMyThought}) => {
    const theme = useTheme()
    const {t} = useTranslation()

    return (
        <Card style={{
            background: theme.palette.background.default,
            border: '1px solid',
            borderColor: theme.palette.primary.main
        }}>
            <CardHeader title={t('AntiProcrastination.myThought')}/>
            <CardContent>
                <TextField
                    style={{width: '100%'}}
                    multiline
                    value={myThought}
                    onChange={e => {
                        onChangeMyThought(e.target.value)
                    }}
                />
            </CardContent>
            <CardActions>
                {t('AntiProcrastination.tipMyThought')}
            </CardActions>
        </Card>
    )
}
export default CardMyThought
