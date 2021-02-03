import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { db, firebaseInit } from '../../config/firebase'
import { oneYearBefore } from '../../utils/date'
import { getData } from '../../utils/getPrice'

// TODO: add loading
export const Dashboard = () => {
    const [data, setData] = useState({})
    const [priceList, setPriceList] = useState({})
    
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

    useEffect(() => {
        let stockObj = {}

        data.stocks && data.stocks.map(stock => {
            return getData(stock.ticker).then(t => {
                stockObj[stock.ticker] = t.results ? t.results[0].c : 'maximum request'
            })
        })

        const setPrice = setInterval(() => {
            if (stockObj) {
                setPriceList(stockObj)
                clearInterval(setPrice)
            }
        }, 1000)

        return setPrice
    }, [data])

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
                            <td>Bought date</td>
                            <td>Short/long term</td>
                        </tr>
                    </thead>
                    <tbody>
                        {data.stocks && data.stocks.map((stock, idx) => {
                            const price = priceList[stock.ticker]
console.log('test', new Date(stock.boughtDate))
                            return (
                                <tr key={idx}>
                                    <td>{stock.ticker}</td>
                                    <td>{price ? price : 'loading...'}</td>
                                    <td>{stock.amount}</td>
                                    <td>{price ? (price * stock.amount) : 'loading...'}</td>
                                    <td>{stock.boughtDate}</td>
                                    <td>{oneYearBefore() < new Date(stock.boughtDate) ? 'Short' : 'Long'}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}