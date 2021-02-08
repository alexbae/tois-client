import { firebaseInit } from "../config/firebase"

export const signOut = (history) => {
    firebaseInit.auth().signOut()
        .then(() => {
            history.push('/')
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            
            console.log(errorCode, errorMessage)
        })
}