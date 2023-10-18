import {IconButton, TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {useTheme} from "@mui/material/styles";

interface SearchBoxProps {
    searchKey: string
    setSearchKey: (key: string) => void
    pageIndex: number
    setPageIndex: (newPageIndex: number) => void
    pageSize: number
    onLoadAllData: () => void
}

const SearchBox: React.FC<SearchBoxProps> = ({
                                                 searchKey,
                                                 setSearchKey,
                                                 pageIndex,
                                                 setPageIndex, pageSize,
                                                 onLoadAllData
                                             }) => {
    const {t} = useTranslation()
    const theme = useTheme()
    const [key, setKey] = useState('')
    return (
        <div style={{display: 'flex', alignItems: 'center'}}>
            <TextField
                style={{width: '100%', padding: 0}}
                placeholder={t('history.searchHolder')}
                onChange={e => {
                    setSearchKey(e.target.value)
                }}
            />
            <IconButton onClick={() => {
                if (pageIndex !== 1) {
                    setPageIndex(1)
                } else {
                    onLoadAllData()
                }
            }}>
                <SearchIcon style={{color: theme.palette.primary.main}}/>
            </IconButton>
        </div>
    )
}
export default SearchBox
