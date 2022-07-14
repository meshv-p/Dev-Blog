import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Container, Divider, IconButton, Paper, Stack, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
// import { Link, useNavigate, useParams } from 'react-router-dom'
// import blogContext from '../Context/BlogContext';
// import { Spinner } from './Spinner';
import FavoriteIcon from '@mui/icons-material/Favorite';
// import InfiniteScroll from 'react-infinite-scroll-component';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// import { Head } from './Head';
import { timeAgo } from "../../src/utils/timeAgo";
import { hexToHsl, stringToColor } from '../../src/utils/commonFunctioins';
import Router, { useRouter } from 'next/router'
import Link from 'next/link';
import { useGlobal } from '../../src/context/GlobalItemsProvider';
import { UserAvatar } from '../../src/compo/UserAvatar';
import { useAuth } from '../../src/context/AuthenticationProvider';
import EditIcon from '@mui/icons-material/Edit';
import { SEO } from '../../src/compo/SEO';
import styles from "../../styles/Home.module.css";

const BlogDetail = ({ blog, comments: { commentByBlog: comments } }) => {
    let { setTopBarProgress, URL } = useGlobal()
    const [comment, setComment] = useState(comments)
    // // const [isLoading, setIsLoading] = useState(false)
    const [commentByUser, setCommentByUser] = useState("")
    // const [page, setPage] = useState(1)
    // const [totalPage, setTotalPage] = useState(null)

    // let { blogId } = useParams()
    const router = useRouter()
    const { id } = router.query
    // const context = useContext(blogContext)
    let { logginUserData } = useAuth();
    // let { data: blog, } = useFetch(`${url}/api/v1/blog/${blogId}`)
    let history = useRouter()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    // const getComment = useCallback((pageNo) => {
    //     // console.log(page);
    //     fetch(`${url}/api/v1/comment/${blogId}/?page=${pageNo || page}`).then(res => res.json()).then(data => {
    //         setComment(comment.concat(data.commentByBlog));
    //         setTotalPage(data.length)
    //         // console.log(data);
    //         setPage(page + 1)
    //     })
    //     // console.log(page);
    // })



    useEffect(() => {
        // console.log(hljs);

    }, [])



    function handleDelete() {
        // console.log(blog._id)
        fetch(`${url}/api/v1/blog/${blog._id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `${loggedinUser.authToken}`
            }
        }).then(res => res.json()).then(data => {
            // console.log(data)
            history.push('/')
        })
    }

    function handleEdit() {
        // console.log(blog._id)
        history.push(`/blog/edit/${blog._id}`, {
            state: {
                blog
            }
        })
    }



    const handleSubmit = (e) => {
        // setPage(1)
        if (commentByUser === '') return
        e.preventDefault()
        // console.log(commentByUser)
        fetch(`${URL}/api/v1/comment/${blog._id}`, {
            method: 'POST',
            body: JSON.stringify({ title: commentByUser }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${JSON.parse(localStorage.getItem('user'))?.authToken}`
            }
        }).then(res => res.json()).then((data) => {
            setCommentByUser("");
            data.newComment = { ...data.newComment, user: [{ Profile_pic: logginUserData?.profile?.Profile_pic, username: logginUserData?.profile?.username }] }
            // console.log(comment.unshift(data.newComment))
            setComment(comment.concat(data.newComment).reverse())

        })


        fetch(`${URL}/api/v1/notification/`, {
            method: 'POST',
            body: JSON.stringify({
                from: `${JSON.parse(localStorage.getItem('user')).profile._id}`,
                to: `${blog.user.user}`,
                text: `has commented on your post - ${commentByUser}.`
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': (JSON.parse(localStorage.getItem('user'))?.authToken || JSON.parse(sessionStorage.getItem('user'))?.authToken)
            }
        }).then(res => res.json()).then(data => { });
        // console.log(comment)
    }


    return (
        <>
            <SEO
                title={`${blog?.title} by ${blog?.user.username} - Dev Blog`}
                desc={`${(blog?.desc).slice(0, 50)} - Dev Blog`}
                kw={`#${blog?.tag?.[0]} , #${blog?.tag?.[1]} - Dev Blog`}
            />
            {/* <Head title={`${blog?.title} by ${blog?.user.username} - Dev Blog`} /> */}
            <Container sx={{ py: 2, px: 0 }}>
                {/* {
                        isLoading && <Spinner />
                    } */}

                {/* <React.Suspense fallback={<Spinner />}> */}
                {
                    // blog &&
                    // <Card sx={{ background: '#bbdefb' || '#e3f2fd' }}>

                    <Card >
                        <Typography sx={{ m: 1 }}>
                            <Button variant="outlined" onClick={() => {
                                if (history.back()) {

                                    history.back()
                                }
                                history.push('/')
                            }


                            }

                                color="inherit" startIcon={<ArrowBackIosNewIcon />}>
                                Go back
                            </Button>
                        </Typography>
                        <CardHeader
                            avatar={
                                <UserAvatar src={blog.user?.Profile_pic} name={blog.user?.username ?? 'User'} />

                            }

                            title={
                                <Link href={`/user/${blog.user._id}`}>
                                    {blog?.user?.username}
                                </Link>
                            }
                            // subheader={new Date(blog.createdAt).toLocaleString()}
                            // subheader='ago'
                            subheader={`Posted ${timeAgo(blog.createdAt)} ago`}

                            action={
                                blog?.user?._id === logginUserData?.profile._id &&
                                <>
                                    <IconButton aria-label="settings" onClick={handleEdit}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton aria-label="settings" onClick={handleDelete}>
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                </>
                            }
                        />
                        {blog?.coverImg && <CardMedia
                            component="img"
                            alt="green iguana"
                            height="440"
                            image={`${blog?.coverImg ?? `https://source.unsplash.com/random/?${blog?.tag[0]},${blog?.tag[1]},web`}  `}
                            loading='lazy'
                            decoding='async'
                        />}
                        <CardContent sx={{ px: '10px' }}>

                            <Typography variant='h4'>
                                {blog.title}
                                {/* <Typography>#tag</Typography> */}
                                <Stack direction="row" gap={1.1} sx={{ my: 1 }} flexWrap="wrap">
                                    {
                                        blog?.tag?.map(tag => (
                                            // <React.Fragment key={tag}>
                                            <Link href={`/t/${tag}`} key={tag}>
                                                <Typography component="span" sx={{
                                                    cursor: 'pointer', padding: .5, border: 1, borderColor: stringToColor(tag), borderRadius: 1, ":hover": { background: hexToHsl(stringToColor(tag)) }
                                                }}>
                                                    <span  ># </span>
                                                    <span style={{ color: stringToColor(tag) }}>{tag} </span>
                                                    {/* <span >{tag} </span> */}
                                                </Typography>
                                            </Link>
                                            // </React.Fragment>
                                        ))
                                    }
                                </Stack>
                                {/* {blog.title} */}
                            </Typography>
                            <span>
                                <Typography dangerouslySetInnerHTML={{ __html: blog.desc }} sx={{ my: 2 }} >
                                </Typography>
                            </span>

                            <Divider sx={{ mt: 2 }} />

                            <Box sx={{ my: 2 }}>
                                <Typography variant='body1' id="Comments">Comments:</Typography>
                            </Box>


                            {
                                logginUserData ?
                                    <form onSubmit={handleSubmit}>

                                        <TextField
                                            id="outlined-multiline-static"
                                            label="Add a comment"
                                            multiline
                                            rows={3}
                                            fullWidth
                                            required={true}
                                            value={commentByUser}
                                            onChange={e => setCommentByUser(e.target.value)}
                                        />
                                        <Stack spacing={2} sx={{ mt: 2 }} direction="row">
                                            <Button variant="contained" type="submit" onClick={handleSubmit}>Submit</Button>
                                            <Button variant="text">Cancel</Button>
                                        </Stack>
                                    </form>
                                    :
                                    <Typography>Login to comment</Typography>
                            }

                            {/* comment part */}
                            {comment && comment?.map(c => (
                                <Paper variant="outlined" sx={{ m: 1, border: 1, borderColor: 'text.secondary' }} key={c._id}>
                                    <Card>
                                        <CardHeader
                                            avatar={
                                                <UserAvatar src={c.user[0]?.Profile_pic} name={c.user[0]?.username ?? 'User'} />
                                            }
                                            title={<Link href='/user/'>
                                                {c?.user[0]?.username}
                                            </Link>}
                                            // subheader={c.createdAt ? new Date(c?.createdAt)?.toLocaleString() : new Date().toLocaleString()}
                                            subheader={c.createdAt ? `${timeAgo(c?.createdAt)} ago` : `${timeAgo(new Date().toLocaleString())} ago`}
                                            action={
                                                <IconButton aria-label="settings">
                                                    <MoreVertIcon />
                                                </IconButton>
                                            }
                                        />
                                        <CardContent>
                                            <Typography>{c.title}</Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button variant="outlined" color='success' startIcon={<FavoriteIcon />}>
                                                9 Like
                                            </Button>

                                        </CardActions>
                                    </Card>
                                </Paper>
                            ))}


                        </CardContent>



                    </Card>
                }
                {/* </React.Suspense> */}

            </Container>


        </ >
    )
}

export default BlogDetail

export async function getServerSideProps(context) {
    const { id } = context.query
    context.res.setHeader(
        "Cache-Control",
        "public, s-maxage=10, stale-while-revalidate=59"
    );
    // export async function getStaticProps() {
    const resOfBlog = await fetch(
        `https://mernblog.azurewebsites.net/api/v1/blog/${id}`
    );
    const commentRes = await fetch(
        `https://mernblog.azurewebsites.net/api/v1/comment/${id}/?page=1`
    );
    const blog = await resOfBlog.json();
    const comments = await commentRes.json();


    // Pass data to the page via props
    return { props: { blog, comments } };
}
