import TriggerListBoxRow from "./TriggerListBoxRow";
import {Button, Card, CardContent, CardHeader, IconButton, Stack} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useTheme} from "@mui/material/styles";
import AddIcon from '@mui/icons-material/Add';
import BorderColorIcon from '@mui/icons-material/BorderColor';

const TriggerListBox = ({data}: {
    data: { list: any[], title: string, onAddTrigger: () => void, onDetail: (triggerId:string) => void }
}) => {
    const {t} = useTranslation()
    const theme = useTheme()
    const title = data.title
    const list = data.list
    const handleAddTrigger = () => {
        // 调用onAddTrigger方法
        data.onAddTrigger();
    };
    const onDetail = (triggerId:string) => {
        data.onDetail(triggerId)
    }
    return (
        <Card style={{
            marginTop: 20, background: theme.palette.background.default,
            border: '1px solid', borderColor: theme.palette.primary.main
        }}>
            <CardHeader title={title}
                        action={
                            <Stack direction='row' spacing={1}>
                                <IconButton onClick={handleAddTrigger}>
                                    <AddIcon style={{color: theme.palette.primary.main, fontSize: 30}}/>
                                </IconButton>
                            </Stack>
                        }
            />
            <CardContent>
                {list.map((item: any, index: any) => (
                    <TriggerListBoxRow data={{item, onDetail}} key={index}/>
                ))}
            </CardContent>
        </Card>
    )
}
export default TriggerListBox
