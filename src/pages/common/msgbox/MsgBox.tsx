import {Alert, AlertColor, Snackbar} from "@mui/material";

interface MsgBoxProps {
    showMsg: boolean
    msgType: AlertColor,
    closeMsgBox: (key: boolean) => void
    msg: string
    onLoadAllData: () => void
}

const MsgBox: React.FC<MsgBoxProps> = ({
                                           showMsg,
                                           closeMsgBox,
                                           msgType,
                                           msg
                                       }) => {
    return (
        <Snackbar open={showMsg}
                  autoHideDuration={2000}
                  anchorOrigin={{vertical: "top", horizontal: 'center'}}
                  onClose={() => {
                      closeMsgBox(false)
                  }}
        >
            <Alert variant={"filled"} severity={msgType}>{msg}</Alert>
        </Snackbar>
    )
}
export default MsgBox
