import React from 'react'

export const UserInfo = ({ data }) => {
    return (
        <div>
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
        </div>
    )
}