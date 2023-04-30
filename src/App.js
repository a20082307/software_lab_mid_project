import React, { useState, useEffect } from 'react'
import Title from './Title'
import Login from './Login'
import Chat from './Chat'

import './scss/login-container.style.scss'


export default function App(props) {
    const [hasLogin, setHasLogin] = useState(false)
    const [user, setUser] = useState()
    const [defaultPic, setDefaultPic] = useState(null)
    const [profilePicURL, setProfilePicURL] = useState()
    const [searchingGIF, setSearchingGIF] = useState(false)

    useEffect(() => {
        document.documentElement.style.setProperty('--show-title', hasLogin ? 'none' : 'block')
        document.documentElement.style.setProperty('--show-login', hasLogin ? 'none' : 'block')
        document.documentElement.style.setProperty('--animate', hasLogin ? 'rotate' : 'none')
        document.documentElement.style.setProperty('--show-chat-title', 'none')
        document.documentElement.style.setProperty('--show-chat', 'none')
    }, [hasLogin])
    
    const setdisplay = () => {
        document.documentElement.style.setProperty('--show-login-container', 'none')
        document.documentElement.style.setProperty('--show-chat-container', 'block')
        document.documentElement.style.setProperty('--animate', 'none')
    }

    const loginProps = {
        ...props,
        setHasLogin: setHasLogin,
        setUser: setUser,
        setDefaultPic: setDefaultPic
    }
    const chatProps = {
        ...props,
        user: user,
        hasLogin: hasLogin,
        defaultPic: defaultPic,
        profilePicURL: profilePicURL,
        searchingGIF: searchingGIF,
        setHasLogin: setHasLogin,
        setDefaultPic: setDefaultPic,
        setProfilePicURL: setProfilePicURL,
        setSearchingGIF: setSearchingGIF
    }

    return (
        <div>
            <div id = 'container' onAnimationEnd = {setdisplay}>
                <Title/>
                <Login {...loginProps} />
            </div>
            {hasLogin && <Chat {...chatProps}/>}
        </div>
    )
}
