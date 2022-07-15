import React, { useEffect } from 'react'
import { AuthenticationProvider } from '../context/AuthenticationProvider'
import { useGlobal } from '../context/GlobalItemsProvider'
import { Navbar } from './Navbar'
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from '@mui/material';
import LoadingBar from 'react-top-loading-bar'
import { Router } from 'next/router';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SocketProvider } from "../context/socketProider";
import { ConversatioinsProvider } from '../context/ConversatioinsProvider';
import styles from "../../styles/Home.module.css";

export const App = ({ Component, pageProps }) => {
    let { darkTheme, topBarProgress, setTopBarProgress, loadingBarColor } = useGlobal()

    useEffect(() => {

        const start = () => {
            // console.log("start");
            setTopBarProgress(20)

            // setLoading(true);
        };
        const end = () => {
            setTopBarProgress(100)

            // console.log("findished");
            // setLoading(false);
        };
        Router.events.on("routeChangeStart", start);
        Router.events.on("routeChangeComplete", end);

        return () => {

        }
    }, [])

    // set loading bar color with 4 changing colors with time


    return (
        <>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
                <SocketProvider>
                    <ConversatioinsProvider>
                        <AuthenticationProvider>
                            <ThemeProvider theme={darkTheme}>
                                <CssBaseline />
                                <LoadingBar color={loadingBarColor()} height={3.5} progress={topBarProgress} waitingTime={200} />
                                <Navbar />
                                <React.Suspense fallback="loading">
                                    <Component {...pageProps} />
                                </React.Suspense>
                                {/* <footer className={styles.footer}>
                                    All Rights reserved by Dev Blog
                                </footer> */}
                            </ThemeProvider>
                        </AuthenticationProvider>
                    </ConversatioinsProvider>
                </SocketProvider>
            </GoogleOAuthProvider>
        </>
    )
}
