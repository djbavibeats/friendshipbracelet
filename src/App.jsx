import { Link, Route } from 'wouter'

// Components
// Top navigation

// Core content
import Core from './components/core'
import Chatroom from './components/chatroom'

// Footer
function App() {
  return (
    <>
      <div className="m-auto flex justify-center p-16 min-h-screen">
        <Chatroom />
      </div>
    </>
  )
}

export default App
