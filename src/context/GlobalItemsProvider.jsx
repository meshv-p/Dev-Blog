import { createTheme } from '@mui/material';
import React, { createContext, useContext, useEffect, useState } from 'react'

const GlobalContext = createContext()

export const useGlobal = () => useContext(GlobalContext)

export const GlobalItemsProvider = ({ children }) => {
    // All States
    const [theme, setTheme] = useState(false);
    const [topBarProgress, setTopBarProgress] = useState(0);

    const [searchData, setSearchData] = useState([]);
    const [search, setSearch] = React.useState("");
    const [alignment, setAlignment] = React.useState("title");

    // edit Blog
    const [editBlog, setEditBlog] = useState(null);

    //UseEffects
    useEffect(() => {
        if (localStorage.getItem("Theme")) {
            let getTheme = JSON.parse(localStorage.getItem("Theme"));
            setTheme(getTheme);
        }

    }, [])



    // All Const
    const URL = process.env.NEXT_PUBLIC_URL;
    const L_URL = process.env.NEXT_LOCAL_URL;


    // All functions
    const toggleTheme = () => {
        setTheme(!theme);
        localStorage.setItem("Theme", !theme);
    };

    const darkTheme = createTheme({
        palette: {
            mode: theme ? "light" : "dark",
            primary: {
                main: "#1976d2",
            },
        },
    });

    const loadingBarColor = () => {
        // let colors = ["#00bcd4", "#009688", "#4caf50", "#8bc34a"]
        let colors = ["#00bcd4", "#009688", "#4caf50", "#3cba54", '#f4c20d', '#db3236', 'black']
        // let colors = ["green", "blue", "pink", "black"]

        // changes color every time with time
        // setInterval(() => {
        let random = Math.floor(Math.random() * colors.length);

        // console.log(colors[random], random);
        // setTopBarProgress(random);

        return colors[random];
        // }, 1000);

        // return 'red'
    }


    let value = {
        //States
        theme,
        setTheme,
        topBarProgress,
        setTopBarProgress,
        search,
        setSearch,
        searchData,
        setSearchData,
        alignment,
        setAlignment,
        editBlog,
        setEditBlog,


        //Function
        toggleTheme,
        loadingBarColor,

        //Const
        darkTheme,
        URL,
        L_URL
    }
    return (
        <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
    )
}
