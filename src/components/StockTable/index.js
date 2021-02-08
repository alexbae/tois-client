import React, { useState, useEffect } from 'react'
import { getData } from '../../utils/getPrice'
import { oneYearBefore } from '../../utils/date'
import { taxCalculator } from '../../utils/taxCalculator'
import { amountToCents, numberWithCommas } from '../../utils/amount'
import { sum } from '../../utils/sum'
import { getEarnArray } from '../../utils/getEarnArray'

export const StockTable = ({ data }) => {
    const [priceList, setPriceList] = useState({})
    const [totalEarn, setTatalEarn] = useState({ short: 0, long: 0 })

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

    const sellAmount = (e, idx) => {
        const amount = e.target.value
        // TODO : anti-pattern
        data.stocks[idx].sellAmount = amount

        const shortTerm = data.stocks.filter(stock => oneYearBefore() < new Date(stock.boughtDate))
        const longTerm = data.stocks.filter(stock => oneYearBefore() >= new Date(stock.boughtDate))

        const shortTermTotalEarn = sum(getEarnArray(shortTerm, priceList))
        const longTermTotalEarn = sum(getEarnArray(longTerm, priceList))

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
                        <td>Estimated gain</td>
                        <td>Estimated tax</td>
                        <td>Estimated After tax cashflow</td>
                    </tr>
                </thead>
                <tbody>
                    {data.stocks && data.stocks.map((stock, idx) => {
                        const price = priceList[stock.ticker]
                        const gain = (price - stock.baseCost) * (stock.sellAmount ? stock.sellAmount : 0)

                        const tax = oneYearBefore() < new Date(stock.boughtDate) ? (
                            totalEarn.short && gain ? gain / totalEarn.short * shortTermTotalTax : 0
                        ) : (
                            totalEarn.long && gain ? gain / totalEarn.long * longTermTotalTax : 0
                        )

                        return (
                            <tr key={idx}>
                                <td>{stock.ticker}</td>
                                <td>{price ? amountToCents(price) : 'loading...'}</td>
                                <td>{numberWithCommas(stock.amount)}</td>
                                <td>{price ? amountToCents(price * stock.amount) : 'loading...'}</td>
                                <td>{oneYearBefore() < new Date(stock.boughtDate) ? 'Short' : 'Long'}</td>
                                <td>{amountToCents(stock.baseCost)}</td>
                                <td><input type="number" onChange={(e) => sellAmount(e, idx)} /></td>
                                <td>{amountToCents(gain)}</td>
                                <td>{amountToCents(tax)}</td>
                                <td>{amountToCents(gain - tax)}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div>
                <h3>Total Earned</h3>
                <div>
                    long: {amountToCents(totalEarn.long)}
                </div>
                <div>
                    short: {amountToCents(totalEarn.short)}
                </div>
                <h3>Your estimated tax</h3>
                <div>
                    Total tax:{' '}
                    {amountToCents(longTermTotalTax + shortTermTotalTax)}
                </div>
                <div>
                    long:{' '}
                    {amountToCents(longTermTotalTax)}
                </div>
                <div>
                    short:{' '}
                    {amountToCents(shortTermTotalTax)}
                </div>
            </div>
        </div>
    )
}