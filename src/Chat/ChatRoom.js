import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Func from './Func'

import '../scss/chat.style.scss'

export default function ChatRoom(props) {
    const {firebase, user, selectedChat} = props    
    const {searchingGIF, setSearchingGIF} = props
    const [msg, setMsg] = useState([])
    const [inputMsg, setInputMsg] = useState('')
    const [GIFRes, setGIFRes] = useState([])

    useEffect(() => {
        console.log('chatroom', selectedChat)
        if (selectedChat !== null && selectedChat !== undefined) {
            let targetId = selectedChat.chatId
            const targetChatRef = firebase.database().ref().orderByChild('chatId').equalTo(targetId)
            targetChatRef.on('value', snapshot => {
                setMsg(Object.values(snapshot.val())[0].message)

                console.log(Notification.permission)
                if (Notification.permission === 'granted') {
                    const notification = new Notification('New message', {
                        body: 'You have a new message',
                        icon: '../img/notification.png'
                    })
                }
                else if (Notification.permission === 'default') {
                    Notification.requestPermission((permission) => {}).then(permission => {
                        if (permission === 'granted') {
                            const notification = new Notification('New message', {
                                body: 'You have a new message',
                                icon: '../img/notification.png'
                            })
                        }
                    })
                }
            })

            return () => {
                targetChatRef.off('value')
            }
        }
        else {
            console.log('Didn\'t select any chatroom')
            setMsg([])
        }
    }, [selectedChat])

    const handleInput = (event) => {
        setInputMsg(event.target.value)
    }
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && event.shiftKey) {
            event.preventDefault()
            event.target.value += '\n'
            event.target.scrollTop = event.target.scrollHeight
        }
        else if (event.key === 'Enter') {
            event.preventDefault()
            if (inputMsg !== '') {
                setInputMsg(event.target.value)
                event.target.value = ''
                event.target.scrollTop = event.target.scrollHeight

                let temId = selectedChat.chatId
                console.log(temId)
                const targetChatRef = firebase.database().ref().orderByChild('chatId').equalTo(temId)
                targetChatRef.once('value', snapshot => {
                    console.log(msg) 
                    snapshot.ref.child(Object.keys(snapshot.val())[0]).update({
                        message: [...msg, ['user', inputMsg, user.displayName, user.uid]]
                    })
                })
                return () => {
                    targetChatRef.off('value')
                }
            }
        }
    }

    const sendPicture = (event) => {
        try {
            const file = event.target.files[0]
            const path = `${selectedChat.chatId}/${file.name}_${Date.now()}`
            firebase.storage().ref(path).put(file)
            .then(() => {
                firebase.storage().ref(path).getDownloadURL().then(url => {
                    firebase.database().ref().orderByChild('chatId').equalTo(selectedChat.chatId).once('value', snapshot => {
                        snapshot.ref.child(Object.keys(snapshot.val())[0]).update({
                            message: [...msg, ['img', url, user.displayName, user.uid]]
                        })
                    })
                })
            })
        }
        catch {
            alert('something wrong')
        }
        
    }
    const openPic = (event) => {
        window.open(event.target.src, '_blank')
    }

    const findGIF = (event) => {
        setGIFRes([])

        const url = (event.target.value && `https://tenor.googleapis.com/v2/search?key=${gifProps.api}&q=${event.target.value}`)
        axios.get(url)
        .then(res => {
            console.log(res.data.results)
            setGIFRes(res.data.results)
        })
    }
    const handleSelectGIF = (event) => {
        firebase.database().ref().orderByChild('chatId').equalTo(selectedChat.chatId).once('value', snapshot => {
            snapshot.ref.child(Object.keys(snapshot.val())[0]).update({
                message: [...msg, ['img', event.target.src, user.displayName, user.uid]]
            })
        })

        setSearchingGIF(false)
    }

    const gifProps = {
        ...props,
        api: 'AIzaSyCWnE61qwD_Sq4vsyx9Rrjs32cJJ_UjZls',
        searchingGIF: searchingGIF,
    }

    return (
        console.log(searchingGIF),
        <div id = 'chat'>
            <div id = 'chat-msg'>
            {
                (selectedChat !== null && selectedChat !== undefined) && (
                    msg.map( item => {
                        switch(item[0]) {
                            case 'system':
                                return (
                                    <div className = 'system-msg-container'>
                                        <p className = 'system-msg'>{item[1]}</p>
                                        <br/>
                                    </div>
                                )

                            case 'user':
                                if (item[3] == user.uid)
                                    return (
                                        <div className = 'user-msg-info'>
                                            <div className = 'user-msg-container'>
                                                <pre className = 'user-chat-msg'>{item[1]}</pre>
                                            </div>
                                            <div className = 'user-name-container'>
                                                <p className = 'username'>{item[2]}</p>
                                            </div>
                                        </div>
                                    )
                                else 
                                    return (
                                        <div className = 'others-msg-info'>
                                            <div className = 'others-msg-container'>
                                                <pre className = 'others-chat-msg'>{item[1]}</pre>
                                            </div>
                                            <div className = 'others-name-container'>
                                                <p className = 'others'>{item[2]}</p>
                                            </div>
                                        </div>
                                    )
                            case 'img':
                                if (item[3] == user.uid)
                                    return (
                                        <div className = 'user-img-info'>
                                            <div className = 'user-img-container'>
                                                <img src = {item[1]} alt = 'img' className = 'user-img' onClick = {openPic}/>
                                            </div>
                                            <div className = 'user-name-container'>
                                                <p className = 'username'>{item[2]}</p>
                                            </div>
                                        </div>
                                    )
                                else 
                                    return (
                                        <div className = 'others-img-info'>
                                            <div className = 'others-img-container'>
                                                <img src = {item[1]} alt = 'img' className = 'others-img' onClick = {openPic}/>
                                            </div>
                                            <div className = 'others-name-container'>
                                                <p className = 'others'>{item[2]}</p>
                                            </div>
                                        </div>
                                    )
                        } 
                    })
                )
            }
            </div>
            <div id = 'chat-function'>
                <textarea id = 'chat-input' placeholder = 'Type your message here...' onChange = {handleInput} onKeyDown = {handleKeyDown}></textarea>
                <Func {...props} feature = 'send' inputMsg = {inputMsg} setInputMsg = {setInputMsg} />
                <Func {...props} feature = 'picture'/> 
                <input type = 'file' id = 'picture-input' onChange = {sendPicture}/>
                <Func {...gifProps} feature = 'gif' />
                {searchingGIF && <input type = 'text' id = 'gif-input' onChange = {findGIF}/> }
            </div>
            {searchingGIF && <div id = 'chat-gif'>
                {GIFRes !== undefined && GIFRes.map(item => {
                    return (
                        console.log(item),
                        <img 
                            key = {item.id}
                            src = {item.media_formats.gif.url} 
                            alt = {item.title} 
                            className = 'gif-option' 
                            onClick = {handleSelectGIF}
                            onError={(e)=>{e.target.onerror = null; e.target.src=""}}
                        />
                    )
                })}
            </div>}
        </div>
    )
}