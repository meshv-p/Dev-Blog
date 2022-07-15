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

        //Const
        darkTheme,
        URL,
        L_URL
    }
    return (
        <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
    )
}
