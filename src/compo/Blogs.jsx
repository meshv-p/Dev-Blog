import React, { useEffect, useState, useContext } from 'react'
import {
    Avatar,
    AvatarGroup,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader, CardMedia,
    IconButton,
    Stack,
    Typography
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite';
import SendIcon from '@mui/icons-material/Send';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import Link from 'next/link';
import { useGlobal } from '../context/GlobalItemsProvider';
// import { Link, useNavigate } from 'react-router-dom';
// import blogContext from '../Context/BlogContext';
import { AlertBar } from './Alert';
import { UserAvatar } from './UserAvatar';
import { timeAgo } from "../utils/timeAgo";
import { hexToHsl, stringToColor } from '../utils/commonFunctioins';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthenticationProvider';
import Image from 'next/image';
import { Spinner } from './Spinner'
import { sendNotification } from '../utils/notification';


export const Blog = ({ blog, theme, BlogType = 'title', index }) => {
    let { logginUserData } = useAuth()
    let { URL } = useGlobal()
    const [userLiked, setUserLiked] = useState(false)
    const [totalLike, setTotalLike] = useState(blog.totalLike)
    const [open, setOpen] = useState(false)
    // const context = useContext(blogContext)
    // let { url, loggedinUser } = context;

    let history = useRouter();


    useEffect(() => {
        // console.log(index);
        //     // console.log(typeof localStorage.getItem('user'), typeof blog?.like[0]);
        let userId = JSON.parse(localStorage.getItem('user'))?.profile?._id;
        //     // console.log(blog.like?.includes(userId))
        setUserLiked(blog.like ? blog.like?.includes(userId) : false);
        setTotalLike(blog.totalLike ? blog.totalLike : 0)

    }, [blog.like, blog.totalLike])


    // const openBlog = (e) => {
    //     // console.log(e.currentTarget.dataset.key)
    //     let id = e.currentTarget.dataset.key;
    //     if (BlogType === 'user') {
    //         return history.push(`/user/${id}`);

    //     }
    //     history.push(`/blog/${id}`);
    // }
    const openProfile = (e) => {
        let id = e.currentTarget.dataset.key;
        history.push(`/user/${id}`, undefined, { shallow: true });
    }


    const handleLike = () => {
        if (!logginUserData) {
            setOpen(true)
            return
        }

        //send notification to user who liked the blog
        if (blog.user._id !== logginUserData.profile._id) {
            sendNotification(blog.user.username, `${logginUserData.profile.name} ${userLiked ? 'unliked' : 'liked'}  your blog`, 'like')
        }

        // "from":"123",
        // "to":"6245c68299b2268d8bccc47d",
        // "text":"maan has Followed you."
        fetch(`${URL}/api/v1/notification/`, {
            method: 'POST',
            body: JSON.stringify({
                "from": `${JSON.parse(localStorage.getItem('user')).profile._id}`,
                "to": `${blog.user._id}`,
                "text": `has ${userLiked ? 'unliked' : 'liked'} your blog ${blog.title}.`
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': (JSON.parse(localStorage.getItem('user'))?.authToken || JSON.parse(sessionStorage.getItem('user'))?.authToken)
            }
        }).then(res => res.json()).then(data => console.log(data));

        setTotalLike(userLiked ? totalLike - 1 : totalLike + 1)
        setUserLiked(!userLiked)
        fetch(`${URL}/api/v1/blog/like/${blog._id}`, {
            method: 'PATCH',
            // body: JSON.stringify(loginDetails),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': (JSON.parse(localStorage.getItem('user'))?.authToken || JSON.parse(sessionStorage.getItem('user'))?.authToken)
            }
        }).then(res => res.json()).then(data => console.log(data))
    }

    function goToBlogComment() {
        history.push(`/blog/${blog._id}#Comments`, undefined, { shallow: true })
    }

    const removeAlert = () => {
        setOpen(false)
        // console.log('close')
    }

    function shareBlog(blog) {
        if (navigator.share) {
            navigator
                .share({
                    title: `${blog.title} | ${document.location.href}`,
                    text: `Check out ${blog.title}`,
                    url: document.location.href + `blog/${blog._id}`,
                })
                .then(() => {
                    console.log('Successfully shared');
                })
                .catch(error => {
                    console.error('Something went wrong sharing the blog', error);
                });
        }
    }


    const followUser = (userId, isFollow) => {
        //send notification to user who followed the user
        if (blog.user._id !== logginUserData.profile._id) {
            sendNotification(blog.user.username, `${logginUserData.profile.name} ${isFollow ? 'unfollowed' : 'followed'} you`, 'follow')
        }
        fetch(`${URL}/api/v1/notification/`, {
            method: "POST",
            body: JSON.stringify({
                from: `${JSON.parse(localStorage.getItem("user")).profile._id}`,
                to: `${blog?._id}`,
                text: `has ${isFollow ? "Unfollowed" : "Followed"} you.`,
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization:
                    JSON.parse(localStorage.getItem("user"))?.authToken ||
                    JSON.parse(sessionStorage.getItem("user"))?.authToken,
            },
        })
            .then((res) => res.json())
            .then((data) => console.log(data));

        fetch(`${URL}/api/v1/users/friends/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${logginUserData.authToken}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                history.push(history.pathname)
            });
    };
    return (
        <>
            <Card elevation={3} component='div' sx={{ my: 1, cursor: 'pointer', border: `1px solid ${theme ? '#d9d9d9' : '#424242'}`, ":focus": { borderColor: '#42a5f5' } }}
                key={blog._id} raised={true}>
                <AlertBar open={open} msg="Login to like.." type='error' remove={removeAlert} />
                {
                    index === 0 && blog?.coverImg &&

                    <CardMedia
                        component="img"
                        alt="green iguana"
                        height="240"
                        image={`${blog?.coverImg ?? `https://source.unsplash.com/random/?${blog?.tag[0]},${blog?.tag[1]},web`}  `}
                        loading='lazy'
                        decoding='async'
                    />
                }
                {/* <Image src={`https://source.unsplash.com/random/?${blog?.tag[0]},${blog?.tag[1]},web`} alt='pic' width={500} height={200} loading='lazy' blurDataURL={rgbDataURL(237, 181, 6)} /> */}
                <CardHeader
                    sx={{ ":hover": { background: !theme ? '#424242' : "#d9d9d9" } }}
                    onClick={e => openProfile(e)} data-key={blog.user?._id || blog?._id}
                    avatar={
                        <UserAvatar src={blog.user?.Profile_pic || blog?.Profile_pic}
                            name={(blog.user?.username || blog.username) ?? 'User'} />
                    }
                    title={blog.user?.username || blog?.username}
                    // subheader={blog.createdAt}
                    subheader={'Posted ' + timeAgo(blog?.createdAt) + ' ago'}
                />
                <CardContent sx={{ cursor: 'pointer', ":focus": { borderColor: 'red' } }} data-key={blog._id}>
                    <Link href={`/blog/${blog._id}`} scroll={true} >
                        <Typography variant='body1' sx={{
                            ":hover": {
                                color: 'blue'
                            }
                        }}>
                            {blog?.title}
                        </Typography>
                    </Link>

                    {/* <Typography */}
                    {
                        BlogType === 'user' ?
                            <>
                                <Typography variant='body1'>{blog?.name} - {blog?.email}</Typography>
                            </> :


                            <Typography dangerouslySetInnerHTML={{ __html: `${(blog?.desc)?.slice(0, 50)} ...` }}
                                variant='body2'
                                color="text.secondary">
                                {/* {(blog?.desc)?.slice(0, 50)} */}
                            </Typography>
                    }

                    {/* Followers */}
                    <Typography variant='body2' color="text.secondary">
                        {
                            BlogType === 'user' && (
                                <Stack direction='column'>
                                    <Typography> Folllowers:{(blog.followers)?.length} ||
                                        Following:{(blog.following)?.length}</Typography>

                                    <AvatarGroup total={(blog.followers)?.length} sx={{ justifyContent: 'flex-end' }}>
                                        {
                                            blog.followers?.map((user, i) => (

                                                <UserAvatar src={user.Profile_pic} key={i} name={user.username} />

                                            ))
                                        }
                                    </AvatarGroup>

                                </Stack>
                            )
                        }
                    </Typography>

                    <Stack direction="row" gap={2} sx={{ my: 1 }} flexWrap="wrap">
                        {
                            blog?.tag &&
                            blog?.tag?.map(tag => (
                                <React.Fragment key={tag}>
                                    <Link href={`/t/${tag}`}>
                                        <Typography component="span" sx={{
                                            cursor: 'pointer',
                                            padding: .5,
                                            border: 1,
                                            borderColor: stringToColor(tag),
                                            borderRadius: 1,
                                            ":hover": { background: hexToHsl(stringToColor(tag)) }
                                        }}>
                                            <>
                                                <span># </span>
                                                <span style={{ color: stringToColor(tag) }}>{tag} </span>
                                            </>
                                        </Typography>
                                    </Link>
                                </React.Fragment>
                            ))
                        }
                    </Stack>
                </CardContent>


                {

                    (BlogType !== 'user') ?

                        <CardActions>
                            <IconButton onClick={handleLike}>
                                {
                                    userLiked ?
                                        <FavoriteIcon sx={{ color: '#42a5f5' }} />
                                        :
                                        <FavoriteIcon />

                                }
                            </IconButton>
                            {/* <Typography>{blog.totalLike ? blog.totalLike : 0}  likes</Typography> */}
                            <Typography>{totalLike ? totalLike : 0} likes</Typography>
                            <IconButton onClick={goToBlogComment}>
                                <ChatBubbleIcon />
                            </IconButton>
                            <Box sx={{ flexGrow: 1 }} />
                            <IconButton onClick={e => {
                                shareBlog(blog)
                            }}>
                                <SendIcon />
                            </IconButton>

                        </CardActions> : <Stack spacing={2} direction='row' sx={{ p: 1 }}>
                            {
                                blog._id !== logginUserData?.profile?._id && (
                                    (blog?.followers)?.find(({ user }) => user === logginUserData?.profile.user) ?
                                        <Button variant='contained' onClick={() => followUser(blog?._id, true)}>
                                            UnFollow
                                        </Button> :
                                        <Button variant='text' onClick={() => followUser(blog?._id, false)}>
                                            Follow
                                        </Button>
                                )
                            }
                            <Button onClick={() => history.push('/chat')} variant='outlined'>Message</Button>
                        </Stack>
                }


            </Card>
        </>
    )
}
