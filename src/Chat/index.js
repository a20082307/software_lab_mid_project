import React, {useState, useEffect} from 'react'
import User from './User'
import Func from './Func'

import '../scss/chat-container.style.scss'
import RoomList from './RoomList'

export default function Chat(props) {
    const {firebase, user, setHasLogin, hasLogin} = props
    const [chatNum, setChatNum] = useState(0)
    const [chatList, setChatList] = useState([])

    useEffect(() => {
        firebase.database().ref(`${user.uid}`).once('value', snapshot => {
            if (snapshot.exists())
                setChatList(snapshot.val())
            else {
                setChatList([])
                console.log('empty')
            }
        })
    }, [])

    return (
        <div id = 'chat-container'>
            <User {...props}/>
            <RoomList {...props}/>
            <Func {...props} feature = {'new'} chatNum = {chatNum} setChatNum = {setChatNum} chatList = {chatList} setChatList = {setChatList} />
            <Func {...props} feature = {'join'} chatList = {chatList} setChatList = {setChatList} />
            <Func {...props} feature = {'logout'} setHasLogin = {setHasLogin} hasLogin = {hasLogin} />
            <input type = 'text' placeholder = 'message'></input>
        </div>
    )
}