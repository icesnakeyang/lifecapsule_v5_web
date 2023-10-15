import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {apiGetLoveLetter, apiGetMyNote, apiRequestRsaPublicKey} from "../../../api/Api";
import {Decrypt, Decrypt2, GenerateRandomString16, RSAencrypt} from "../../../common/crypto";
import {saveTagList} from "../../../store/noteDataSlice";
import {saveEditTags} from "../../../store/tagSlice";
import {NoteModel} from "../../../model/NoteModel";
import Header1 from "../../common/Header1";
import {doesSectionFormatHaveLeadingZeros} from "@mui/x-date-pickers/internals/hooks/useField/useField.utils";
import {Breadcrumbs, Button, Card, CardContent, CardHeader, CircularProgress, Stack, TextField} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useTheme} from "@mui/material/styles";
import moment from "moment";

const LoveLetterEdit = () => {
    const noteId = useSelector((state: any) => state.noteDataSlice.noteId)
    const [note, setNote] = useState<NoteModel>()
    const [encrypt, setEncrypt] = useState(true)
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(true)
    const {t} = useTranslation()
    const navigate = useNavigate()
    const theme = useTheme()
    const [title, setTitle] = useState('')

    useEffect(() => {
        console.log(noteId)
        loadAllData()
    }, [])

    const loadAllData = () => {
        let params = {
            noteId,
            encryptKey: {},
            keyToken: "",
        };
        setLoading(true)
        apiRequestRsaPublicKey().then((res2: any) => {
            if (res2.code === 0) {
                const keyAES_1 = GenerateRandomString16();
                params.encryptKey = RSAencrypt(keyAES_1, res2.data.publicKey);
                params.keyToken = res2.data.keyToken;

                apiGetLoveLetter(params).then((res: any) => {
                    if (res.code === 0) {
                        let note = res.data.note
                        setNote(note)
                        setTitle(note.title)
                        console.log(note)
                        let strKey = note.userEncodeKey;
                        strKey = Decrypt2(strKey, keyAES_1);
                        let content = Decrypt(note.content, strKey, strKey);
                        setEncrypt(true);
                        setContent(content);
                        setLoading(false)
                    }
                })
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
                            navigate('/LoveLetterList')
                        }}>{t('nav.loveLetter')}</Button>
                        <Button onClick={() => {
                            navigate(-1)
                        }}>{t('nav.back')}</Button>
                    </Breadcrumbs>

                    {loading ?
                        <div style={{textAlign: "center", marginTop: 200}}>
                            <CircularProgress/>
                        </div>
                        :
                        note ?
                            <Card style={{
                                marginTop: 10, background: theme.palette.background.default,
                                border: '1px solid',
                                borderColor: theme.palette.primary.main
                            }}>
                                <CardHeader title={t('loveLetter.editLoveLetter')}/>
                                <CardContent>
                                    <TextField
                                        variant='standard'
                                        label={t('loveLetter.letterTitle')}
                                        value={note.title}
                                        style={{width: '100%'}}
                                        onChange={e => {
                                            setTitle(e.target.value)
                                        }}
                                    />
                                    <div style={{marginTop: 10, fontSize: 14}}>
                                        {t('loveLetter.createTime')}: {moment(note.createTime).format('lll')}
                                    </div>
                                    <TextField
                                        multiline
                                        variant='outlined'
                                        label={t('loveLetter.letterContent')}
                                        value={content}
                                        style={{marginTop: 20, width: '100%'}}
                                        onChange={e => {
                                            setContent(e.target.value)
                                        }}
                                    />
                                </CardContent>
                            </Card>
                            :
                            <div style={{textAlign: "center", marginTop: 200}}>
                                <div>{t('loveLetter.tip4')}</div>
                                <Button variant='contained'
                                        style={{marginTop: 10}}>{t('loveLetter.btNewLoveLetter')}</Button>
                            </div>
                    }

                </div>
            </div>

        </div>
    )
}
export default LoveLetterEdit
