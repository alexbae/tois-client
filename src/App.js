// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React, { useState } from "react";

const App = () => {
	const [symbol, setSymbol] = useState('');
	const [price, setPrice] = useState('???');

	const handleOnChange = e => {
		setSymbol(e.target.value)
	}

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

	return (
		<div>
			<label>Price</label>
			<input type="text" onChange={handleOnChange} />
			<button onClick={() => getStockPrice(symbol)}>Get stock price</button>
			<p>
				${price}
			</p>
		</div>
	);
}

export default App;
