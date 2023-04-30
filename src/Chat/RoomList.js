import React, { useState, useEffect } from 'react'

import '../scss/chat-list.style.scss'

export default function RoomList(props) {
    const {firebase, userInfo, setUserInfo, setSelectedChat, user} = props

    const handleClick = (e) => {
        let temName = e.target.innerHTML
        firebase.database().ref().orderByChild('chatName').equalTo(temName).once('value', snapshot => {
            let temId = Object.values(snapshot.val())[0].chatId
            let prevMsg = Object.values(snapshot.val())[0].message
            console.log(temId, prevMsg)
            return temId, prevMsg
        })
        .then((temId, prevMsg) => {
            setSelectedChat({
                chatName: temName, 
                chatId: temId,
                message: prevMsg
            })
            document.documentElement.style.setProperty('--show-chat-title', 'block')
            document.documentElement.style.setProperty('--show-chat', 'block')
        })
    }

    useEffect(() => {
        const timer = setInterval(() => {
            firebase.database().ref(`${user.uid}`).once('value', snapshot => {
                console.log(snapshot.val())
                setUserInfo(snapshot.val())
            })
        }, 3000)

        return () => {
            clearInterval(timer)
        }
    }, [])

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
