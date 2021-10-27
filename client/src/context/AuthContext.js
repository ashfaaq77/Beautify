import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

import serverRoutes from "../points";
import createServerUrl from "../inc/functions";

const AuthContext = createContext("");

function AuthContextProvider(props) {

    const [loggedIn, setLoggedIn] = useState(undefined);

    async function getLoggedIn() {
        const url = createServerUrl(serverRoutes.loggedIn);

        try {
            const loggedInRes = await axios.get(url);
            // if (loggedInRes.data === false) {
            //     window.location.href = 'ttp://localhost:3000/login';
            // }
            setLoggedIn(loggedInRes.data);
        } catch (e) {
            console.log(e);
        }

    }

    useEffect(() => {
        getLoggedIn();
    }, []);

    return (
        <AuthContext.Provider value={{ loggedIn, getLoggedIn }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };
