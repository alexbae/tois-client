import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Stock } from '../../components/Stock'
import { db, firebaseInit } from '../../config/firebase'
import { getPrice } from '../../utils/getPrice'

// TODO: add loading
export const Dashboard = () => {
    const [data, setData] = useState({})
    const [priceList, setPriceList] = useState({})
    
    const history = useHistory()
    const user = firebaseInit.auth().currentUser

    useEffect(() => {
        data.stocks && data.stocks.map(stock => {
            console.log('test', stock.ticker)
            setPriceList({
                ...priceList,
                [stock.ticker]: stock.ticker
            })
        })
    }, [data])

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
    }, [user])

    // TODO: move to util
    const signOut = () => {
        firebaseInit.auth().signOut()
            .then(() => {
                console.log('signed out')
                history.push('/')
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                
                console.log(errorCode, errorMessage)
            })
    }

    console.log(priceList)

    return (
        <div>
            <div>
                hello, {user ? user.email : ''}
                <button onClick={signOut}>Sign out</button>
            </div>
            <hr />
            <div>
                <Link to="/stocks">Add your stocks</Link>
                <h1>Your info</h1>
                <p>
                    otherIncome: {data.otherIncome}
                </p>
                <p>
                    status: {data.status}
                </p>
                <p>
                    deduction: {data.deduction}
                </p>
                <table>
                    <thead>
                        <tr>
                            <td>Symbol</td>
                            <td>Price</td>
                            <td>Amount</td>
                            <td>Total</td>
                        </tr>
                    </thead>
                    <tbody>
                        {data.stocks && data.stocks.map((stock, idx) => {
                            return (
                                <tr key={idx}>
                                    <td>{stock.ticker}</td>
                                    <td><Stock ticker={stock.ticker} /></td>
                                    <td>{stock.amount}</td>
                                    <td></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}