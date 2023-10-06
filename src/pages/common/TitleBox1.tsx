import {Button, Container, Hidden, IconButton, Stack} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useTheme} from "@mui/material/styles";

const TitleBox1 = () => {
    const {t} = useTranslation()
    const navigate = useNavigate()
    const theme = useTheme().palette.primary

    return (
        <Stack direction="row" spacing={2}>
            <div>
                <IconButton onClick={() => {
                    navigate('/')
                }}>
                    <img src='/logo.png' width='36px'/>
                </IconButton>
            </div>

            <Hidden mdDown>
                <div style={{display: "flex", alignItems: 'center'}}>
                    <Button onClick={() => {
                        navigate('/')
                    }}>
                <span style={{
                    fontSize: 26,
                    fontWeight: 'bold',
                    color: theme.main
                }}>{t('common.appTitle')}</span>
                    </Button>
                </div>
            </Hidden>

        </Stack>
    )
}
export default TitleBox1
