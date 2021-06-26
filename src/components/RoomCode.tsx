import copyImg from '../assets/images/copy.svg'
import toast, { Toaster } from 'react-hot-toast';
import '../styles/roomCode.scss'

type RoomCodeProps = {
    code?: any;
    codeId?: any;
    text?: string;
}

export function RoomCode(props: RoomCodeProps) {
    const notify = () => toast('Código copiado com sucesso.');

    function CopyRoomCode() {
        if (props.code) {
            navigator.clipboard.writeText(props.code)
            notify();
        } else {
            navigator.clipboard.writeText(props.codeId)
            notify();
        }
    }

    return (
        <>
            <Toaster position="top-left"
                toastOptions={{
                    className: '',
                    duration: 5000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        theme: {
                            primary: 'green',
                            secondary: 'black',
                        }
                    }
                }}
            />
            <button className="room-code" onClick={CopyRoomCode}>
                <div>
                    <img src={copyImg} alt="Copy room code" />
                </div>
                <span> {props.text} {props.code} {props.codeId} </span>
            </button>
        </>
    )
}