import React, { useState, useEffect } from 'react'
import Title from './Title'
import Login from './Login'
import Chat from './Chat'

import './scss/login-container.style.scss'


export default function App(props) {
    const [hasLogin, setHasLogin] = useState(false)
    const [user, setUser] = useState()

    useEffect(() => {
        document.documentElement.style.setProperty('--show-title', hasLogin ? 'none' : 'block')
        document.documentElement.style.setProperty('--show-login', hasLogin ? 'none' : 'block')
        document.documentElement.style.setProperty('--animate', hasLogin ? 'rotate' : 'none')
    }, [hasLogin])
    
    const setdisplay = () => {
        document.documentElement.style.setProperty('--show-login-container', 'none')
        document.documentElement.style.setProperty('--show-chat-container', 'block')
        document.documentElement.style.setProperty('--animate', 'none')
    }

    return (
        <div>
            <div id = 'container' onAnimationEnd = {setdisplay}>
                <Title/>
                <Login {...props} setHasLogin = {setHasLogin} setUser = {setUser} />
            </div>
            {
                hasLogin ? 
                <Chat 
                    {...props} 
                    user = {user} 
                    setHasLogin = {setHasLogin} 
                    hasLogin = {hasLogin} 
                /> : 
                null
            }
        </div>
    )
}
