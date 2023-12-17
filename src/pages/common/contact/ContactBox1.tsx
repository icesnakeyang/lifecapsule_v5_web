import {
    Alert,
    AlertColor,
    Button,
    Card,
    CardContent,
    CardHeader,
    CircularProgress, Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    InputBase, Paper, Snackbar, Stack
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {saveSendToEmail, saveSendToName, saveSendToUserCode} from "../../../store/noteSendSlice";
import SendContactRow from "../../send/SendContactRow";
import {Pagination} from "@mui/lab";
import {useTheme} from "@mui/material/styles";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import {apiListMyContact} from "../../../api/Api";
import {useDispatch} from "react-redux";

const ContactBox3 = (data: any) => {
    const modalToUser = data.modalToUser
    const theme = useTheme()
    const {t} = useTranslation()
    const {setModalToUser, onSearchToUser} = data
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [contactList, setContactList] = useState([])
    const [totalContact, setTotalContact] = useState(0)
    const [msg, setMsg] = useState("")
    const [msgType, setMsgType] = useState<AlertColor>('success')
    const [showMsg, setShowMsg] = useState(false)
    const [searching, setSearching] = useState(false)
    const [searchResultUserId, setSearchResultUserId] = useState('')
    const dispatch = useDispatch()
    const [searchResultUserNickname, setSearchResultUserNickname] = useState('')
    const [searchResultUserUserCode, setSearchResultUserUserCode] = useState('')
    const [searchUserKey, setSearchUserKey] = useState('')
    const [searchResultUserUserEmail, setSearchResultUserUserEmail] = useState('')

    const loadContact = () => {
        let params = {
            pageIndex,
            pageSize
        }
        apiListMyContact(params).then((res: any) => {
            if (res.code === 0) {
                setContactList(res.data.contactList)
                let total = res.data.totalContact
                total = Math.ceil(total / pageSize)
                setTotalContact(total)
            } else {
                setMsg(t('syserr.' + res.code))
                setMsgType('error')
                setShowMsg(true)
            }
        }).catch(() => {
            setMsg(t('syserr.10001'))
            setMsgType('error')
            setShowMsg(true)
        })
    }

    const onSelectContact = () => {
        setModalToUser(false)
    }

    return (
        <div>
            <Dialog open={true}
                    fullWidth
            >
                <DialogTitle style={{background: theme.palette.background.default}}>
                    {t('MyNotes.SendPage.SearchUser.title')}
                    <IconButton
                        aria-label="close"
                        onClick={() => {
                            setModalToUser(false)
                        }}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent style={{background: theme.palette.background.default}}>
                    <div style={{height: 500, marginTop: 20}}>
                        <Card style={{
                            background: theme.palette.background.default,
                            border: '1px solid',
                            borderColor: theme.palette.primary.main
                        }}>
                            <CardHeader title='查询联系人'/>
                            <CardContent>
                                <div>
                                    <InputBase style={{
                                        border: '1px solid', padding: 5, borderColor: theme.palette.primary.main,
                                        width: '80%'
                                    }}
                                               placeholder={t('MyNotes.SendPage.SearchUser.searchPlaceholder')}
                                               onChange={e => {
                                                   setSearchUserKey(e.target.value)
                                               }}/>
                                    <IconButton type="button" aria-label="search" onClick={() => {
                                        onSearchToUser()
                                    }}>
                                        <SearchIcon style={{color: theme.palette.primary.main}}/>
                                    </IconButton>
                                </div>
                                <div style={{marginTop: 10, height: 50}}>
                                    {searching ?
                                        <div style={{
                                            display: 'flex',
                                            height: '100%',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <CircularProgress/>
                                        </div>
                                        :
                                        searchResultUserId ?
                                            <Button style={{background: theme.palette.background.default}} size='small'
                                                    onClick={() => {
                                                        dispatch(saveSendToName(searchResultUserNickname))
                                                        console.log(searchResultUserUserEmail)
                                                        if (searchResultUserUserEmail) {
                                                            dispatch(saveSendToEmail(searchResultUserUserEmail))
                                                        } else {
                                                            dispatch(saveSendToEmail(''))
                                                        }
                                                        if (searchResultUserUserCode) {
                                                            dispatch(saveSendToUserCode(searchResultUserUserCode))
                                                        } else {
                                                            dispatch(saveSendToUserCode(''))
                                                        }
                                                        setModalToUser(false)
                                                    }}>
                                                <Paper style={{padding: 10}}>
                                                    <Stack direction='row' spacing={1} alignItems='center'>
                                                        <div>{t('MyNotes.SendPage.SearchUser.nickname')}</div>
                                                        <div>{searchResultUserNickname}</div>
                                                        {searchResultUserUserCode ?
                                                            <>
                                                                <div>{t('MyNotes.SendPage.SearchUser.userCode')}</div>
                                                                <div>{searchResultUserUserCode}</div>
                                                            </>
                                                            :
                                                            null
                                                        }
                                                        {searchResultUserUserEmail ?
                                                            <>
                                                                <div>{t('MyNotes.SendPage.SearchUser.email')}</div>
                                                                <div>{searchResultUserUserEmail}</div>
                                                            </>
                                                            : null}
                                                    </Stack>
                                                </Paper>
                                            </Button>
                                            : null
                                    }
                                </div>
                            </CardContent>
                        </Card>
                        <Card style={{
                            background: theme.palette.background.default,
                            border: '1px solid',
                            borderColor: theme.palette.primary.main,
                            marginTop: 10
                        }}>
                            <CardHeader title='my contac'/>
                            <CardContent>
                                {
                                    contactList.map((item: any, index) => (
                                        <SendContactRow item={item} key={index} onSelect={onSelectContact}/>
                                    ))
                                }
                                <Pagination style={{marginTop: 10}} count={totalContact}
                                            onChange={(e, page) => {
                                                setPageIndex(page)
                                            }}/>
                            </CardContent>
                        </Card>
                    </div>
                </DialogContent>
            </Dialog>

            <Snackbar open={showMsg}
                      autoHideDuration={2000}
                      anchorOrigin={{vertical: "top", horizontal: 'center'}}
                      onClose={() => {
                          setShowMsg(false)
                      }}
            >
                <Alert variant='filled' severity={msgType}>{msg}</Alert>
            </Snackbar>
        </div>
    )
}
export default ContactBox3
