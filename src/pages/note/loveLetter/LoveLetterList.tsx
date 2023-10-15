import {useTheme} from "@mui/material/styles";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import Header1 from "../../common/Header1";
import {Breadcrumbs, Button, Card} from "@mui/material";
import {apiListLoveLetter} from "../../../api/Api";
import LoveLetterRow1 from "./LoveLetterRow1";

const LoveLetterList = () => {
    const theme = useTheme()
    const navigate = useNavigate()
    const {t} = useTranslation()
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [noteList, setNoteList] = useState([])
    const [totalNote, setTotalNote] = useState(0)
    const [totalPage, setTotalPage] = useState(1)

    useEffect(() => {
        loadAllData()
    }, [pageIndex, pageSize])

    const loadAllData = () => {
        let params = {
            pageIndex,
            pageSize
        }
        apiListLoveLetter(params).then((res: any) => {
            if (res.code === 0) {
                setNoteList(res.data.noteList)
            }
        })
    }

    return (
        <div>
            <Header1/>
            <div style={{display: "flex", justifyContent: 'center', padding: 10}}>
                <div style={{width: '100%', maxWidth: 1080}}>
                    <Breadcrumbs style={{marginTop: 60}}>
                        <Button onClick={() => {
                            navigate('/Dashboard1')
                        }}>{t('nav.home')}</Button>
                        <Button onClick={() => {
                            navigate(-1)
                        }}>{t('nav.back')}</Button>
                        <span>{t('loveLetter.title')}</span>
                    </Breadcrumbs>

                    <Card style={{marginTop: 10, padding: 20, background: theme.palette.background.default}}>
                        <Button variant='contained'>{t('loveLetter.btNewLoveLetter')}</Button>
                    </Card>

                    {
                        noteList.length > 0 ?
                            noteList.map((item: any, index: any) => (
                                <LoveLetterRow1 data={item} key={index}/>
                            ))
                            :
                            null
                    }
                </div>
            </div>
        </div>
    )
}
export default LoveLetterList
