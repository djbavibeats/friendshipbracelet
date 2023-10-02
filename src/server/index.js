import express from 'express'
import ViteExpress from 'vite-express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express()
const PORT = 5500
ViteExpress.config({ mode: 'production' })

app.get("/message", (_, res) => {
    res.json({ 'message': 'oh shit!' })
})

ViteExpress.listen(app, PORT, () => 
console.log("Server is listening..." + PORT)
)

// const server = createServer(app)
// const io = new Server(server, {
//     cors: {
//         origin: [ 'http://localhost:5173' ]
//     }
// })
// app.use(cors())

// io.use((socket, next) => {
//     const username = socket.handshake.auth.username
//     if (!username) {
//         return next(new Error('invalid username'))
//     }
//     socket.username = username
//     next()
// })

// io.on('connection', (socket) => {
//     console.log(`connect: ${socket.id}`)

//     const users = []
//     for (let [ id, socket ] of io.of('/').sockets) {
//         users.push({
//             userId: id,
//             username: socket.username
//         })
//     }
//     socket.emit('users', users)
    

//     socket.broadcast.emit('user connected', {
//         userId: socket.id,
//         username: socket.username,
//     })

//     // Uncomment to listen to any event (custom named!)
//     // socket.onAny((event, ...args) => {
//     //     console.log("any " + event)
//     // })

//     socket.on('private message', ({ message, to }) => {
//         socket.to(to).emit('private message', {
//             message,
//             from: socket.id
//         })
//     })

//     socket.on('disconnect', () => {
//         socket.broadcast.emit('user disconnected', socket.id)
//     })
// })

// server.listen(PORT, () => {
//     console.log('listening... on PORT: ' + PORT)
// })