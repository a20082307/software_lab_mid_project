import React, { useState } from 'react'
import Title from './Title'
import Login from './Login'

import './App.css'


export default function App(props) {
    const [hasLogin, setHasLogin] = useState(false)

    return (
        <div className = 'container'>
            <Title/>
            {hasLogin ? null : <Login {...props} setHasLogin = {setHasLogin}/>}
        </div>
    )
}
