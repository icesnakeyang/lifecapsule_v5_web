import {Box, CircularProgress, styled, Typography} from "@mui/material";
import React from "react";

const Overlay = styled(Box)({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.5)',
    color: '#fff',
    zIndex: 1
})

interface CoverBoxProps {
    message: string
}

const CoverBox: React.FC<CoverBoxProps> = ({message}) => {
    return (
        <Overlay>
            <CircularProgress color="inherit"/>
            <Typography variant='h6' sx={{ml: 2}}>
                {message}
            </Typography>
        </Overlay>
    )
}
export default CoverBox
