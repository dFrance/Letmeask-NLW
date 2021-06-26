import copyImg from '../assets/images/copy.svg'
import '../styles/roomCode.scss'

type RoomCodeProps = {
    code?: any;
    codeId?: any;
    text?: string;
}

export function RoomCode(props: RoomCodeProps) {

    function CopyRoomCode() {
        if (props.code) {
            navigator.clipboard.writeText(props.code)
        } else {
            navigator.clipboard.writeText(props.codeId)
        }
    }

    return (
        <button className="room-code" onClick={CopyRoomCode}>
            <div>
                <img src={copyImg} alt="Copy room code" />
            </div>
            <span> {props.text} {props.code} {props.codeId} </span>
        </button>
    )
}