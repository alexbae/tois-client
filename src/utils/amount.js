export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const amountToCents = amount => {
    return `$${numberWithCommas(Number(amount).toFixed(2))}`
}