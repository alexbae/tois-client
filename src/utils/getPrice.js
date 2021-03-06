export const getData = async ticker => {
    const request = await fetch(`https://us-central1-tois-f192d.cloudfunctions.net/api/stock/price`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
    
        body: JSON.stringify({
            ticker: ticker,
        })
    });
    
    const data = await request.json();

    return data
}