import { Canvas } from '@react-three/fiber'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClipboardListCheck } from "@fortawesome/pro-regular-svg-icons"

import FriendshipBracelet from './FriendshipBracelet'
export default function Bracelet() {
    const toggleTaskModal = () => {
        console.log('open task modal')
    }
    return (<>
        <div className="h-4/6">
            <Canvas
                camera={ { 
                    fov: 45,
                    near: 0.1,
                    far: 200,
                    position: [ 3, 2, 6 ]
                } }
            >
                <FriendshipBracelet />
            </Canvas>
        </div>
        <div className="h-2/6 flex flex-col items-center justify-start">
            <p className="font-eurostile text-2xl text-center leading-[1.8rem] tracking-[.2rem]">1 / 5</p>
            <p className="font-eurostile text-xs text-center leading-[1.8rem] tracking-[.2rem] mb-4">CHARMS COLLECTED</p>
            <button className="flex items-center justify-center border-2 border-white p-2 w-64" onClick={ toggleTaskModal }>
                VIEW AVAILABLE TASKS <FontAwesomeIcon className="ml-2" icon={ faClipboardListCheck } />
            </button>
        </div>
    </>)
}