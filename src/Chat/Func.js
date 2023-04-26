import React, { useState, useEffect } from 'react'

import newImg from '../img/new.png'
import joinImg from '../img/join.png'
import logoutImg from '../img/logout.png'
import inviteImg from '../img/invite.png'

export default function Func(props) {
    const {firebase, feature, user, setSelectedChat} = props
    const {setHasLogin, chatNum, setChatNum} = props
    const {userInfo, setUserInfo} = props
    const {selectedChat} = props

    const NewChatroom = () => {
        let chatName
        while(true) {
            chatName = prompt('Please input the name of Chatroom', `${user.displayName}'s Chatroom`)
            if (chatName == null) {
                alert('Cancel creating a Chatroom')
                return
            }
            if (chatName != '') 
                break
        }
        firebase.database().ref().orderByChild('chatName').equalTo(chatName).once('value', snapshot => {
            if (snapshot.exists()) 
                alert('The name has been repeated!')
            else {
                let chatId = cyrb53(`${user.displayName}'s Chatroom`, chatNum)
                firebase.database().ref(`chat-${chatNum}`).set({
                    nth: chatNum,
                    chatName: chatName,
                    chatId: chatId,
                    message: [['system', `${user.displayName} has joined the room`]]
                })
                .then(() => {
                    let temList = userInfo.chatList
                    console.log(temList)
                    temList.push([chatName, chatId])
                    setUserInfo({...userInfo, chat: temList})
                    firebase.database().ref(`${user.uid}`).update(userInfo)

                    alert('create chatroom!')
                    setChatNum(chatNum + 1)
                    setSelectedChat({chatName: chatName, chatId: chatId})
                    document.documentElement.style.setProperty('--show-chat-title', 'block')
                    document.documentElement.style.setProperty('--show-chat', 'block')
                })
            }
        })
    }

    const JoinChatroom = () => {
        let target;
        while(true) {
            target = prompt('Please input the name or the #id of Chatroom!')
            if (target == null) {
                alert('Cancel joining a Chatroom')
                return
            }

            if (target != '') 
                break
        }

        if (target[0] === '#') {
            let targetId = parseInt(target.substring(1))

            if (targetId != NaN) {
                firebase.database().ref().orderByChild('chatId').equalTo(targetId).once('value', snapshot => {
                    if (snapshot.exists()) {
                        let targetChatroom = Object.values(snapshot.val())[0]
                        if (userInfo.chatList.some(element => element.chatId === targetChatroom.chatId)) {
                            alert('already in this room')
                            return
                        }

                        let temList = userInfo.chatList
                        temList.push([targetChatroom.chatName, targetChatroom.chatId])
                        setUserInfo({...userInfo, chat: temList})
                        firebase.database().ref(`${user.uid}`).update(userInfo)
                        .then(() => {
                            alert('join the chatroom!')
                        
                            targetChatroom.message.push(['system', `${user.displayName} has joined the room`])
                            firebase.database().ref(`chat-${targetChatroom.nth}`).update(targetChatroom)
                            setSelectedChat({chatName: targetChatroom.chatName, chatId: targetChatroom.chatId})
                            document.documentElement.style.setProperty('--show-chat-title', 'block')
                            document.documentElement.style.setProperty('--show-chat', 'block')
                        })
                        
                        
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
                    if (userInfo.chatList.some(element => element.chatId === targetChatroom.chatId)) {
                        alert('already in this room')
                        return
                    }

                    let temList = userInfo.chatList
                    temList.push([targetChatroom.chatName, targetChatroom.chatId])
                    setUserInfo({...userInfo, chat: temList})
                    firebase.database().ref(`${user.uid}`).update(userInfo)
                    .then(() => {
                        alert('join the chatroom!')

                        targetChatroom.message.push(['system', `${user.displayName} has joined the room`])
                        firebase.database().ref(`chat-${targetChatroom.nth}`).update(targetChatroom)
                        setSelectedChat({chatName: targetChatroom.chatName, chatId: targetChatroom.chatId})
                        document.documentElement.style.setProperty('--show-chat-title', 'block')
                        document.documentElement.style.setProperty('--show-chat', 'block')
                    })
                }
                else 
                    alert('no such room name')
            })
        }
        console.log(userInfo)
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
            document.documentElement.style.setProperty('--show-chat-title', 'none')
            document.documentElement.style.setProperty('--show-chat', 'none')
        })
        .catch( error => {
            alert(error.message)
        })
    }

    const Invite = () => {
        let targetEmail
        while(true) {
            targetEmail = prompt('Please input the email of the person you want to invite')
            if (targetEmail == null) {
                alert('Cancel inviting')
                return
            }

            if (targetEmail != '') 
                break
        }

        let success = false
        let targetUser
        firebase.database().ref().orderByChild('email').equalTo(targetEmail).once('value', snapshot => {
            if (snapshot.exists()) {
                targetUser = Object.values(snapshot.val())[0]
                let temList = targetUser.chat
                temList.push([selectedChat.chatName, selectedChat.chatId])
                snapshot.ref.child(Object.keys(snapshot.val())[0]).child('chat').update(temList)
                alert('invite the person!')

                success = true
            }
            else 
                alert('no such email')
        })
        .then(() => {
            if (success) {
                firebase.database().ref().orderByChild('chatId').equalTo(parseInt(selectedChat.chatId.substring(1))).once('value', snapshot => {
                    let msg = Object.values(snapshot.val())[0].message
                    msg.push(['system', `${user.displayName} has invited ${targetUser.displayName} to the room`])
                    snapshot.ref.child(Object.keys(snapshot.val())[0]).child('message').update(msg)
                })
            }
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
        case 'invite':
            img = inviteImg
            handleEvent = Invite
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