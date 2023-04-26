import React, { useState, useEffect } from 'react'

export default function RoomList(props) {
    const {firebase, userInfo, setSelectedChat} = props

    const handleClick = (e) => {
        let temName = e.target.innerHTML
        let temId
        firebase.database().ref().orderByChild('chatName').equalTo(temName).once('value', snapshot => {
            temId = `#${snapshot.val()[Object.keys(snapshot.val())[0]].chatId}`
        })
        .then(() => {
            setSelectedChat({
                chatName: temName, 
                chatId: temId
            })
            document.documentElement.style.setProperty('--show-chat-title', 'block')
            document.documentElement.style.setProperty('--show-chat', 'block')
        })
    }

    return (
        <div id = 'RoomList-container'>
            {
                userInfo.chatList != null ? userInfo.chatList.map( item => {
                    return <div key = {item[1]} onClick = {handleClick}>{item[0]}</div>
                })
                : null
            }
        </div>
    )
}
