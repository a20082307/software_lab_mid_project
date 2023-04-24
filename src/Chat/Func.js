import React, { useState, useEffect } from 'react'


import newImg from '../img/new.png'
import joinImg from '../img/join.png'
import logoutImg from '../img/logout.png'

export default function Func(props) {
    const {firebase, feature, user} = props
    const {setHasLogin, chatNum, setChatNum} = props
    const {chatList, setChatList} = props

    const NewChatroom = () => {
        let chatName
        let leave = false
        while(true) {
            chatName = prompt('Please input the name of Chatroom', `${user.displayName}'s Chatroom`)
            if (chatName == null) {
                alert('Cancel creating a Chatroom')
                return
            }

            if (chatName == '') 
                continue;

            break
        }
        firebase.database().ref().orderByChild('chatName').equalTo(chatName).once('value', snapshot => {
            if (snapshot.exists()) 
                alert('The name has been repeated!')
            else {
                firebase.database().ref(`chat-${chatNum}`).set({
                    nth: chatNum,
                    chatName: chatName,
                    chatId: cyrb53(`${user.displayName}'s Chatroom`, chatNum),
                    message: [`${user.displayName} has joined the room`]
                })
                
                let temList = chatList
                temList.push(chatNum)
                setChatList(temList)
                firebase.database().ref(`${user.uid}`).update(chatList)

                alert('create chatroom!')
            }
        })
    }

    const JoinChatroom = () => {
        let target = prompt('Please input the name or the #id of Chatroom!')
        if (target[0] === '#') {
            let targetId = parseInt(target.substring(1))

            if (targetId != NaN) {
                firebase.database().ref().orderByChild('chatId').equalTo(targetId).once('value', snapshot => {
                    if (snapshot.exists()) {
                        let targetChatroom = Object.values(snapshot.val())[0]
                        if (chatList.some(element => element.chatId === targetChatroom.chatId)) {
                            alert('already in this room')
                            return
                        }

                        targetChatroom.message.push(`${user.displayName} has joined the room`)
                        setChatList([...chatList, targetChatroom])

                        let temList = chatList
                        temList.push(targetChatroom.nth)
                        setChatList(temList)
                        firebase.database().ref(`${user.uid}`).update(chatList)

                        alert('join the chatroom!')
                        
                        firebase.database().ref(`chat-${targetChatroom.nth}`).update(targetChatroom)
                    }
                    else 
                        alert('no such room id')
                })
            }
            else 
                alert('Please input id after #')
        }
        else {
            firebase.database().ref().orderByChild('chatName').equalTo(target).once('value', snapshot => {
                if (snapshot.exists()) {
                    let targetChatroom = Object.values(snapshot.val())[0]
                    if (chatList.some(element => element.chatId === targetChatroom.chatId)) {
                        alert('already in this room')
                        return
                    }

                    targetChatroom.message.push(`${user.displayName} has joined the room`)
                    setChatList([...chatList, targetChatroom])
                    alert('join the chatroom!')
                    
                    firebase.database().ref(`chat-${targetChatroom.nth}`).update(targetChatroom)
                }
                else 
                    alert('no such room name')
            })
        }
        console.log(chatList)
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

const cyrb53 = (str, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for(let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};