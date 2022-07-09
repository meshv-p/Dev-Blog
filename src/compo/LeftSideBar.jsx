import { Avatar, Badge, Box, IconButton, ListItemButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { UserAvatar } from './UserAvatar'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';
import { useConversations } from '../context/ConversatioinsProvider';
import { useSocket } from '../context/socketProider';
import styled from '@emotion/styled';
import { useFetch } from "../hooks/useFetch";
import { timeAgo } from '../utils/timeAgo';
import { Spinner } from "./Spinner";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthenticationProvider';
// import { useNavigate } from 'react-router-dom';

export const LeftSideBar = ({ data: users }) => {
    let { isLaptop } = useMediaQuery()
    const [list, setList] = useState(null)
    let { logginUserData } = useAuth()
    // let user = JSON.parse(localStorage.getItem('user'))
    const [isLoading, setIsLoading] = useState(true);
    let history = useRouter()
    // let { data: list, error, isLoading } = useFetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/chats/friendlist`, {
    //     method: 'POST',
    //     body: JSON.stringify({
    //         userId: logginUserData?._id
    //     }),
    //     headers: {
    //         'Content-Type': 'application/json',
    //     }
    // })
    let { selectedUser, setSelectedUser, onlineU, setOnlineU, unread, setUnread, selectedUserData, setSelectedUserData } = useConversations()
    let socket = useSocket();
    // let theme = JSON.parse(localStorage.getItem("Theme"));

    useEffect(() => {
        fetch(
            `https://mernblog.azurewebsites.net/api/v1/chats/friendlist`, {
            method: 'POST',
            body: JSON.stringify({
                userId: JSON.parse(localStorage.getItem('user')).profile?._id
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        }
        ).then(res => res.json()).then(data => {

            setList(data)
            setIsLoading(false)
        })


        return () => {

        }
    }, [])




    useEffect(() => {
        //online users
        socket?.on('online', (data) => {
            // console.log(data, socket);
            setOnlineU(data.onlineUser)
        })
        // offline users
        socket?.on('offline', (data) => {
            // console.log(data, socket.id);
            //filter out the user that is offline
            let newOnlineU = onlineU.filter(user => user.id !== data)
            setOnlineU(newOnlineU)
            // console.log(newOnlineU)
            // setOnlineU(data)
        })

        //emit online event
        // socket?.emit('online', socket.id)

        return () => {
            socket?.off('online')
            socket?.off('offline')
        }
    }, [socket, onlineU])
    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
            backgroundColor: '#44b700',
            color: '#44b700',
            boxShadow: `0 0 0 1px ${theme.palette.background.paper}`,
            '&::after': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                animation: 'ripple 1.2s infinite ease-in-out',
                border: '1px solid currentColor',
                content: '""',
            },
        },
        '@keyframes ripple': {
            '0%': {
                transform: 'scale(.8)',
                opacity: 1,
            },
            '100%': {
                transform: 'scale(2.4)',
                opacity: 0,
            },
        },
    }));

    function checkOnlineUser(arr, userId) {
        return arr?.find(u => u.id === userId)
    }

    useEffect(() => {
        console.log(isLaptop);

        return () => {
            // console.clear();
            // setSelectedUser(null)
            // setSelectedUserData(null)
        }
    }, [isLaptop])



    //function to open conversion
    function openConversion(index) {
        //find user id in unread arr if so remove .
        let newUnread = unread.filter(u => u !== selectedUserData?._id)
        setUnread(newUnread)
        setSelectedUser(index)
        setSelectedUserData(list[index])

        console.log(isLaptop);
        if (!isLaptop) {
            history(`/dm/${logginUserData.following[index]._id}`)
        }

    }


    return (
        <Box>
            <React.Suspense fallback={<Spinner />}>


                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {
                        isLoading ? <Spinner /> :
                            list &&
                            list?.map((user, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <ListItemButton selected={selectedUser === index}
                                            onClick={(e) => openConversion(index)}
                                            sx={{ borderRadius: '8px', border: selectedUser === index ? '1px solid rgb(25 118 210 / 76%)' : '' }}>


                                            <ListItem alignItems="flex-start" key={index}>
                                                <ListItemAvatar>
                                                    <StyledBadge
                                                        overlap="circular"
                                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                        // variant={checkOnlineUser(onlineU, user._id) ? 'dot' : 'standard'}
                                                        variant={onlineU?.find(u => u.id === user._id) ? 'dot' : 'standard'}
                                                    >
                                                        <UserAvatar src={user.Profile_pic} name={user.username} />

                                                    </StyledBadge>
                                                    {/* <UserAvatar src={user?.user?.Profile_pic} name={user?.user?.username} /> */}
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={user.username}
                                                    secondary={
                                                        <React.Fragment>
                                                            <Typography
                                                                component="span"
                                                                variant="body2"
                                                                color="textPrimary"
                                                            >
                                                                {/* get time  */}
                                                                {timeAgo(user.createdAt) + ' ago'}
                                                                {/* {(user.createdAt).slice(0, 10)} */}

                                                            </Typography>
                                                        </React.Fragment>
                                                    }
                                                />
                                            </ListItem>
                                            {
                                                (user.unread || unread.find(u => u === user._id)) &&
                                                <div className='unseenmsg' style={{
                                                    borderRadius: '100%',
                                                    width: '30px',
                                                    height: '30px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: !theme ? 'black' : '#00c0ff',
                                                    color: !theme ? '#00c0ff' : 'black'
                                                }}>
                                                    <span className='count'>
                                                        {user.unread}
                                                    </span>
                                                </div>
                                            }
                                            <IconButton>
                                                <ArrowForwardIosIcon />
                                            </IconButton>
                                        </ListItemButton>
                                        <Divider variant="inset" component="li" />
                                    </React.Fragment>
                                )
                            })
                    }

                </List>
            </React.Suspense>
        </Box>
    )
}

export async function getServerSideProps({ req, res }) {
    res.setHeader(
        "Cache-Control",
        "public, s-maxage=10, stale-while-revalidate=59"
    );
    // export async function getStaticProps() {
    const resOfChat = await fetch(
        `https://mernblog.azurewebsites.net/api/v1/chats/friendlist`, {
        method: 'POST',
        body: JSON.stringify({
            userId: logginUserData?._id
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    }
    );

    const data = await resOfChat.json();

    // Pass data to the page via props
    return { props: { data } };
}