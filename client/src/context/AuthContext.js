import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

const AuthContext = createContext("");

function AuthContextProvider(props) {
    console.log(props);
    const [loggedIn, setLoggedIn] = useState(undefined);

    async function getLoggedIn() {
        const url = "http://localhost:5000/auth/loggedIn";

        try {
            const loggedInRes = await axios.get(url);
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
