export const getEarnArray = (termArray, list) => termArray.map(stock => {
    const sellAmount = stock.sellAmount ? stock.sellAmount : 0
    return (list[stock.ticker] - stock.baseCost) * sellAmount
})