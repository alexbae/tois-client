import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { db, firebaseInit } from '../../config/firebase'

export const BasicInfo = () => {
    const [form, setForm] = useState({
        otherIncome: 0,
        status: '',
        deduction: '',
    })

    const history = useHistory()
    const user = firebaseInit.auth().currentUser

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
            }).then(() => {
                history.push('/dashboard')
            })
        }
    }

    return (
        <div>
            <h1>Edit your info</h1>
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
                        <option value="Married">Married</option>
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
                <button onClick={updateDoc}>submit</button>
            </form>
        </div>
    )
}
