import React from 'react'
import Func from './Func'

import '../scss/chat-title.style.scss'

export default function RoomTitle(props) {
    const {selectedChat} = props

    return (
        selectedChat !== null ? 
        <div id = 'chat-title'>
            <p id = 'chat-title-name'>{selectedChat.chatName}</p>
            <p id = 'chat-title-id'>{selectedChat.chatId}</p>
            <Func {...props} feature = 'invite'/>
        </div> : null
    )
}
