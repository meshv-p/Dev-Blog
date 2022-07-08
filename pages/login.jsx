import React, { useEffect, useState } from 'react'
import { Avatar, Box, Container, Grid, Snackbar, TextField, Typography } from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import blogContext from '../Context/BlogContext';
// import { Link, useNavigate } from 'react-router-dom';
import MuiAlert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useGlobal } from '../src/context/GlobalItemsProvider';
// import { Head } from '../Compo/Head';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../src/context/AuthenticationProvider';


const Login = () => {
    let history = useRouter()
    let { URL } = useGlobal();
    let { loginUser } = useAuth()
    const [loginDetails, setLoginDetails] = useState({ username: "", password: "", remember: true })
    const [loginError, setLoginError] = useState(null)
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        if (JSON.parse(localStorage.getItem("user"))) {
            history.push("/")
        }
    }, [])



    const handleSubmit = async (e, token = null) => {
        setLoading(true)
        let data = token !== null ? { token } : loginDetails
        let res = await fetch(`${URL}/api/v1/users/login/`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        }).catch(err => {
            setLoginError({ type: 'error', msg: err.message })
            setOpen(true)
            setLoading(false)
        });
        let status = await res.json()
        if (res.status === 200) {
            setLoading(false)
            loginUser(status)
            setLoginError({ type: "success", msg: "Logged in success." })

            // loginDetails.remember && localStorage.setItem('user', JSON.stringify(status))
            // !loginDetails.remember && sessionStorage.setItem('user', JSON.stringify(status))

            history.push('/')
        } else {
            setLoading(false)

            setLoginError({ type: "error", msg: status.msg })
            setOpen(true)
            // await console.log(loginError);
        }


    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    const responseGoogle = async (authResult) => {
        console.log(authResult)
        handleSubmit("", authResult.credential)
    };

    return (
        <>
            <Container component="main" maxWidth="xs">
                {/* <Head title='Login to Dev blog' /> */}
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="name"
                            autoFocus
                            value={loginDetails.username}
                            onChange={(e) => setLoginDetails({ ...loginDetails, [e.target.name]: e.target.value })}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={loginDetails.password}
                            onChange={(e) => setLoginDetails({ ...loginDetails, [e.target.name]: e.target.value })}
                        />
                        <FormControlLabel
                            name='remember'
                            checked={loginDetails.remember}
                            onChange={e => setLoginDetails({ ...loginDetails, [e.target.name]: e.target.checked })}
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <LoadingButton
                            onClick={handleSubmit}
                            loading={loading}
                            loadingPosition="end"
                            variant="contained"
                            fullWidth
                            sx={{ mt: 3, mb: 2 }}
                            endIcon={<LockOutlinedIcon />}
                        >
                            sign in
                        </LoadingButton>

                        <GoogleLogin
                            // onSuccess={credentialResponse => {
                            //     console.log(credentialResponse);
                            //     console.log(jwtDecode(credentialResponse.credential))
                            // }}
                            onSuccess={responseGoogle}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                        />
                        <Grid container>
                            <Grid item xs>
                                <Link href="/password/reset" variant="body2" color='blue'>
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/signup" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <Alert onClose={handleClose} severity={loginError?.type} sx={{ width: '100%' }}>
                        {loginError?.msg}
                    </Alert>
                </Snackbar>
            </Container>
        </>
    )
}

export default Login