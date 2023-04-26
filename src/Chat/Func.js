import React, { useState, useEffect } from 'react'

import newImg from '../img/new.png'
import joinImg from '../img/join.png'
import logoutImg from '../img/logout.png'

export default function Func(props) {
    const {firebase, feature, setHasLogin, hasLogin} = props

    const NewChatroom = () => {

    }

    const JoinChatroom = () => {

    }

    const Logout = () => {
        firebase.auth().signOut()
        .then(() => {
            console.log('sign out!')
            setHasLogin(false)
            document.documentElement.style.setProperty('--show-title', 'block')
            document.documentElement.style.setProperty('--show-login', 'block')
            document.documentElement.style.setProperty('--show-login-container', 'block')
            document.documentElement.style.setProperty('--show-chat-container', 'none')
            document.documentElement.style.setProperty('--animate', 'none')
        })
        .catch( error => {
            alert(error.message)
        })
    }

    // useEffect(() => {
    //     document.documentElement.style.setProperty('--show-title', !hasLogin ? 'none' : 'block')
    //     document.documentElement.style.setProperty('--show-login', !hasLogin ? 'none' : 'block')
    //     document.documentElement.style.setProperty('--animate', !hasLogin ? 'rotate' : 'none')
    // }, [hasLogin])

    let img, handleEvent
    switch (feature) {
        case 'new':
            img = newImg
            handleEvent = NewChatroom
            break; 
        case 'join':
            img = joinImg
            handleEvent = JoinChatroom
            break;
        case 'logout':
            img = logoutImg
            handleEvent = Logout
            break;
    }

    return (
        <button id = {feature} onClick = {handleEvent}>
           <img src = {img} alt = {feature} width = '25vw' height = '25vw'></img>
        </button>
    )
}
// new, join, logout