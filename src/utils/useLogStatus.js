import { useState } from 'react'
import { firebaseInit } from '../config/firebase'

export const STATUS = {
    LOGGING: 'logging',
    LOGGED_IN: 'loggedIn',
    LOGGED_OUT: 'loggedOut'
}

export const useLogStatus = () => {
    const [status, setStatus] = useState(STATUS.LOGGING);

    firebaseInit.auth().onAuthStateChanged(user => {
        if (user) {
            setStatus(STATUS.LOGGED_IN)
        } else {
            setStatus(STATUS.LOGGED_OUT)
        }
    })
    
    return status
}