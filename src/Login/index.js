import React, { useState } from 'react'


export default function Login() {
    const [txtEmail, setEmail] = useState('')
    const [txtPassword, setPassword] = useState('')
    const handleInput = (event) => {
        const {name, value} = event.target
        if (name === 'txtEmail') 
            setEmail(value)
        else 
            setPassword(value)
    }

    const handleLogIn = () => {
        // firebase.auth().signInWithEmailAndPassword(txtEmail, txtPassword)
        //     .then((userCredential) => {
        //         var user = userCredential.user
        //     })
        //     .catch(e => alert(e.message));
    }
    const handleSignOut = () => {
        // firebase.auth().signOut()
    }

    return (
        <div>
            <input 
                onChange={handleInput} 
                type = 'text' 
                name = "txtEmail"
                placeholder = 'Please input Email'
            ></input><br/>
            <input 
                onChange={handleInput} 
                type = 'password' 
                name = 'txtPassword'
                placeholder = 'Please input Password'
            ></input><br/>
            <button type = 'submit' onClick = {handleLogIn}>Log in</button>
            <button type = 'submit' onClick = {handleSignOut}>Sign up</button><br/>
            <button>Google</button>
            <button>Facebook</button>
        </div>
    )
}



