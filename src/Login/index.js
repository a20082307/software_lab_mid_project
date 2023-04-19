import React, { useState } from 'react'
import '../index.css'
import './index.css'

import googleIcon from '../img/google.png'
import facebookIcon from '../img/facebook.png'
import githubIcon from '../img/github.png'

export default function Login(props) {
    const {firebase, setHasLogin} = props
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

    let googleProvider = new firebase.auth.GoogleAuthProvider()
    let facebookProvider = new firebase.auth.FacebookAuthProvider()
    let githubProvider = new firebase.auth.GithubAuthProvider()
    const handelGoogleLogIn = () => {
        firebase.auth().signInWithPopup(googleProvider)
        .then(() => {
            console.log('Login with Google!')
            setHasLogin(true)
        })
        .catch( error => {
            console.log(error.message)
        })
    }
    const handelFacebookLogIn = () => {
        firebase.auth().signInWithPopup(facebookProvider)
        .then((result) => {
            //let token = result.credential.accessToken;
            console.log('Login with Facebook!')
            setHasLogin(true)
        })
        .catch( error => {
            console.log(error.message)
        })
    }
    const handleGithubLogIn = () => {
        firebase.auth().signInWithPopup(githubProvider)
        .then((result) => {
            //let token = result.credential.accessToken
            //let user = result.user
            console.log('Login with Github!')
            setHasLogin(true)
        })
        .catch( error => {
            console.log(error.message)
        })
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
                className = 'col-d-4 col-l-4 col-t-8 col-p-10 col-11'
                id = 'emailInput'
                onChange = {handleInput} 
                type = 'text' 
                name = "txtEmail"
                placeholder = 'Please input Email'
                ref = {node => setEmailInput(node)}
            ></input><br/>
            <input 
                className = 'col-d-4 col-l-4 col-t-8 col-p-10 col-11'
                id = 'passwordInput'
                onChange={handleInput} 
                type = 'password' 
                name = 'txtPassword'
                placeholder = 'Please input Password'
                ref = {node => setPasswordInput(node)}
            ></input><br/>

            <button     /********** sign up btn **********/
                className = 'col-d-2 col-l-2' 
                id = 'btn-sign-up'
                onClick = {handleSignUp}
            >Sign up</button><br/>
            <button     /********** sign in btn **********/
                className = 'col-d-2 col-l-2'
                id = 'btn-log-in' 
                onClick = {handleLogIn}
            >Log in</button><br/><br/>

            <p id = 'other-sign-in-way'>Or sign in with</p>

            <button     /********** google btn **********/
                className = 'third-sign-in col-d-1 col-l-1' 
                id = 'btn-google'
                onClick = {handelGoogleLogIn}
            ><img id = 'google-icon' src = {googleIcon} alt = 'google icon'/> Google</button>
            <button     /********** facebook btn **********/
                className = 'third-sign-in col-d-1 col-l-1' 
                id = 'btn-facebook'
                onClick = {handelFacebookLogIn}
            ><img id = 'facebook-icon' src = {facebookIcon} alt = 'facebook icon'/> Facebook</button>
            <button     /********** github btn **********/
                className = 'third-sign-in col-d-1 col-l-1' 
                id = 'btn-github'
                onClick = {handleGithubLogIn}
            ><img id = 'github-icon' src = {githubIcon} alt = 'github icon'/> Github</button>
        </div>
    )
}



