import {
    Badge,
    Box,
    Button,
    Card,
    CardHeader,
    IconButton,
    ListItem,
    ListItemText,
    Stack,
    TextField,
    Typography
} from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { UserAvatar } from './UserAvatar'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { timeAgo } from '../utils/timeAgo'
import { Spinner } from "./Spinner";
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useRouter } from 'next/router';
import { useConversations } from '../context/ConversatioinsProvider';
import { useSocket } from '../context/socketProider';
import { useAuth } from '../context/AuthenticationProvider';
import styled from '@emotion/styled';

export const ChatScreen = () => {
    let { logginUserData } = useAuth()
    const [message, setMessage] = React.useState('')
    const [isLoading, setIsLoading] = useState(true);
    const [header, setHeader] = useState(null);
    let router = useRouter()
    let { userInfo } = router.query;

    // let currentUser = JSON.parse(localStorage.getItem('user'))
    let {
        selectedUser,
        messages,
        setMessages,
        selectedUserData,
        unread,
        setUnread,
        onlineU
    } = useConversations()
    // let Cuser = JSON.parse(localStorage.getItem('user'))
    const setRef = useCallback(node => {
        if (node) {
            node.scrollIntoView({ smooth: true })
        }
    }, [])

    let socket = useSocket();
    let history = useRouter();
    let { isLaptop } = useMediaQuery()
    // let { isLaptop } = useMediaQuery((theme) => theme.breakpoints.up('sm'));

    useEffect(() => {
        if (!isLaptop && !selectedUserData?._id) return
        // setSelectedUserData(user[selectedUser]);
        // fetchAllChats()
        setIsLoading(true)
        console.log(logginUserData);

        let receiverId = userInfo ?? selectedUserData?._id

        fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/chats/friend/${receiverId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sender: JSON.parse(localStorage.getItem('user'))?.profile._id,
                receiver: receiverId
            })
        }).then(res => res.json()).then(data => {
            setIsLoading(false)
            setMessages(data)
        })
        // },[selectedUser])
        readAllSMS()

    }, [selectedUser])


    // retrieve messages according to user
    const readAllSMS = async () => {
        // let cache = {}
        // useMemo(()=>{
        fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/chats/friend/${selectedUserData?._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sender: logginUserData?.profile?._id,
                receiver: selectedUserData?._id
            })
        })
            .then(res =>
                res.json()
            ).then(data => console.log(data))


    }

    // send msg to socket eith event 'send-message'
    const handleSubmit = (e) => {
        if (message.length < 0 || message === '') return;
        // console.log(message);
        e.preventDefault()
        let s = {
            'sender': logginUserData.profile._id,
            'message': message,
            'to': selectedUserData._id,
            'time': Date().toString,
            'fromMe': true
        }
        console.log(s);
        socket.emit('send-msg', s)
        setMessages([...messages, s])
        window.scrollTo(0, document.body.scrollHeight);
        setMessage('')
    }

    useEffect(() => {
        if (socket === null) return
        socket?.on('receive-msg', (msg) => {
            console.log(selectedUserData);
            console.log(selectedUserData?._id === msg.sender);


            if (selectedUserData?._id === msg.sender) {

                setMessages([...messages, msg])
            } else {
                //update the information about unread messages with user Id
                // //count the number of unread messages from upcoming messages
                setUnread([...unread, msg.sender])
            }
            // setSelectedUser(user.findIndex(u => u.name === msg.sender))
        })

        // receving typing event
        socket?.on('typing', (data) => {
            // console.log(data);
            if (selectedUserData?._id === data.sender) {
                setHeader('Typing...')
            }
        })

        socket?.on('stop-typing', (data) => {
            // console.log(data);
            if (selectedUserData?._id === data.sender) {
                setHeader(null)
            }
        })
    }, [messages, socket])

    // send typing event to socket with event 'typing'
    const handleTyping = (data) => {
        setMessage(data)

        // e.preventDefault()
        socket.emit('typing', {
            'sender': logginUserData._id,
            'to': selectedUserData._id,
            'time': Date().toString,
            'fromMe': true
        })
    }

    const handleDone = () => {
        socket.emit('stop-typing', {
            'sender': logginUserData._id,
            'to': selectedUserData?._id,
            'time': Date().toString,
            'fromMe': true
        })
    }
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

    return (

        <>

            {selectedUserData._id ?
                <Box sx={{ borderColor: 'silver', height: '100%', display: 'grid', gridTemplateRows: 'auto 1fr auto' }}>
                    {/* <Stack> */}
                    {/* Chat header */}
                    <Box sx={{ bgcolor: 'background.paper', border: '0 1 1 1' }}>
                        <Card>
                            <CardHeader
                                avatar={
                                    <Stack direction="row" gap={2}>

                                        {!isLaptop && <IconButton onClick={() => {
                                            history.back()
                                        }}>
                                            <ArrowBackIosRoundedIcon />
                                        </IconButton>}
                                        <StyledBadge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                            // variant={checkOnlineUser(onlineU, user._id) ? 'dot' : 'standard'}
                                            variant={onlineU?.find(u => u.id === selectedUserData._id) ? 'dot' : 'standard'}
                                        >
                                            <UserAvatar src={selectedUserData.Profile_pic} name={selectedUserData.username} />

                                        </StyledBadge>
                                    </Stack>
                                }
                                title={selectedUserData?.username}
                                subheader={header || selectedUserData?.email}
                                action={<IconButton aria-label="settings">
                                    <MoreVertIcon />
                                </IconButton>}
                            />
                        </Card>

                    </Box>
                    {/* Chat body */}
                    <Box sx={{
                        p: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: '1',
                        overflow: 'auto',
                        maxHeight: '70vh'
                    }}>
                        {
                            isLoading ? <Spinner /> :
                                messages?.map((msg, index) => {
                                    const lastMessage = messages.length - 1 === index

                                    return (
                                        // <List sx={{ width: 'min-content', borderRadius: 1, bgcolor: 'background.paper', border: 1, alignContent: 'end', justifyContent: 'right', display: 'flex' }}>
                                        <React.Fragment key={index}>
                                            <ListItem
                                                ref={lastMessage ? setRef : null}
                                                selected sx={{ width: 'max-content', m: .4, borderRadius: 2 }}
                                                style={{
                                                    alignSelf: msg.sender === logginUserData.profile._id ? 'end' : 'start',
                                                    background: (msg.sender === logginUserData.profile._id) !== true && 'transparent',
                                                    color: (msg.sender !== logginUserData.profile._id) && 'rgb(25 118 210 / 95%)',
                                                    border: '1px solid rgb(25 118 210 / 76%)',
                                                    maxWidth: '244px',
                                                    msWordBreak: 'break-word',
                                                }}
                                            >

                                                <ListItemText primary={msg.message}
                                                    secondary={
                                                        // msg.sender === logginUserData.profile._id &&
                                                        <Stack direction='row' alignItems='center' gap={1}>
                                                            <Typography fontSize='10px'>
                                                                {/* {timeAgo(msg.createdAt || new Date())} */}
                                                                {(msg.createdAt ? new Date(msg.createdAt) : new Date()).toLocaleTimeString([], {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}

                                                            </Typography>
                                                            <Typography color={msg.hasUserRead ? 'green' : ""}
                                                                align='right' fontSize='10px'>
                                                                ✔✔
                                                            </Typography>
                                                        </Stack>
                                                    }


                                                />

                                            </ListItem>
                                            <Typography color='silver' variant="caption" display="block" gutterBottom
                                                style={{ alignSelf: msg.sender === logginUserData.profile._id ? 'end' : 'start' }}>

                                                {timeAgo(msg.createdAt || new Date())}
                                            </Typography>
                                        </React.Fragment>
                                    )
                                })

                        }
                    </Box>


                    {/* bottom input bar  */}
                    <Box sx={{ p: 1, bgcolor: 'background.paper', borderTop: 1, borderColor: 'silver' }}>
                        <form onSubmit={handleSubmit}>
                            <Stack direction='row'>
                                {/* make an event to capture on typing */}
                                <TextField sx={{ flexGrow: 1 }} id="msg" onChange={e => handleTyping(e.target.value)}
                                    value={message} label="Message" variant="filled" placeholder='Send a message'
                                    // onKeyPress={handleTyping}
                                    onBlur={handleDone}
                                    // onKeyUp
                                    required={true}
                                />
                                <Button variant="contained" onClick={handleSubmit}>Send</Button>
                            </Stack>
                        </form>

                    </Box>

                    {/* </Stack> */}
                </Box>
                :
                <Box sx={{
                    borderTop: 1,
                    borderLeft: 1,
                    borderColor: 'silver',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Typography align='center' alignSelf='center' variant='h6' color='primary'>
                        Select a chat to start conversion. {selectedUserData?.username}
                    </Typography>
                </Box>}
        </>
    )
}