import {timeLeft} from "../../common/common";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {Box, Container, Grid, Paper, Stack} from "@mui/material";
import {useTheme} from "@mui/material/styles";

const TimerBoard1 = () => {
    const timerPrimary = useSelector((state: any) => state.loginSlice.timerPrimary)
    const [leftDays, setLeftDays] = useState(0);
    const [leftHours, setLeftHours] = useState(0);
    const [leftMinutes, setLeftMinutes] = useState(0);
    const [leftSeconds, setLeftSeconds] = useState(0);
    const theme = useTheme()

    useEffect(() => {
        function handleStatusChange(status: any) {
            dataRefresh()
        }

        const timer = setTimeout(() => {
            dataRefresh()
        }, 1000)

        return function cleanup() {
            timer && clearTimeout(timer)
        }
    })

    const dataRefresh = () => {
        let leftTime = timeLeft(timerPrimary);
        setLeftDays(leftTime.days);
        setLeftHours(leftTime.hours);
        setLeftMinutes(leftTime.minutes);
        setLeftSeconds(leftTime.seconds);
    };
    return (
        <Paper sx={{background: theme.palette.secondary.main, padding: 2, paddingTop: 3}}>
            <Box display='flex' justifyContent='center'>
                <Stack direction='row' spacing={2}>
                    <Box sx={{width: 'auto'}}>
                        <Paper sx={{background: theme.palette.secondary.dark, padding: 1}}>
                            <span style={{
                                color: theme.palette.secondary.light,
                                fontSize: 32,
                                fontWeight: '600'
                            }}>{leftDays}</span>
                        </Paper>
                        <span style={{color: theme.palette.secondary.dark, fontSize: 20, fontWeight: '600'}}>DAY</span>
                    </Box>
                    <Box sx={{}}>
                        <Paper sx={{background: theme.palette.secondary.dark, padding: 1}}>
                            <span style={{
                                color: theme.palette.secondary.light,
                                fontSize: 32,
                                fontWeight: '600'
                            }}>{leftHours < 10 && leftHours >= 0 ? `0${leftHours}` : leftHours}</span>
                        </Paper>
                        <span style={{color: theme.palette.secondary.dark, fontSize: 20, fontWeight: '600'}}>HOUR</span>
                    </Box>
                    <Box sx={{}}>
                        <Paper sx={{background: theme.palette.secondary.dark, padding: 1}}>
                            <span style={{
                                color: theme.palette.secondary.light,
                                fontSize: 32,
                                fontWeight: '600'
                            }}>{leftMinutes < 10 && leftMinutes >= 0 ? `0${leftMinutes}` : leftMinutes}</span>
                        </Paper>
                        <span style={{color: theme.palette.secondary.dark, fontSize: 20, fontWeight: '600'}}>MIN</span>
                    </Box>
                    <Box sx={{}}>
                        <Paper sx={{background: theme.palette.secondary.dark, padding: 1}}>
                            <span style={{
                                color: theme.palette.secondary.light,
                                fontSize: 32,
                                fontWeight: '600'
                            }}>{leftSeconds < 10 && leftSeconds >= 0 ? `0${leftSeconds}` : leftSeconds}</span>
                        </Paper>
                        <span style={{color: theme.palette.secondary.dark, fontSize: 20, fontWeight: '600'}}>SEC</span>
                    </Box>
                </Stack>
            </Box>
        </Paper>
    )
}
export default TimerBoard1
