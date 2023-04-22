import React, { useState, useEffect } from 'react'

export default function User(props) {
    const {user} = props

    return (
        <div id='user-info'>
            <p id = 'user-name'>{user.displayName}</p>
            {user.email.includes("@onlinechat.com") ? 
                null : 
                <p id = 'user-email'>{user.email}</p>
            }
        </div>
    )
}
