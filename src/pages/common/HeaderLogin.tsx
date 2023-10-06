import TitleBox1 from "./TitleBox1";
import {Box, Stack} from "@mui/material";
import DonateBar from "./DonateBar";
import Userbar from "./UserBar";
import Language from "./Language";
import {useSelector} from "react-redux";
import {useTheme} from "@mui/material/styles";

const HeaderLogin = () => {
    const theme = useTheme()
    return (
        <Box sx={{
            background:  theme.palette.background.default,
            padding: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <TitleBox1/>
            <Stack direction='row' spacing={4}>
                <Language/>
            </Stack>
        </Box>
    )
}
export default HeaderLogin
