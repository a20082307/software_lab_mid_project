import React, {useState, useEffect} from 'react'
import User from './User'
import Func from './Func'
import RoomList from './RoomList'
import RoomTitle from './RoomTitle'
import ChatRoom from './ChatRoom'

import '../scss/chat-container.style.scss'
import '../scss/chat-btn.style.scss'

export default function Chat(props) {
    const {firebase, user, setHasLogin, hasLogin} = props
    const {defaultPic} = props
    const {profilePicURL, setProfilePicURL} = props
    const {searchingGIF, setSearchingGIF} = props
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
                    chatList: [], 
                    nth: -1
                })
                firebase.database().ref(`${user.uid}`).update({
                    email: user.email, 
                    displayName: user.displayName,
                    chatList: [],
                    nth: -1
                })
                console.log('create new user', userInfo)
            }
        })  // load userInfo

        .then(firebase.database().ref().orderByChild('nth').limitToLast(1).once('value', snapshot => {
            if (snapshot.exists() && 'nth' in Object.values(snapshot.val()))
                setChatNum(snapshot.val()[Object.keys(snapshot.val())[0]].nth + 1)
            else
                setChatNum(0)
        })) // load chatNum

        .then(() => {
            setSelectedChat(null)
        })  // reset selectedChat

        .then(() => {
            console.log(defaultPic)
            if (defaultPic !== null && defaultPic !== '' && defaultPic !== undefined) {
                firebase.database().ref(`${user.uid}`).update({
                    ...userInfo,
                    profilePicURL: defaultPic
                })
                .then(() => {
                    setProfilePicURL(defaultPic)
                })
            }
            else {
                firebase.storage().ref('default.png').getDownloadURL().then(url => {
                    firebase.database().ref(`${user.uid}`).update({
                        profilePicURL: url
                    })
                    .then(() => {
                        setProfilePicURL(url)
                    })
                })
            }
            console.log('update profilePicURL', profilePicURL)
        })
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
        setSearchingGIF: setSearchingGIF,
        feature: 'join'
    }
    const logoutProps = {
        ...props,
        hasLogin: hasLogin,
        feature: 'logout'
    }
    const titleProps = {
        ...props,
        selectedChat: selectedChat,
        setUserInfo: setUserInfo,
    }
    const chatProps = {
        ...props,
        selectedChat: selectedChat,
        searchingGIF: searchingGIF,
        setSearchingGIF: setSearchingGIF
    }

    return (
        <div id = 'chat-container'>
            <User {...props} setProfilePicURL = {setProfilePicURL} profilePicURL = {profilePicURL} />
            <RoomList {...props}  userInfo = {userInfo} setUserInfo = {setUserInfo} setSelectedChat = {setSelectedChat} />
            <div id = 'bottom-btn'>
                <Func {...newProps} />
                <Func {...joinProps} />
                <Func {...logoutProps} />
            </div>
            <RoomTitle {...titleProps} />
            <ChatRoom {...chatProps} />
        </div>
    )
}