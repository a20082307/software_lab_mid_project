import React, { StrictMode } from 'react'
import ReactDom from 'react-dom/client'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'
import 'firebase/compat/storage'

import App from './App'
import './scss/index.style.scss'

const config = {
    apiKey: "AIzaSyCWnE61qwD_Sq4vsyx9Rrjs32cJJ_UjZls",
    authDomain: "mid-project-597a7.firebaseapp.com",
    databaseURL: "https://mid-project-597a7-default-rtdb.firebaseio.com",
    projectId: "mid-project-597a7",
    storageBucket: "mid-project-597a7.appspot.com",
    messagingSenderId: "385018300200",
    appId: "1:385018300200:web:dad04b67d5d1cf99ea321d",
    measurementId: "G-G8RTS5Q35B"
}
firebase.initializeApp(config)

Notification.requestPermission(permission => {})
const root = ReactDom.createRoot(document.getElementById('root'))
root.render(
    <StrictMode>
        <App firebase = {firebase}/>
    </StrictMode>
)


