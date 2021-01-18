import React, { useEffect, useState } from 'react'

export const Stock = ({ ticker }) => {
	const [price, setPrice] = useState('???');

	const getStockPrice = async ticker => {
		console.log("Getting data");
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
		
		setPrice(data.close);
	};

	useEffect(() => {
		getStockPrice(ticker)
	}, [])
    
    return (
        <div>
            ${price}
        </div>
    )
}
