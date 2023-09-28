import React, { useState, useEffect, useRef } from 'react'
import { socket } from '../../socket'

export default function Chatroom() {
    const [ isConnected, setIsConnected ] = useState(socket.connected)
    const [ usernameSelected, setUsernameSelected ] = useState(false)
    const usernameRef = useRef(null)

    useEffect(() => {       
        socket.on('connect', () => {
            setIsConnected(true)
        })

        socket.on('disconnect', () => {
            setIsConnected(false)
        })

        socket.on('users', (users) => {
            console.log(users)
        })

        socket.on('connect_error', (err) => {
            if (err.message === 'invalid username') {
                console.log('invalid username')
                setUsernameSelected(false)
            }
        })

        return () => {
            socket.off('connect')
            socket.off('disconnect')
            socket.off('conncect_error')
        }
    }, [])

    function handleUsernameSelection() {
        setUsernameSelected(true)
        socket.auth = {
            username: usernameRef.current.value
        }
        socket.connect()
    }

    return (<>
        {/* Step One: Username Selection */}
        <div>
            <input type="text" placeholder="Your username" className="border-2 p-2" ref={ usernameRef } />  
            <button onClick={ handleUsernameSelection } className="border-2 p-2">
                Enter
            </button>
        </div>

        {/* Step Two: Chatroom Particpants */}
        <div className="hidden">
        </div>
    </>)
}