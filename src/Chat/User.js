import React, { useState, useEffect } from 'react'

import '../scss/chat-user.style.scss'

export default function User(props) {
    const { firebase, user } = props
    const { profilePicURL, setProfilePicURL } = props

    useEffect(() => {
        console.log('set img', profilePicURL)
        document.getElementById("user-img").src = profilePicURL;
    }, [profilePicURL, setProfilePicURL]);

    const ChangeProfilePic = () => {
        document.getElementById('uploadPic').click()
    }
    const uploadPic = (event) => {
        const file = event.target.files[0]
        firebase.storage().ref(`${user.uid}`).put(file)
        .then(() => {
            firebase.storage().ref(`${user.uid}`).getDownloadURL().then(url => {
                firebase.database().ref(`${user.uid}`).update({
                    profilePicURL: url
                })
                .then(() => {
                    setProfilePicURL(url)
                })
            })
        })
    }

    return (
        <div id='user-info'>
            <p id='user-name'>{user.displayName}</p>
            {!user.email.includes("@onlinechat.com") && <p id='user-email'>{user.email}</p>}
            <img src={profilePicURL} alt='profile picture' id='user-img' onClick = {ChangeProfilePic}></img>
            <input type = 'file' style = {{display: 'none'}} id = 'uploadPic' onChange = {uploadPic}></input>
        </div>
    )
}
