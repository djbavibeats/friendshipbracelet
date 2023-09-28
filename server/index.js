import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'

import cors from 'cors'

const app = express()
const PORT = 5000
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: [ 'http://localhost:5173' ]
    }
})
app.use(cors())

let users = []

io.use((socket, next) => {
    const username = socket.handshake.auth.username
    if (!username) {
        return next(new Error('invalid username'))
    }
    socket.username = username
    next()
})
io.on('connection', (socket) => {
    console.log(`connect: ${socket.id}`)
    
    const users = []
    for (let [ id, socket ] of io.of('/').sockets) {
        users.push({
            userId: id,
            username: socket.username
        })
    }
    
    socket.emit('users', users)
    socket.broadcast.emit('user connected', {
        userId: socket.id,
        username: socket.username
    })

    socket.onAny((event, ...args) => {
        console.log("any" + event)
    })

    socket.on('disconnect', () => {
        console.log('disconnecting')
    })
})

app.get('/api', (req, res) => {
    res.json({
        message: 'Hi!!!'
    })
})



server.listen(PORT, () => {
    console.log('listening... on PORT: ' + PORT)
})