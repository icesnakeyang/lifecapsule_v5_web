import PersonIcon from "@mui/icons-material/Person";
import CoffeeIcon from '@mui/icons-material/Coffee';
import {Hidden, IconButton} from "@mui/material";
import {useSelector} from "react-redux";
import {useTheme} from "@mui/material/styles";
import {useTranslation} from "react-i18next";
import {apiUserClickDonate} from "../../api/Api";

const DonateBar = () => {
    const theme = useTheme().palette.primary
    const {t} = useTranslation()

    const onDonateLink = () => {
        apiUserClickDonate()
        window.open('https://www.buymeacoffee.com/cdtime117d', '_blank')
    }
    return (
        <IconButton onClick={() => {
            onDonateLink()
        }}>
            <CoffeeIcon
                sx={{fontSize: 24, color: theme.main}}/>
            <span style={{
                fontSize: 20,
                color: theme.main,
            }}>
                <Hidden mdDown>
                    <span style={{fontSize:16}}>
                    {t('nav.donate')}
                        </span>
                </Hidden>
            </span>
        </IconButton>
    )
}
export default DonateBar
