import React, { useState, useEffect } from 'react'

import newImg from '../img/new.png'
import joinImg from '../img/join.png'
import logoutImg from '../img/logout.png'
import inviteImg from '../img/invite.png'
import sendImg from '../img/send.png'
import pictureImg from '../img/picture.png'
import gifImg from '../img/gif.png'

import '../scss/chat-btn.style.scss'

export default function Func(props) {
    const {firebase, feature, user, setSelectedChat} = props
    const {setHasLogin, chatNum, setChatNum} = props
    const {userInfo, setUserInfo, setProfilePicURL, setDefaultPic, setSearchingGIF} = props
    const {selectedChat} = props
    const {inputMsg, setInputMsg} = props
    const {api, searchingGIF} = props

    const NewChatroom = () => {
        let chatName, chatId
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
            else
                chatId = cyrb53(`${user.displayName}'s Chatroom`, chatNum)
        })
        .then(() => {
            return firebase.database().ref().orderByChild('nth').limitToLast(1).once('value')
        })
        .then(snapshot => {
            console.log(Object.values(snapshot.val())[0].nth, 'al;ksdfjasl;dfjasl;dfjk')
            let newChatNum = Object.values(snapshot.val())[0].nth + 1
            if (snapshot.exists()) {
                setChatNum(newChatNum)
                console.log('success catcg')
                return newChatNum
            }
            else {
                setChatNum(0)   
                return 0
            }
            // console.log(chatNum, snapshot.val()[Object.keys(snapshot.val())[0]].nth)
        })
        .then((newChatNum) => {
            // console.log('before', chatNum)
            firebase.database().ref(`chat-${newChatNum}`).set({
                nth: newChatNum || 0,
                chatName: chatName,
                chatId: chatId,
                message: [['system', `${user.displayName} has joined the room`]]
            })
        })
        .then(() => {
            return firebase.database().ref(`${user.uid}`).once('value')
        })
        .then(snapshot => {
            console.log(snapshot.val())
            if ('chatList' in snapshot.val()) {
                let temList = snapshot.val().chatList
                temList.push([chatName, chatId])
                setUserInfo({...snapshot.val(), chatList: temList})
                return firebase.database().ref(`${user.uid}`).update({...snapshot.val(), chatList: temList})
            }
            else {
                setUserInfo({
                    ...snapshot.val(),
                    chatList: [[chatName, chatId]]
                })
                return firebase.database().ref(`${user.uid}`).update({...snapshot.val(), chatList: [[chatName, chatId]]})
            }
        })
        .then(() => {
            alert('create chatroom!')
            setChatNum(chatNum + 1)
            setSelectedChat({chatName: chatName, chatId: chatId})
            document.documentElement.style.setProperty('--show-chat-title', 'block')
            document.documentElement.style.setProperty('--show-chat', 'block')
        })
        .catch(error => {
            console.log(error)
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
                        if (temList === undefined)
                            temList = [[targetChatroom.chatName, targetChatroom.chatId]]
                        else
                            temList.push([targetChatroom.chatName, targetChatroom.chatId])
                        
                        setUserInfo({...userInfo, chatList: temList})
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
                    if (temList === undefined)
                        temList = [[targetChatroom.chatName, targetChatroom.chatId]]
                    else
                        temList.push([targetChatroom.chatName, targetChatroom.chatId])

                    setUserInfo({...userInfo, chatList: temList})
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
            setProfilePicURL(null)
            setDefaultPic(null)
            setSearchingGIF(false)
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
            targetEmail = prompt('Please input the email or the name of the person you want to invite')
            if (targetEmail == null) {
                alert('Cancel inviting')
                return
            }

            if (targetEmail != '') 
                break
        }
        if (!targetEmail.includes('@'))
            targetEmail += '@onlinechat.com'

        let success = false
        let targetUser
        firebase.database().ref().orderByChild('email').equalTo(targetEmail).once('value', snapshot => {
            if (snapshot.exists()) {
                targetUser = Object.values(snapshot.val())[0]
                let temList = targetUser.chatList
                if (temList === undefined) {
                    snapshot.ref.child(Object.keys(snapshot.val())[0]).child('chatList').update([[selectedChat.chatName, selectedChat.chatId]])
                    success = true
                    alert('invite the person!')
                    
                    setUserInfo({...userInfo, chatList: [[selectedChat.chatName, selectedChat.chatId]]})
                    return
                }

                console.log(temList, selectedChat.chatId)
                if (temList.some(element => element[1] === selectedChat.chatId)) {
                    alert('already in this room')
                    return
                }

                temList.push([selectedChat.chatName, selectedChat.chatId])
                snapshot.ref.child(Object.keys(snapshot.val())[0]).child('chatList').update(temList)
                success = true
                alert('invite the person!')
                
                setUserInfo({...userInfo, chatList: temList})
            }
            else 
                alert('no such email')
        })
        .then(() => {
            if (success) {
                let temId = selectedChat.chatId
                firebase.database().ref().orderByChild('chatId').equalTo(temId).once('value', snapshot => {
                    let msg = Object.values(snapshot.val())[0].message
                    msg.push(['system', `${user.displayName} has invited ${targetUser.displayName} to the room`])
                    snapshot.ref.child(Object.keys(snapshot.val())[0]).child('message').update(msg)
                })
            }
        })
    }
    const Send = () => {
        if (inputMsg !== '') {
            const inputArea = document.getElementById('chat-input')
            inputArea.value = ''
            inputArea.scrollTop = inputArea.scrollHeight

            let temId = selectedChat.chatId
            const targetChatRef = firebase.database().ref().orderByChild('chatId').equalTo(temId)
            targetChatRef.once('value', snapshot => {
                snapshot.ref.child(Object.keys(snapshot.val())[0]).update({
                    message: [...Object.values(snapshot.val())[0].message, ['user', inputMsg, user.displayName, user.uid]]
                })
            })
        }
    }
    const SelectPicture = () => {
        document.getElementById('picture-input').click()
    }   
    const SendGif = () => {
        setSearchingGIF(!searchingGIF)
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
        case 'send':
            img = sendImg
            handleEvent = Send
            break;
        case 'picture':
            img = pictureImg
            handleEvent = SelectPicture
            break;
        case 'gif':
            img = gifImg
            handleEvent = SendGif
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