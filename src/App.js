import React, { useState } from 'react'
import Title from './Title'
import Login from './Login'
import Chat from './Chat'

import './scss/login-container.style.scss'


export default function App(props) {
    const [hasLogin, setHasLogin] = useState(false)

    return (
        <div className = 'container'>
            {hasLogin ? null : <Title hasLogin = {hasLogin}/>}
            {hasLogin ? <Chat {...props}/> : <Login {...props} setHasLogin = {setHasLogin}/>}
        </div>
    )
}
