import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { db, firebaseInit } from '../../config/firebase'
import { signOut } from '../../utils/signOut'
import { UserInfo } from '../../components/UserInfo'
import { StockTable } from '../../components/StockTable'

// TODO: add loading
export const Dashboard = () => {
    const [data, setData] = useState({})
    const history = useHistory()
    const user = firebaseInit.auth().currentUser

    useEffect(() => {
        if (user) {
            db.collection("users").doc(user.uid).get()
                .then(doc => {
                    if (doc.exists) {
                        setData(doc.data())
                    } else {
                        history.push('/info')
                    }
                })
                .catch(err => console.log('error', err))
        }
    }, [user, history])

    return (
        <div>
            <div>
                hello, {user ? user.email : ''}
                <button onClick={() => signOut(history)}>Sign out</button>
            </div>
            <hr />
            <div>
                <Link to="/stocks">Add your stocks</Link>
                <UserInfo data={data} />
                <StockTable data={data} />
            </div>
        </div>
    )
}