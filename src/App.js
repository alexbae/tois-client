import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { FirebaseAuthProvider } from "@react-firebase/auth"
import { 
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect
} from "react-router-dom"

import { firebaseConfig } from "./config/firebase";
import { useLogStatus, STATUS } from './utils/useLogStatus'

import { Auth } from "./pages/Auth"
import { Signup } from "./pages/Auth/Signup"
import { Dashboard } from "./pages/Dashboard"
import { BasicInfo } from "./pages/BasicInfo"
import { Stocks } from "./pages/Stocks"

const App = () => {
	const isSignedIn = useLogStatus()

	return (
		<FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
			<Router>
				<Switch>
					<Route path={'/login'} component={Auth} />
					<Route path={'/signup'} component={Signup} />
					<Route path={'/dashboard'} component={Dashboard} />
					<Route path={'/info'} component={BasicInfo} />
					<Route path={'/stocks'} component={Stocks} />
					<Route exact path="/">
						{isSignedIn === STATUS.LOGGED_IN ? <Redirect to="/dashboard" /> : <Redirect to="/" />}
						{isSignedIn === STATUS.LOGGED_OUT ? <Redirect to="/login" /> : <Redirect to="/" />}
					</Route>
				</Switch>
			</Router>
		</FirebaseAuthProvider>
	);
}

export default App;
