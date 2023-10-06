import {useState} from "react";
import {Alert, AlertColor, Snackbar} from "@mui/material";

const MsgBox = (data: any) => {
    console.log(data)
    console.log(data)
    const {msgType, notificationMsg} = data.data
    const [showNotification, setShowNotification] = useState(true)
    return (
        <div>
            <Snackbar
                open={showNotification}
                autoHideDuration={3000}
                onClose={() => {
                    setShowNotification(false)
                }}
                message='note archieved'
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert severity={msgType} variant='filled'>{notificationMsg}</Alert>
            </Snackbar>
        </div>
    )
}
export default MsgBox
