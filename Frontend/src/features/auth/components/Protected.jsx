import { useAuth } from "../hooks/useAuth"
import { Navigate } from "react-router"

import React from 'react'

const Protected = ({children}) => {
    const { loading, user} = useAuth()

    if(loading) {
        return (<main><h1>Loading...</h1></main>)
    }

    if(!user){
        // user doesn't exist, means user is not logged in yet
        return <Navigate to={'/login'} />
    }

    return children
}

export default Protected
