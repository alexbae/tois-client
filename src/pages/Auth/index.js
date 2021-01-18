import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import { firebaseInit } from '../../config/firebase'
import { useLogStatus, STATUS } from '../../utils/useLogStatus'

export const Auth = () => {
    const [ form, setState ] = useState({ email: "", password: "" })
    const history = useHistory()
    const status = useLogStatus()

    useEffect(() => {
        if (status === STATUS.LOGGED_IN) {
            history.push('/dashboard')
        }
    })

    const updateField = e => {
        setState({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const login = e => {
        e.preventDefault()
        firebaseInit.auth().signInWithEmailAndPassword(form.email, form.password)
            .then(() => {
                console.log('logged in')
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                
                console.log(errorCode, errorMessage)
            })
    }

    const createAccount = () => {
        history.push('/signup')
    }

    return (
        <div>
            <h1>Login</h1>
            <div>
                <form>
                    <div>
                        <input type="email" name="email" placeholder="email" onChange={updateField} />
                    </div>
                    <div>
                        <input type="password" name="password" placeholder="password" onChange={updateField} />
                    </div>
                    <div>
                        <button onClick={login}>login</button>
                    </div>
                </form>
            </div>
            <hr />
            <div>
                <button onClick={createAccount}>Create new account</button>
            </div>
        </div>
    )
}