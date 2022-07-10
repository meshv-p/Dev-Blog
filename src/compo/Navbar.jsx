import Link from 'next/link';
import React, { useState, useContext, useEffect } from 'react'
import {
    AppBar,
    Avatar,
    Badge,
    Button,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    SwipeableDrawer,
    Toolbar,
    Typography
} from '@mui/material'
import { Box } from '@mui/system';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Brightness4Icon from '@mui/icons-material/Brightness4';
// import LoadingBar from 'react-top-loading-bar'
// import { UserAvatar } from './UserAvatar';
import ChatBubble from '@mui/icons-material/ChatBubble';
// import { SearchBar } from './SearchBar';
import DoneIcon from '@mui/icons-material/Done';
import MenuIcon from '@mui/icons-material/Menu';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useRouter } from 'next/router';
import { useGlobal } from '../context/GlobalItemsProvider';
import { UserAvatar } from './UserAvatar';
import { SearchBar } from './SearchBar';
import { useAuth } from '../context/AuthenticationProvider';

export const Navbar = () => {
    let { toggleTheme, URL, theme } = useGlobal();
    let { logginUserData } = useAuth()
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [currentUser, setCurrentUser] = useState([])
    const [data, setData] = useState(null)
    // const [currentUser, setCurrentUser] = useState(JSON.parse(window.localStorage.getItem('user'))?.profile)
    const [notifications, setNotiAnchorEl] = React.useState(null);
    // let { data, setData } = useFetch(`${URL}/api/v1/notification/`, {
    //     method: 'POST',
    //     headers: {
    //         'Authorization': `${logginUserData?.authToken}`
    //     }
    // });
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    let history = useRouter()


    useEffect(() => {
        fetch(`${URL}/api/v1/notification/`, {
            method: 'GET',
            headers: {
                'Authorization': `${JSON.parse(localStorage.getItem("user"))?.authToken}`
            }
        }).then(res => res.json()).then(d => {
            setData(d)
        });

        // console.log(JSON.parse(localStorage.getItem("user")));
        setCurrentUser(JSON.parse(localStorage.getItem("user"))?.profile)

    }, [history])






    function handleReadNoti(notiID) {
        setData(data?.filter(noti => noti._id !== notiID));
        fetch(`${URL}/api/v1/notification/`, {
            method: 'PATCH',
            body: JSON.stringify({
                "id": `${notiID}`
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': (JSON.parse(localStorage.getItem('user'))?.authToken || JSON.parse(sessionStorage.getItem('user'))?.authToken)
            }
        }).then(res => res.json()).then(data => console.log(data));
    }
    return (
        <>

            <AppBar position='static'>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => setIsDrawerOpen(true)}
                        edge="start"
                        sx={{ display: { xs: 'flex', md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Swipable  */}
                    <SwipeableDrawer
                        onOpen={() => setIsDrawerOpen(true)}
                        open={isDrawerOpen}
                        onClose={() => setIsDrawerOpen(false)}
                    >
                        <Box p={2}>
                            <Typography variant="h6" noWrap>
                                Dev Blog
                            </Typography>
                        </Box>
                        <Divider />
                        {/* List with icons */}
                        <List >
                            <Link href="/" >
                                <ListItem button key="Home" sx={{
                                    borderRadius: '8px', ":hover": {
                                        backgroundColor: 'rgb(79 92 174 / 60%)  '
                                    }
                                }} onClick={() => setIsDrawerOpen(false)}>
                                    <ListItemIcon>
                                        <HomeRoundedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Home" />
                                </ListItem>
                            </Link>

                            {/* Chat  */}
                            <Link href="/chat">
                                <ListItem button key="Create" sx={{
                                    borderRadius: '8px', ":hover": {
                                        backgroundColor: 'rgb(79 92 174 / 60%)  '
                                    }
                                }} onClick={() => setIsDrawerOpen(false)}>
                                    <ListItemIcon>
                                        <ChatBubble />
                                    </ListItemIcon>
                                    <ListItemText primary="Chat" />
                                </ListItem>
                            </Link>
                            {/* create a blog  */}
                            <Link href="/create">
                                <ListItem button key="Create" sx={{
                                    borderRadius: '8px', ":hover": {
                                        backgroundColor: 'rgb(79 92 174 / 60%)  '
                                    }
                                }} onClick={() => setIsDrawerOpen(false)}>
                                    <ListItemIcon>
                                        <AddCircleIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Create" />
                                </ListItem>
                            </Link>


                            {/* toggle dark theme */}
                            <ListItem button key="Toggle" sx={{
                                borderRadius: '8px', ":hover": {
                                    backgroundColor: 'rgb(79 92 174 / 60%)  '
                                }
                            }} onClick={() => toggleTheme()} >
                                <ListItemIcon>
                                    <Brightness4Icon />
                                </ListItemIcon>
                                <ListItemText primary={`${!theme ? 'Light' : 'Dark'} Theme`} />
                            </ListItem>
                        </List>
                        <Divider />
                        {/* Profile  */}

                        {logginUserData &&
                            <>
                                <Link href={`/user/${logginUserData?.profile?._id}`}>
                                    <ListItem button key="Profile" sx={{
                                        borderRadius: '8px', ":hover": {
                                            backgroundColor: 'rgb(79 92 174 / 60%)  '
                                        }
                                    }} onClick={() => setIsDrawerOpen(false)}>
                                        <ListItemIcon>
                                            <UserAvatar src={logginUserData?.profile?.Profile_pic} name={logginUserData?.profile?.username} />
                                        </ListItemIcon>
                                        <ListItemText primary={logginUserData?.profile?.username} />
                                    </ListItem>
                                </Link>
                                <Link href="/">
                                    <ListItem button key="Logout" sx={{
                                        borderRadius: '8px', ":hover": {
                                            backgroundColor: 'rgb(79 92 174 / 60%)  '
                                        }
                                    }} onClick={() => {
                                        sessionStorage.removeItem('user');
                                        localStorage.removeItem('user');
                                        setCurrentUser(null);
                                        setAnchorElUser(null)
                                        window.location.reload();
                                    }}>
                                        <ListItemText primary="Logout" />
                                    </ListItem>
                                </Link>

                            </>
                        }



                    </SwipeableDrawer>


                    <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        {/*<img src={LOGO} alt="Dev-Blog" style={{width:'auto',height:'auto'}}/>*/}

                        <Typography sx={{ display: { xs: 'none', md: 'flex' }, cursor: 'pointer' }}>Dev Blog</Typography>
                    </Link>
                    <SearchBar />

                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: 'flex' }}>
                        <IconButton
                            sx={{ display: { xs: 'none', md: 'inline-flex' } }}
                            onClick={() => history.push('/chat')}
                            size="large"
                            aria-label="Change theme"
                            color="inherit"
                        >

                            <ChatBubble />

                        </IconButton>
                        <IconButton
                            sx={{ display: { xs: 'none', md: 'inline-flex' } }}
                            onClick={toggleTheme}
                            size="large"
                            aria-label="Change theme"
                            color="inherit"
                        >

                            <Brightness4Icon />

                        </IconButton>
                        <IconButton
                            sx={{ display: { xs: 'inline-flex', md: 'inline-flex' } }}
                            onClick={e => setNotiAnchorEl(e.currentTarget)}
                            onClose={() => setNotiAnchorEl(null)}
                            size="large"
                            aria-label="show 17 new notifications"
                            color="inherit"
                        >
                            <Badge badgeContent={data?.length} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <Menu
                            id="basic-menu"
                            anchorEl={notifications}
                            open={Boolean(notifications)}
                            onClose={() => setNotiAnchorEl(null)}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <List sx={{ maxWidth: 360, }}>
                                {

                                    logginUserData && data?.length !== 0 &&
                                    data?.map(noti => (
                                        <React.Fragment key={noti._id}>

                                            <ListItem alignItems="flex-start"
                                                key={noti._id}
                                                secondaryAction={
                                                    <IconButton edge="end" aria-label="delete"
                                                        onClick={(e) => handleReadNoti(noti._id)}
                                                    >
                                                        <DoneIcon />
                                                    </IconButton>
                                                }
                                            >
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <UserAvatar src={noti.from[0].Profile_pic}
                                                            name={noti.from[0].username} />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Link href={'/user/' + noti.from[0]._id}>
                                                            {noti.from[0].username}
                                                        </Link>
                                                    }
                                                    secondary={`${noti.from[0].username} ${noti.text}`}
                                                />
                                            </ListItem>
                                            <Divider variant="inset" component="li" />
                                        </React.Fragment>
                                    ))
                                }
                            </List>
                        </Menu>
                        {currentUser ?
                            <>
                                <Button variant='text'
                                    color='inherit'
                                    size='large'
                                    onClick={(e) => setAnchorElUser(e.currentTarget)}

                                    startIcon={
                                        <UserAvatar src={currentUser?.Profile_pic}
                                            name={currentUser?.username ?? 'User'} />
                                    }>
                                    <Typography sx={{
                                        ml: 1,
                                        display: { xs: 'none', md: 'block' }
                                    }}>{currentUser?.username}</Typography>

                                </Button>

                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={() => setAnchorElUser(null)}
                                >
                                    <MenuItem onClick={() => setAnchorElUser(null)}>
                                        <Link href={`/user/${currentUser?._id}`}>
                                            <Typography>Profile</Typography>
                                        </Link>
                                    </MenuItem>
                                    <MenuItem onClick={() => setAnchorElUser(null)}>
                                        <Link href='/chat'>
                                            <Typography>Chat</Typography>
                                        </Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <Link href='/create'>
                                            <Typography>Create blog</Typography>
                                        </Link>
                                    </MenuItem>
                                    <MenuItem onClick={() => {
                                        localStorage.removeItem('user');
                                        setCurrentUser(null);
                                        setAnchorElUser(null)
                                        window.location.reload();
                                        history.push('/');
                                    }}>
                                        <Typography>Logout</Typography>
                                    </MenuItem>


                                </Menu>
                            </>
                            :
                            <>

                                <Button color="inherit" variant="text" sx={{ mx: 1, fontSize: '10px' }}
                                    onClick={() => history.push('/signup')}>Sign Up</Button>
                                <Button color="inherit" sx={{ fontSize: { xs: '10px' } }} variant='outlined'
                                    onClick={() => history.push('/login')}>Login</Button>

                            </>}
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    )
}
