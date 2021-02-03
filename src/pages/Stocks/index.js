import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { db, firebaseInit } from '../../config/firebase'

export const Stocks = () => {
    const [data, setData] = useState({})
    const [stockForm, setStockForm] = useState({
        ticker: '',
        amount: 0,
        baseCost: 0,
        boughtDate: '',
    })

    const [stockRows, addStockRow] = useState([])

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
    }, [user])

    const updateStockField = e => {
        setStockForm({
            ...stockForm,
            [e.target.name]: e.target.value
        })
    }

    const addRow = e => {
        e.preventDefault()

        addStockRow([ ...stockRows, stockForm ])
    }

    const updateDoc = e => {
        e.preventDefault()

        if (user) {
            db.collection('users').doc(user.uid).set({
                ...data,
                stocks: stockRows
            }).then(() => {
                console.log('added')
            })
        }
    }

    return (
        <div>
            <Link to="/dashboard">Back to dashboard</Link>
            <h1>Add your stocks</h1>
            <form>
                <div>
                    <label>Add your stocks</label><br />
                    <input type="text" onChange={updateStockField} name="ticker" placeholder="ticker" />
                    <input type="number" onChange={updateStockField} name="amount" placeholder="amount" />
                    <input type="number" onChange={updateStockField} name="baseCost" placeholder="baseCost" />
                    <input type="date" onChange={updateStockField} name="boughtDate" placeholder="boughtDate" />
                    {stockRows.map((_, idx) => (
                        <div key={`stock-${idx}`}>
                            <input type="text" onChange={updateStockField} name="ticker" placeholder="ticker" />
                            <input type="number" onChange={updateStockField} name="amount" placeholder="amount" />
                            <input type="number" onChange={updateStockField} name="baseCost" placeholder="baseCost" />
                            <input type="date" onChange={updateStockField} name="boughtDate" placeholder="boughtDate" />
                        </div>
                    ))}
                    <button onClick={addRow}>add item</button>
                </div>
                <button onClick={updateDoc}>submit</button>
            </form>
        </div>
    )
}