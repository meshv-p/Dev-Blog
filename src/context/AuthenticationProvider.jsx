import React, { createContext, useContext, useEffect, useState } from 'react'


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext)



export const AuthenticationProvider = ({ children }) => {
    const [logginUserData, setLogginUserData] = useState([])

    function loginUser(data) {
        /**
         * @param data : JSON
         *      {
         *              authToken,user-Profile
         *      }
         */
        localStorage.setItem('user', JSON.stringify(data));

        setLogginUserData(data);

        return

    }

    function logoutUser() {
        try {
            localStorage.removeItem('user');
        } catch (error) {
            console.error(error?.message);
        }

    }

    useEffect(() => {
        if (localStorage.getItem("user")) {
            // console.log(JSON.parse(localStorage.getItem("user")));
            setLogginUserData(
                JSON.parse(localStorage.getItem("user")) ||
                JSON.parse(sessionStorage.getItem("user"))
            );
        }

        return () => {

        }
    }, [])


    let value = {
        // States
        logginUserData,
        setLogginUserData,

        // Functions
        loginUser,
        logoutUser
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
