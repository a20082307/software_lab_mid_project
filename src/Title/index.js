import React from 'react'
import '../scss/title.style.scss'

export default function Title(props) {
    const {hasLogin} = props.hasLogin

    return (
        <h2 style = {{'show': hasLogin}}>Online Chat</h2>
    )
}
