import React, {useCallback} from "react";
import {createContext, useContext, useEffect, useState} from 'react';
import jwt_decode from "jwt-decode";

const AuthContext = createContext();

function getUser(token) {
    (token && jwt_decode(token))
}

function AuthProvider({children}) {

    const [authTokens, setAuthTokens] = useState();

    const [state, setState] = useState({
        status: 'pending'
    })

    const removeTokens = useCallback(() => {
        localStorage.removeItem("tokens");

        setState({
            status: 'success',
            error: null,
            user: null,
            token: authTokens,
        })
    }, [authTokens]);

    const setTokens = useCallback((data) => {
        localStorage.setItem("tokens", data);
        setAuthTokens(data);
        const user = getUser(data);
        setState({
                status: 'success',
                error: null,
                user: user,
                token: data,
            }
        );
    }, []);

    useEffect(() => {
        const user = getUser(localStorage.getItem("tokens"));
        setState({
                status: 'success',
                error: null,
                user: user,
                token: localStorage.getItem("tokens"),
                removeTokens,
                setTokens
            }
        );
    }, [removeTokens, setTokens])

    return (
        <AuthContext.Provider value={state}>
            {state.status === 'pending' ? (
                'Loading...'
            ) : state.status === 'error' ? (
                <div>
                    Oh no
                    <div>
                        <pre>{state.error.message}</pre>
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    )
}

function useAuth() {
    const state = useContext(AuthContext)
    const isPending = state.status === 'pending'
    const isError = state.status === 'error'
    const isSuccess = state.status === 'success'
    const isAuthenticated = state.user && isSuccess
    return {
        ...state,
        isPending,
        isError,
        isSuccess,
        isAuthenticated,
    }
}

export {AuthProvider, useAuth, getUser}