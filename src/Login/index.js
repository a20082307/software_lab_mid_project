import React, { useState } from 'react'
import firebase from 'firebase/compat/app'

export default function Login(props) {
    const [txtEmail, setEmail] = useState('')
    const [txtPassword, setPassword] = useState('')
    let [emailInput, setEmailInput] = useState()
    let [passwordInput, setPasswordInput] = useState()

    const handleInput = (event) => {
        const {name, value} = event.target
        if (name === 'txtEmail') 
            setEmail(value)
        else 
            setPassword(value)
    }

    const handleLogIn = () => {
        firebase.auth().createUserWithEmailAndPassword(txtEmail, txtPassword)
        .then( userCredential => {
            //var user = userCredential.user;
            alert('success')
        })
        .catch( error => 
            alert(error.message)    
        )

        emailInput.value = passwordInput.value = ''
    }
    const handleSignUp = () => {
        firebase.auth().signInWithEmailAndPassword(txtEmail, txtPassword)
        .then( userCredential => {
            //var user = userCredential.user
            alert('success')
        })
        .catch( error => 
            alert(error.message)    
        )
    }

    return (
        <div>
            <input 
                onChange={handleInput} 
                type = 'text' 
                name = "txtEmail"
                placeholder = 'Please input Email'
                ref = {node => setEmailInput(node)}
            ></input><br/>
            <input 
                onChange={handleInput} 
                type = 'password' 
                name = 'txtPassword'
                placeholder = 'Please input Password'
                ref = {node => setPasswordInput(node)}
            ></input><br/>
            <button onClick = {handleSignUp}>Sign up</button><br/>
            <button onClick = {handleLogIn}>Log in</button><br/>
            <button>Google</button>
            <button>Facebook</button>
        </div>
    )
}



