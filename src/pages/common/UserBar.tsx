import {Hidden, IconButton, Menu, MenuItem} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import {useDispatch, useSelector} from "react-redux";
import {useTheme} from "@mui/material/styles";
import {useTranslation} from "react-i18next";
import i18n from "../../i18n";
import {saveLanguage} from "../../store/commonSlice";
import React, {useState} from "react";
import {clearLoginData} from "../../store/loginSlice";
import {useNavigate} from "react-router-dom";

const UserBar = () => {
    const theme = useTheme().palette.primary
    const nickname = useSelector((state: any) => state.loginSlice.nickname)
    const {t} = useTranslation()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const token = localStorage.getItem("lifecapsule_token")
    return (
        <div>
            <IconButton onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                setAnchorEl(event.currentTarget);
            }}>
                <PersonIcon
                    sx={{fontSize: 24, color: theme.main}}/>
                <span style={{
                    fontSize: 20,
                    color: theme.main,
                }}>
                    <Hidden mdDown>
                        <span style={{fontSize:16}}>
                       {nickname ? nickname : t('common.guest')}
                        </span>
                    </Hidden>
                </span>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => {
                    setAnchorEl(null);
                }}
                MenuListProps={{
                    // 'aria-labelledby': 'basic-button',
                }}
            >
                {token ? (
                        [
                            <MenuItem key='1' onClick={() => {
                                navigate('/MyProfile')
                            }}>{t('nav.myProfile')}</MenuItem>,
                            <MenuItem key='2' onClick={() => {
                                dispatch(clearLoginData())
                                localStorage.removeItem("lifecapsule_token")
                                setAnchorEl(null);
                                navigate('/LoginPage')
                            }}>{t('nav.signOut')}</MenuItem>
                        ]
                    )
                    :
                    (
                        <MenuItem onClick={() => {
                            navigate('/LoginPage')
                        }}>{t('nav.signIn')}</MenuItem>
                    )
                }
            </Menu>
        </div>
    )
}
export default UserBar
