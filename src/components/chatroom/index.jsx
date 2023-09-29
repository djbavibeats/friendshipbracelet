import React, { useState, useEffect, useRef } from 'react'
import { socket } from '../../socket'

export default function Chatroom() {
    const [ isConnected, setIsConnected ] = useState(socket.connected)
    const [ usernameSelected, setUsernameSelected ] = useState(false)
    const usernameRef = useRef(null)
    const [ users, setUsers ] = useState([])
    const [ pairedUser, setPairedUser ] = useState(null)

    const messageRef = useRef(null)

    useEffect(() => {       
        socket.on('connect', () => {
            setIsConnected(true)
        })

        socket.on('disconnect', () => {
            setIsConnected(false)
        })

        socket.on('user connected', (user) => {
            setUsers(
                [ 
                    ...users,
                    user
                ]
            )
        })

        socket.on('users', (users) => {
            users.forEach((user) => {
                user.self = user.userId === socket.id
            })

            const sortedUsers = users.sort((a, b) => {
                if (a.self) return -1
                if (b.self) return 1
                if (a.username < b.username) return -1
                return a.username > b.username ? 1 : 0
            })

            setUsers(sortedUsers)
        })

        socket.on('private message', ({ message, from }) => {
            alert('new private message: ' + message)
            for (let i = 0; i < users.length; i++) {
                const user = users[i]
                if (user.userId === from) {
                    user.messages.push({
                        message: message,
                        fromSelf: false
                    })
                    if (user !== pairedUser) {
                        user.hasNewMessages = true
                    }
                    break
                }
            }
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
            socket.off('connect_error')
        }
    }, [ users ])

    function handleUsernameSelection() {
        setUsernameSelected(true)
        socket.auth = {
            username: usernameRef.current.value
        }
        socket.connect()
    }

    function handleSelfClick(user) {
        setPairedUser(null)
        console.log('that is you!')
    }

    function handleUserClick(user) {
        setPairedUser(user)

    }

    function sendMessage() {
        if (pairedUser) {
            const updatedPairedUser = pairedUser
            socket.emit('private message', {
                message: messageRef.current.value,
                to: pairedUser.userId
            })
            updatedPairedUser.messages.push({
                message: messageRef.current.value,
                fromSelf: true
            })
            setPairedUser(updatedPairedUser)
        }
    }

    return (<>
        {/* Step One: Username Selection */}
        <div className={ 
            usernameSelected ? ` hidden ` : ` flex
             flex-col justify-center m-auto gap-2 p-2 max-w-[300px]`
        }>
            <input type="text" placeholder="Please create a username" className="border-b-2 p-2 w-full" ref={ usernameRef } />  
            <button onClick={ handleUsernameSelection } className="border-2 p-2 w-full">
                Enter
            </button>
        </div>

        {/* Step Two: Chatroom Particpants */}
        <div className={
            !usernameSelected ? ` hidden ` : ` grid
            grid-cols-12
        ` }>
            <div className="flex flex-col col-span-4 border-r-2">
                { users.map(user => {
                    if (user.self) {
                        return <div
                            key={ user.userId }
                            onClick={ () => handleSelfClick(user) }
                            className={ `border-b-2 p-2` }
                        >
                        { user.username } { user.connected ? <p>Online</p> : <p>Offline</p> }
                        </div>
                    } else {
                        return <div 
                            key={ user.userId }
                            onClick={ () => handleUserClick(user) }
                            className={  
                                pairedUser && user.userId === pairedUser.userId ? 
                                ` border-b-2 p-2 bg-black text-white ` 
                                : ` border-b-2 p-2 bg-white text-black `
                            }
                        >
                            { user.username } { user.connected ? <p>Online</p> : <p>Offline</p> }
                        </div>
                    }
                })}
            </div>
            <div className={`
                col-span-8 p-2 flex flex-col gap-2
            `}>
                { pairedUser ?
                    <>
                        <div>
                            <p>Chatroom with { pairedUser.username }</p>
                        </div>
                        <div>
                            <input type="textarea" className="border-2 w-full p-2 mb-2" ref={ messageRef } />
                            <button className="border-2 p-2" onClick={ sendMessage }>Send</button>
                        </div>
                    </>
                    : <p>Pick someone to chat with!</p>
                }
                <div>
                    <p></p>
                </div>
                
            </div>
        </div>
    </>)
}