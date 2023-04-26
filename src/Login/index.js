import React, { useState } from 'react'
import '../scss/login.style.scss'

import googleIcon from '../img/google.png'
import facebookIcon from '../img/facebook.png'
import githubIcon from '../img/github.png'

export default function Login(props) {
    const {firebase, setHasLogin, setUser} = props
    const [userName, setUserName] = useState('')
    const [txtPassword, setPassword] = useState('')
    let [usernameInput, setUsernameInput] = useState()
    let [passwordInput, setPasswordInput] = useState()
    const handleInput = (event) => {
        const {name, value} = event.target
        if (name === 'username') 
            setUserName(value)
        else 
            setPassword(value)
    }

    let user
    let googleProvider = new firebase.auth.GoogleAuthProvider()
    let facebookProvider = new firebase.auth.FacebookAuthProvider()
    let githubProvider = new firebase.auth.GithubAuthProvider()
    const handelGoogleLogIn = () => {
        firebase.auth().signInWithPopup(googleProvider)
        .then((result) => {
            console.log('Login with Google!')

            user = result.user
            setUser(user)
            setHasLogin(true)
            setUserName('')
            setPassword('')
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

            user = result.user
            setUser(user)
            setHasLogin(true)
            setUserName('')
            setPassword('')
        })
        .catch( error => {
            console.log(error.message)
        })
    }
    const handleGithubLogIn = () => {
        firebase.auth().signInWithPopup(githubProvider)
        .then((result) => {
            console.log('Login with Github!')

            user = result.user
            setUser(user)
            setHasLogin(true)
            setUserName('')
            setPassword('')
        })
        .catch( error => {
            console.log(error.message)
        })
    }
    const handleLogIn = () => {
        let email = userName.includes('@') ? userName : userName + '@onlinechat.com'
        firebase.auth().signInWithEmailAndPassword(email, txtPassword)
        .then( userCredential => {
            //var user = userCredential.user;
            alert('success')

            user = userCredential.user
            setUser(user)
            setHasLogin(true)
            setUserName('')
            setPassword('')
        })
        .catch( error => 
            alert(error.message)    
        )

        usernameInput.value = passwordInput.value = ''
    }
    const handleSignUp = () => {
        let email = userName.includes('@') ? userName : userName + '@onlinechat.com'

        firebase.auth().createUserWithEmailAndPassword(email, txtPassword)
        .then( (userCredential) => {
            const user = userCredential.user
            user.updateProfile({
                displayName: userName.includes('@') ? userName.substring(0, userName.indexOf('@')) : userName,
            })

            alert('success')
        })
        .catch( error => 
            alert(error.message)    
        )
    }

    return (
        <div id = 'login'>
            <input 
                id = 'usernameInput'
                onChange = {handleInput} 
                type = 'text' 
                name = "username"
                placeholder = 'Please input username or email'
                ref = {node => setUsernameInput(node)}
            ></input><br/>
            <input 
                id = 'passwordInput'
                onChange={handleInput} 
                type = 'password' 
                name = 'txtPassword'
                placeholder = 'Please input password'
                ref = {node => setPasswordInput(node)}
            ></input><br/>

            <button     /********** sign up btn **********/
                id = 'btn-sign-up'
                onClick = {handleSignUp}
            >Sign up</button><br/>
            <button     /********** sign in btn **********/
                id = 'btn-log-in' 
                onClick = {handleLogIn}
            >Log in</button><br/><br/>

            <p id = 'other-sign-in-way'>Or sign in with</p>

            <button     /********** google btn **********/
                id = 'btn-google'
                onClick = {handelGoogleLogIn}
            ><img id = 'google-icon' src = {googleIcon} alt = 'google icon'/> Google</button>
            <button     /********** facebook btn **********/
                id = 'btn-facebook'
                onClick = {handelFacebookLogIn}
            ><img id = 'facebook-icon' src = {facebookIcon} alt = 'facebook icon'/> Facebook</button>
            <button     /********** github btn **********/
                id = 'btn-github'
                onClick = {handleGithubLogIn}
            ><img id = 'github-icon' src = {githubIcon} alt = 'github icon'/> Github</button>
        </div>
    )
}



