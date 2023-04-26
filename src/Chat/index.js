import React, {useState, useEffect} from 'react'
import User from './User'
import Func from './Func'
import RoomList from './RoomList'
import RoomTitle from './RoomTitle'
import ChatRoom from './ChatRoom'

import '../scss/chat-container.style.scss'

export default function Chat(props) {
    const {firebase, user, setHasLogin, hasLogin} = props
    const [chatNum, setChatNum] = useState(0)
    const [userInfo, setUserInfo] = useState({})
    const [selectedChat, setSelectedChat] = useState(null)

    useEffect(() => {
        console.log('loading')
        firebase.database().ref(`${user.uid}`).once('value', snapshot => {
            if (snapshot.exists())
                setUserInfo(snapshot.val())
            else {
                setUserInfo({
                    email: user.email, 
                    displayName: user.displayName,
                    chatList: []
                })
                console.log('empty')
            }
        })  // load userInfo

        .then(firebase.database().ref().orderByChild('nth').limitToLast(1).once('value', snapshot => {
            if (snapshot.exists())
                setChatNum(snapshot.val()[Object.keys(snapshot.val())[0]].nth + 1)
            else
                setChatNum(0)
        })) // load chatNum

        .then(() => {
            setSelectedChat(null)
        })  // reset selectedChat
    }, [])

    const newProps = {
        ...props,
        chatNum: chatNum,
        userInfo: userInfo,
        setChatNum: setChatNum,
        setUserInfo: setUserInfo,
        setSelectedChat: setSelectedChat,
        feature: 'new'
    }
    const joinProps = {
        ...props,
        userInfo: userInfo,
        setUserInfo: setUserInfo,
        setSelectedChat: setSelectedChat,
        feature: 'join'
    }
    const logoutProps = {
        ...props,
        hasLogin: hasLogin,
        setHasLogin: setHasLogin,
        feature: 'logout'
    }
    const titleProps = {
        ...props,
        selectedChat: selectedChat
    }
    const chatProps = {
        ...props,
    }

    return (
        <div id = 'chat-container'>
            <User {...props}/>
            <RoomList {...props}  userInfo = {userInfo} setSelectedChat = {setSelectedChat} />
            <Func {...newProps} />
            <Func {...joinProps} />
            <Func {...logoutProps} />
            <RoomTitle {...titleProps} />
            <ChatRoom {...chatProps} />
        </div>
    )
}