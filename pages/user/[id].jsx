import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Container,
    Divider,
    Paper,
    Skeleton,
    Stack,
    Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
// import { useNavigate, useParams } from 'react-router-dom'
// import blogContext from '../Context/BlogContext';
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import { useFetch } from '../hooks/useFetch';
import { Upload } from "../../src/compo/Upload";
import { Modal } from "../../src/compo/Modal";
import BasicTabs from "../../src/compo/BasicTabs";
import { SkeletonPage } from "../../src/compo/SkeletonPage";
// import { Head } from '../Compo/Head';
import { stringToColor } from "../../src/utils/commonFunctioins";
import { useRouter } from "next/router";
import { useAuth } from "../../src/context/AuthenticationProvider";
import { SEO } from "../../src/compo/SEO";

const UserProfile = ({ profile }) => {
    // const context = useContext(blogContext);
    let { logginUserData } = useAuth();
    // const [profile, setProfile] = useState(null)
    const [follow, setFollow] = useState(false);
    const [modelOpen, setModelOpen] = useState(false);

    let history = useRouter();
    let router = useRouter();
    let { id: userId } = router.query;
    // let { data: profile, isLoading, setData } = useFetch(`${url}/api/v1/users/${userId}`)

    useEffect(() => {
        console.log(profile, logginUserData);
        //     // if (!JSON.parse(localStorage.getItem("user")) && !sessionStorage.getItem("user")) {
        //     //     console.log('Not logged in')
        //     //     return history('/login')
        //     // }
        //     // else {

        //     // a.find(({user})=>user === '6245cdd699b2268d8bccc4ce')

        //     // profile && console.log((profile?.followers)?.find(({user}) => user === loggedinUser?.profile.user), 'current user is following?');
        profile && setFollow((profile?.followers)?.find(({ _id }) => _id === logginUserData?.profile._id))

        //     // eslint-disable-next-line
    }, []);

    // const profileSet = () => {
    //     fetch(`${url}/api/v1/users/${userId}`).then(res => res.json()).then(data => {
    //         setData(data)
    //         // console.log(profile);
    //         // console.log(profile?.followers);
    //         // console.log(follow);
    //     })
    // }

    const followUser = () => {
        setFollow(!follow);
        fetch(`${URL}/api/v1/notification/`, {
            method: "POST",
            body: JSON.stringify({
                from: `${JSON.parse(localStorage.getItem("user")).profile._id}`,
                to: `${profile.user}`,
                text: `has ${follow ? "Unfollowed" : "Followed"} you.`,
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
                profileSet();
            });
    };

    function showFollowers() {
        // console.log('opening followeres list')
        setModelOpen(true);
        return (
            <Modal modelOpen={modelOpen} setModelOpen={setModelOpen}>
                followers list
            </Modal>
        );
    }

    function showFollowing() {
        setModelOpen(true);

        return (
            <Modal modelOpen={modelOpen} setModelOpen={setModelOpen}>
                {"followings list"}
            </Modal>
        );
    }

    function stringAvatar(name) {
        return {
            sx: {
                bgcolor: stringToColor(name),

                display: "flex",
                justifyContent: "center",
                width: 100,
                height: 100,
                mt: -8,
            },
            children: name.charAt(0) || "U",
        };
    }

    return (
        <>
            <SEO
                title={`${profile?.name ?? ""} || @${profile?.username ?? ""} || Dev Blog Profile`}
                desc={`${profile.username} About.`}
                kw="Blog | Dev Blog | ideas | content"
            />
            {/* <Head title={`${profile?.name ?? ""} || @${profile?.username ?? ""} || Dev Blog Profile`} /> */}
            <Container sx={{ mt: 3 }} component="main">
                <Paper sx={{ p: 2 }}>
                    <Typography sx={{ m: 1 }}>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                if (history.back()) {
                                    history.back();
                                }
                                history.push("/");
                            }}
                            color="inherit"
                            startIcon={<ArrowBackIosNewIcon />}
                        >
                            Go back
                        </Button>
                    </Typography>

                    {false ? (
                        <SkeletonPage />
                    ) : (
                        <>
                            {profile && (
                                <Card>
                                    {true ? (
                                        <Skeleton
                                            sx={{ height: 190 }}
                                            animation="wave"
                                            variant="rectangular"
                                        />
                                    ) : (
                                        <CardMedia
                                            component="img"
                                            height="240"
                                            image="https://source.unsplash.com/random/300x200"
                                            alt="green iguana"
                                            loading="lazy"
                                        />
                                    )}
                                    <CardContent>
                                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                                            <Avatar
                                                onClick={(e) => setModelOpen(true)}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    width: 100,
                                                    height: 100,
                                                    mt: -8,
                                                }}
                                                loading="lazy"
                                                src={profile?.Profile_pic}
                                                alt="Username"
                                                {...stringAvatar(
                                                    profile?.username ? profile?.username : "Abc"
                                                )}
                                            />
                                        </Box>

                                        {logginUserData?.profile?._id === userId && (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "end",
                                                    position: "relative",
                                                    top: "-39px",
                                                    right: "-1%",
                                                }}
                                            >
                                                {/* <Upload profile={profile} user={userId} /> */}
                                            </Box>
                                        )}

                                        {/* <Modal title='Profile Pic' modelOpen={modelOpen} setModelOpen={setModelOpen}  {...'dsd'} /> */}

                                        {/* Profile data goes here */}

                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                            <Stack
                                                sx={{ my: 2, width: "50%" }}
                                                direction="row"
                                                justifyContent="center"
                                                alignItems="center"
                                                spacing={22}
                                            >
                                                <span>@{profile?.username}</span>
                                                <Stack
                                                    direction="row"
                                                    sx={{ m: 0, ml: 0 }}
                                                    style={{ margin: 0, marginLeft: "90px" }}
                                                    className="this"
                                                // sx={{ ml: { xs: '90px', md: '176px' }, margin: { xs: 0, md: 'auto' } }}
                                                >
                                                    <Stack
                                                        sx={{ cursor: "pointer" }}
                                                        direction="column"
                                                        justifyContent="center"
                                                        alignItems="center"
                                                        role="button"
                                                        onClick={() => {
                                                            showFollowers();
                                                        }}
                                                    >
                                                        <Typography>
                                                            {profile?.followers?.length}
                                                        </Typography>
                                                        <Divider variant="middle" sx={{ width: "100%" }} />

                                                        <Typography>Followers</Typography>
                                                    </Stack>
                                                    <Stack
                                                        sx={{ cursor: "pointer" }}
                                                        direction="column"
                                                        justifyContent="center"
                                                        alignItems="center"
                                                        role="button"
                                                        onClick={() => {
                                                            showFollowing();
                                                        }}
                                                    >
                                                        {/* <div> */}

                                                        <Typography>
                                                            {profile?.following?.length}
                                                        </Typography>
                                                        <Divider variant="middle" sx={{ width: "100%" }} />

                                                        <Typography>Following</Typography>
                                                        {/* </div> */}
                                                    </Stack>
                                                </Stack>
                                            </Stack>

                                            <Modal
                                                title="Friends"
                                                modelOpen={modelOpen}
                                                setModelOpen={setModelOpen}
                                            >
                                                <BasicTabs
                                                    followers={profile?.followers}
                                                    following={profile?.following}
                                                />
                                            </Modal>
                                        </div>
                                        {logginUserData && logginUserData?.profile?._id !== userId && (
                                            <Stack
                                                sx={{ my: 2 }}
                                                direction="row"
                                                justifyContent="center"
                                                alignItems="center"
                                                spacing={2}
                                            >
                                                {follow ? (
                                                    <Button variant="contained" onClick={followUser}>
                                                        Unfollow
                                                    </Button>
                                                ) : (
                                                    <Button variant="text" onClick={followUser}>
                                                        Follow
                                                    </Button>
                                                )}
                                                {/* <Button variant={
                                            follow !== null ?
                                                'contained'
                                                : 'text'
                                        }
                                            onClick={followUser}>{follow !== null ? 'Unfollow' : 'Follow'}</Button> */}

                                                <Button variant="outlined">Message</Button>
                                            </Stack>
                                        )}
                                        <Stack gap={3}>
                                            <Stack direction="row" alignItems="center" gap={3}>
                                                <Typography>Name:</Typography>
                                                {profile && profile?.name}
                                            </Stack>
                                            <Stack direction="row" alignItems="center" gap={3}>
                                                <Typography>Email:</Typography>
                                                {profile && profile?.email}
                                            </Stack>
                                            <Stack direction="row" alignItems="center" gap={3}>
                                                <Typography>Number:</Typography>
                                                {profile && profile?.number}
                                            </Stack>
                                            {/* <Upload user={userId} /> */}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    )}
                </Paper>
            </Container>
        </>
    );
};

export default UserProfile;

export async function getServerSideProps(context) {
    const { id } = context.params;
    // export async function getStaticProps() {
    const res = await fetch(
        `https://mernblog.azurewebsites.net/api/v1/users/${id}`
    );
    const profile = await res.json();
    console.log(profile, "profile llll");

    // Pass data to the page via props
    return { props: { profile } };
}
