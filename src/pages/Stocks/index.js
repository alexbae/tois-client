import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { db, firebaseInit } from '../../config/firebase'

export const Stocks = () => {
    const [data, addData] = useState({})
    const [stockRows, addStockRow] = useState([])
    const [update, setUpdate] = useState(1)
    const stockForm = {
        ticker: '',
        amount: 0,
        baseCost: 0,
        boughtDate: '',
    }

    const history = useHistory()
    const user = firebaseInit.auth().currentUser

    useEffect(() => {
        if (user) {
            db.collection("users").doc(user.uid).get()
                .then(doc => {
                    if (doc.exists) {
                        addData(doc.data())
                    } else {
                        history.push('/info')
                    }
                })
                .catch(err => console.log('error', err))
        }
    }, [user, history])

    useEffect(() => {
        if (data.stocks && data.stocks.length) {
            addStockRow([ ...data.stocks ])
        }
    }, [data])

    const updateStockField = (e, idx) => {
        let currentStockRows = stockRows

        currentStockRows[idx][e.target.name] = e.target.value

        addStockRow(currentStockRows)
    }

    const addRow = e => {
        e.preventDefault()
        // Row만 Add 되어야됨
        addStockRow([ ...stockRows, stockForm ])
    }

    const removeRow = (e, idx) => {
        e.preventDefault()
        let currentStockRows = stockRows

        currentStockRows.splice(idx, 1)

        addStockRow(currentStockRows)
        setUpdate(update + 1)
    }

    const updateDoc = e => {
        e.preventDefault()

        if (user) {
            db.collection('users').doc(user.uid).set({
                ...data,
                stocks: stockRows
            }).then(() => {
                history.push('/dashboard')
            })
        }
    }

    const FormFields = ({ stock, idx }) => {
        return (
            <div key={`stock-${idx}`}>
                <label>Ticker</label>
                <input type="text" onChange={(e) => updateStockField(e, idx)} name="ticker" placeholder="ticker" defaultValue={stock.ticker ? stock.ticker : ''} />
                <label>Amount</label>
                <input type="number" onChange={(e) => updateStockField(e, idx)} name="amount" placeholder="amount" defaultValue={stock.amount ? stock.amount : 1} />
                <label>Cost basis</label>
                <input type="number" onChange={(e) => updateStockField(e, idx)} name="baseCost" placeholder="baseCost" defaultValue={stock.baseCost ? stock.baseCost : 0} />
                <label>Purchase date</label>
                <input type="date" onChange={(e) =>updateStockField(e, idx)} name="boughtDate" placeholder="boughtDate" defaultValue={stock.boughtDate ? stock.boughtDate : ''} />
                <button onClick={e => removeRow(e, idx)}>Remove</button>
            </div>
        )
    }

    console.log('stockrow', stockRows)

    return (
        <div>
            <Link to="/dashboard">Back to dashboard</Link>
            <h1>Add/Edit your stocks</h1>
            <p>{update}</p>
            <form>
                <div>
                    <label>Add your stocks</label><br />
                    {stockRows.map((stock, idx) => (
                        <FormFields key={idx} idx={idx} stock={stock} />
                    ))}
                    <button onClick={addRow}>add item</button>
                </div>
                <button onClick={updateDoc}>Update</button>
            </form>
        </div>
    )
}