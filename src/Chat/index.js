import React, { useState } from 'firebase/compat/app'
import User from './User'
import Func from './Func'

import '../scss/chat-container.style.scss'
import RoomList from './RoomList'

export default function Chat(props) {
    const {firebase, user, setHasLogin, hasLogin} = props

    return (
        <div id = 'chat-container'>
            <User {...props}/>
            <RoomList {...props}/>
            <Func {...props} feature = {'new'} />
            <Func {...props} feature = {'join'} />
            <Func {...props} feature = {'logout'} setHasLogin = {setHasLogin} hasLogin = {hasLogin} />
            <input type = 'text' placeholder = 'message'></input>
        </div>
    )
}