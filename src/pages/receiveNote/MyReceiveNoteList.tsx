import {apiListMyNoteReceiveLog} from "../../api/Api";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {
    saveReceiveNoteList,
    saveReceivePageIndex,
    saveTotalReceiveNote,
    saveTotalReceiveNoteUnread
} from "../../store/noteSendSlice";
import {Breadcrumbs, Button, CircularProgress} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Header1 from "../common/Header1";
import MyReceiveNoteRow from "./MyReceiveNoteRow";
import {Pagination} from "@mui/lab";
import {useTheme} from "@mui/material/styles";

const MyReceiveNoteList = () => {
    const receiveNoteList = useSelector(
        (state: any) => state.noteSendSlice.receiveNoteList
    );
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const {t} = useTranslation();
    const theme = useTheme()
    const totalReceiveNote = useSelector(
        (state: any) => state.noteSendSlice.totalReceiveNote
    );
    const totalReceiveNoteUnread = useSelector(
        (state: any) => state.noteSendSlice.totalReceiveNoteUnread
    );
    const receivePageIndex = useSelector(
        (state: any) => state.noteSendSlice.receivePageIndex || 1
    );
    const receivePageSize = useSelector(
        (state: any) => state.noteSendSlice.receivePageSize || 10
    );
    const navigate = useNavigate()
    const [totalPage, setTotalPage] = useState(1)

    useEffect(() => {
        dispatch(saveReceivePageIndex(1))
    }, [])

    useEffect(() => {
        loadAllData();
    }, [receivePageIndex, receivePageSize]);
    const loadAllData = () => {
        let params = {
            pageIndex: receivePageIndex,
            pageSize: receivePageSize,
        }
        apiListMyNoteReceiveLog(params).then((res: any) => {
            if (res.code === 0) {
                dispatch(saveReceiveNoteList(res.data.receiveNoteList));
                dispatch(saveTotalReceiveNote(res.data.totalReceiveNote));
                dispatch(saveTotalReceiveNoteUnread(res.data.totalReceiveNoteUnread));
                let total = res.data.totalReceiveNote
                let pages = Math.ceil(total / receivePageSize)
                setTotalPage(pages)
                setLoading(false);
            }
        })
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
                            navigate(-1)
                        }}>{t('nav.back')}</Button>
                        <Button onClick={() => {
                            navigate('/NoteSendList')
                        }}>
                            {t('nav.mySendNote')}
                        </Button>
                        <span>{t('nav.myReceiveNote')}</span>
                    </Breadcrumbs>

                    {loading ? (
                        <div style={{textAlign: 'center', marginTop: 200}}>
                            <CircularProgress/>
                        </div>
                    ) : (
                        <div style={{width: "100%"}}>
                            {receiveNoteList.length > 0 ? (
                                <div style={{marginTop: 20}}>
                                    {receiveNoteList.map((item: any, index: any) => (
                                        <MyReceiveNoteRow item={item} key={index}/>
                                    ))}
                                    <Pagination style={{marginTop: 10}} count={totalPage}
                                                onChange={(e, page) => {
                                                    dispatch(saveReceivePageIndex(page))
                                                    {/*        dispatch(saveReceivePageSize(pz));*/
                                                    }
                                                }}
                                    />
                                </div>
                            ) : (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        marginTop: 200,
                                        color: theme.palette.primary.main,
                                        fontSize: 20,
                                    }}
                                >
                                    {t("common.noData")}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default MyReceiveNoteList
