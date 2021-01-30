import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Stock } from '../../components/Stock'
import { db, firebaseInit } from '../../config/firebase'

export const Dashboard = () => {
    const [form, setForm] = useState({
        otherIncome: 0,
        status: '',
        deduction: '',
        stock: ''
    })

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
                        console.log('no doc!')
                    }
                })
                .catch(err => console.log('error', err))
        }
    }, [user])

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

    const updateField = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const updateDoc = e => {
        e.preventDefault()

        if (user) {
            db.collection('users').doc(user.uid).set({
                otherIncome: Number(form.otherIncome),
                status: form.status,
                deduction: form.deduction,
                stock: form.stock
            }).then(() => {
                history.go(0)
            })
        }
    }

    return (
        <div>
            <div>
                hello, {user ? user.email : ''}
                <button onClick={signOut}>Sign out</button>
            </div>
            <hr />
            <div>
                <h3>Edit your info</h3>
                <form>
                    <div>
                        <label>Other income</label><br />
                        <input type="number" onChange={updateField} name="otherIncome" />
                    </div>
                    <div>
                        <label>Status</label><br />
                        <select defaultValue="" onChange={updateField} name="status">
                            <option value="" disabled>Select one</option>
                            <option value="Single">Single</option>
                            <option value="Head of household">Head of Household</option>
                            <option value="Married filling jointly">Married Filing Jointly</option>
                            <option value="Married filing separately">Married Filing Separately</option>
                            <option value="Qualifying window(er)">Qualifying Widow(er)</option>
                        </select>
                    </div>
                    <div>
                        <label>Deduction</label><br />
                        <select defaultValue="" onChange={updateField} name="deduction">
                            <option value="" disabled>Select one</option>
                            <option value="Itemized" defaultValue>Itemized</option>
                            <option value="Standard">Standard</option>
                        </select>
                    </div>
                    <div>
                        <label>Add your stocks</label><br />
                        <input type="text" onChange={updateField} name="stock" />
                    </div>
                    <button onClick={updateDoc}>submit</button>
                </form>
            </div>
            <hr />
            <div>
                <h3>Your info</h3>
                <p>
                    otherIncome: {data.otherIncome}
                </p>
                <p>
                    status: {data.status}
                </p>
                <p>
                    deduction: {data.deduction}
                </p>
                <p>
                    stock: {data.stock}
                </p>
                <div>
                    {data.stock && (
                        <Stock ticker={data.stock} />
                    )}
                </div>
            </div>
        </div>
    )
}