import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { db, firebaseInit } from '../../config/firebase'
import { amountToCents } from '../../utils/amount'
import { oneYearBefore } from '../../utils/date'
import { getData } from '../../utils/getPrice'
import { taxCalculator } from '../../utils/taxCalculator'

// TODO: add loading
export const Dashboard = () => {
    const [data, setData] = useState({})
    const [priceList, setPriceList] = useState({})
    const [totalEarn, setTatalEarn] = useState({ short: 0, long: 0 })
    
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
        const listObj = {}

        if (Object.keys(priceList).length === 0) {
            data.stocks && data.stocks.map(stock => {
                if (!(stock.ticker in priceList)) {
                    return getData(stock.ticker).then(t => {
                        listObj[stock.ticker] = t.results ? t.results[0].c : 'maximum request'
                    })
                }
            })
    
            // TODO: remove setTimeout and add loading while get data
            setTimeout(() => setPriceList(listObj), 2000)
        }
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

    const sellAmount = (e, idx) => {
        const amount = e.target.value
        data.stocks[idx].sellAmount = amount
        
        setData({
            ...data
        })

        const shortTerm = data.stocks.filter(stock => oneYearBefore() < new Date(stock.boughtDate))
        const longTerm = data.stocks.filter(stock => oneYearBefore() >= new Date(stock.boughtDate))

        const earnArray = termArray => termArray.map(stock => {
            const sellAmount = stock.sellAmount ? stock.sellAmount : 0
            return (priceList[stock.ticker] - stock.baseCost) * sellAmount
        })

        const sum = arr => arr.reduce((total, num) => total + num)

        const shortTermTotalEarn = sum(earnArray(shortTerm))
        const longTermTotalEarn = sum(earnArray(longTerm))

        setTatalEarn({ long: longTermTotalEarn, short: shortTermTotalEarn })
    }

    const longTermTotalTax = taxCalculator({ 
        term: 'long',
        status: data.status && (data.status).toLowerCase(),
        earned: totalEarn.long
    })

    const shortTermTotalTax = taxCalculator({ 
        term: 'short',
        status: data.status && (data.status).toLowerCase(),
        earned: totalEarn.short
    })

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
                            <td>Short/long term</td>
                            <td>Cost basis</td>
                            <td>Sell stock amount</td>
                            <td>Gain</td>
                            <td>Tax</td>
                            <td>After tax cashflow</td>
                        </tr>
                    </thead>
                    <tbody>
                        {data.stocks && data.stocks.map((stock, idx) => {
                            const price = priceList[stock.ticker]
                            const gain = (price - stock.baseCost) * (stock.sellAmount ? stock.sellAmount : 0)

                            const tax = oneYearBefore() < new Date(stock.boughtDate) ? (
                                totalEarn.short && gain ? amountToCents(gain / totalEarn.short * shortTermTotalTax) : 0
                            ) : (
                                totalEarn.long && gain ? amountToCents(gain / totalEarn.long * longTermTotalTax) : 0
                            )

                            return (
                                <tr key={idx}>
                                    <td>{stock.ticker}</td>
                                    <td>{price ? price : 'loading...'}</td>
                                    <td>{stock.amount}</td>
                                    <td>{price ? amountToCents(price * stock.amount) : 'loading...'}</td>
                                    <td>{oneYearBefore() < new Date(stock.boughtDate) ? 'Short' : 'Long'}</td>
                                    <td>{amountToCents(stock.baseCost)}</td>
                                    <td><input type="number" onChange={(e) => sellAmount(e, idx)} /></td>
                                    <td>{amountToCents(gain)}</td>
                                    <td>{tax}</td>
                                    <td>{amountToCents(gain - tax)}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <div>
                    <h3>Total Earned</h3>
                    <div>
                        long: {totalEarn.long}
                    </div>
                    <div>
                        short: {totalEarn.short}
                    </div>
                    <h3>Your estimated tax</h3>
                    <div>
                        Total tax:{' '}
                        {longTermTotalTax + shortTermTotalTax}
                    </div>
                    <div>
                        long:{' '}
                        {longTermTotalTax}
                    </div>
                    <div>
                        short:{' '}
                        {shortTermTotalTax}
                    </div>
                </div>
            </div>
        </div>
    )
}