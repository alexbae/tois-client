import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import { firebaseInit } from '../../config/firebase'
import { useLogStatus, STATUS } from '../../utils/useLogStatus'

export const Signup = () => {
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

    const signup = e => {
        e.preventDefault()
        firebaseInit.auth().createUserWithEmailAndPassword(form.email, form.password)
            .then(() => {
                console.log('signed up')
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                
                console.log(errorCode, errorMessage)
            })
    }

    const login = ()  => {
        history.push('/login')
    }

    return (
        <div>
            <h1>Signup</h1>
            <div>
                <form>
                    <div>
                        <input type="email" name="email" placeholder="email" onChange={updateField} />
                    </div>
                    <div>
                        <input type="password" name="password" placeholder="password" onChange={updateField} />
                    </div>
                    <div>
                        <button onClick={signup}>signup</button>
                    </div>
                </form>
            </div>
            <hr />
            <div>
                <button onClick={login}>Already have an account?</button>
            </div>
        </div>
    )
}