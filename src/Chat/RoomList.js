import React, { useState, useEffect } from 'react'

import '../scss/chat-list.style.scss'

export default function RoomList(props) {
    const {firebase, userInfo, setSelectedChat} = props

    const handleClick = (e) => {
        let temName = e.target.innerHTML
        let temId, prevMsg
        firebase.database().ref().orderByChild('chatName').equalTo(temName).once('value', snapshot => {
            temId = Object.values(snapshot.val())[0].chatId
            prevMsg = Object.values(snapshot.val())[0].message
            console.log(temId, prevMsg)
        })
        .then(() => {
            setSelectedChat({
                chatName: temName, 
                chatId: temId,
                message: prevMsg
            })
            document.documentElement.style.setProperty('--show-chat-title', 'block')
            document.documentElement.style.setProperty('--show-chat', 'block')
        })
    }

    return (
        <div id = 'RoomList-container'>
            {
                userInfo.chatList != null && userInfo.chatList.map( item => {
                    return <div key = {item[1]} onClick = {handleClick} className = 'chat-item'>{item[0]}</div>
                })
            }
        </div>
    )
}
