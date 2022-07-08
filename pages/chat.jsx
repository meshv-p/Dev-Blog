import { Container, Grid } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
// import { ChatScreen } from '../../src/compo/ChatScreen'
import { LeftSideBar } from '../src/compo/LeftSideBar'
import { ChatScreen } from '../src/compo/ChatScreen'
import { AlertBar } from '../src/compo/Alert'
import { useAuth } from '../src/context/AuthenticationProvider'
// import { useNavigate } from "react-router-dom";
import { useMediaQuery } from '../src/hooks/useMediaQuery'
// import { ChatScreen } from '../src/compo/ChatScreen'

const Chat = () => {
    const [open, setOpen] = useState(true)
    let { isLaptop } = useMediaQuery()
    // let isMobile = useMediaQuery((theme) => theme.breakpoints.up('sm'));
    let { logginUserData } = useAuth()
    setTimeout(() => {
        setOpen(false)
    }, 2000);
    let history = useRouter()
    let data = logginUserData?.following;
    useEffect(() => {
        // console.log(user)
        if (logginUserData === null) {
            history('/login');
        }
        // console.log(isLaptop);
    }, [isLaptop])


    return (
        <>
            <AlertBar open={open} msg="Follow more user to chat with them" type='info' />
            {/* {isMobile} */}
            {/* make layout like whatsapp */}
            {
                !isLaptop ?
                    <Container fixed >
                        <Grid container>
                            <Grid item xs={12}>
                                <LeftSideBar data={data} />
                            </Grid>
                        </Grid>
                    </Container> :


                    (logginUserData &&
                        <Grid container>

                            <Grid item xs={3} sx={{ height: '91vh', overflow: 'auto' }} className='hey'>

                                <LeftSideBar data={data} />

                            </Grid>
                            <Grid item xs={9}>


                                <ChatScreen />

                            </Grid>


                        </Grid>)
            }
        </>
    )
}

export default Chat
