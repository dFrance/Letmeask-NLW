import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import illustrationImg from '../assets/images/illustration.svg'
import GoogleImg from '../assets/images/google-icon.svg'
import FacebookImg from '../assets/images/facebook-icon.svg'
import LogoLMA from '../assets/images/logo.svg'
import Button from '../components/Button'
import { useState, useEffect, FormEvent } from 'react'
import { database } from '../Services/fisebase';
import { useAuth } from '../hooks/useAuth';


export function Home() {
    const [desativar, setDesativar] = useState(true);
    const [value, setValue] = useState('');
    const history = useHistory();
    const [roomNotFound, setRoomNotFound] = useState(false);
    const [roomStoped, setRoomStoped] = useState(false);
    const { signInWithGoogle, signInWithFacebook, logout, user, messageError } = useAuth()
    const roomCode = value

    // Criar conta com google ou facebook //
    async function handleCreateRoomFacebook() {
        if (!user?.name || user?.name === "UnLogged") {
            await signInWithFacebook()
            history.push('/rooms/new')
            console.log(messageError)
        } else {
            history.push('/rooms/new')
        }
    }

    async function handleCreateRoomGoogle() {
        if (!user?.name || user?.name === "UnLogged") {
            await signInWithGoogle()
            history.push('/rooms/new')
        } else {
            history.push('/rooms/new')
        }
    }
    // --------------------------------------------- //

    // Criar uma sala logado //
    function handleCreateRoomLogged() {
        history.push('/rooms/new')
    }
    //---------------------------//

    //Deslogar//
    function handleLogOut() {
        logout()
        history.push('/')
    }
    // --------------------------- //

    // Habilitar/Desbilitar botão de acordo com o value //

    useEffect(() => {
        if (value.trim() !== '') {
            setDesativar(!value);
        }
    }, [value]);
    // -------------------------------------//

    // Entrar em uma sala existente //

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();
        if (roomCode.trim() === '') {
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if (!roomRef.exists()) {
            setRoomNotFound(true)
            return
        } 

        if (roomRef.val().endedAt === true) {
            setRoomStoped(true);
            return
        }

        history.push(`/rooms/${roomCode}`)
    }

    //---------------------------//
    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Illustração simbolizando perguntas e respostas" />
                <strong>
                    Todas as duvidas sobre sua aula!
                </strong>
                <p>
                    Uma site para organizar as perguntas sobre sua aula em tempo real.
                </p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={LogoLMA} alt="" />
                    {user?.name && user?.name !== 'UnLogged' ? <>
                        <Link className="toProfile" to="/">
                            <h2>Olá {user?.name}
                                <p>
                                    <button onClick={() => handleLogOut()}>Não é você?</button>
                                </p>
                            </h2>
                        </Link>
                    </>
                        : ''}
                    {!user?.name || user?.name === 'UnLogged' ?
                        <div className="align-buttons">
                            <Button
                                type="button"
                                onClick={handleCreateRoomGoogle}
                                color={'google'}
                                LoggedClasse={!user?.name || user?.name === 'UnLogged' ? "create-room" : "create-room-logged"}
                            >
                                <img src={GoogleImg} alt="" />
                                Entre com sua conta do Google
                            </Button>
                            <Button
                                type="button"
                                onClick={handleCreateRoomFacebook}
                                color={"facebook"}
                                LoggedClasse={!user?.name || user?.name === 'UnLogged' ? "create-room" : "create-room-logged"}>
                                <img src={FacebookImg} alt="" />
                                Entre com sua conta do Facebook
                            </Button>
                            {messageError === true ? <h5 className="error">Você já se cadastrou usando uma conta google.</h5> : ''}
                        </div> :
                        <Button
                            color={"pattern"}
                            LoggedClasse={user?.name || user?.name === 'UnLogged' ? "create-room" : "create-room-logged"}
                            onClick={handleCreateRoomLogged}
                        >Criar uma sala</Button>
                    }
                    <div className="separator">
                        ou entre em uma sala
                    </div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                            value={value}
                            type="text"
                            onChange={e => setValue(e.target.value)}
                            placeholder="Digite o código da sala"
                        />
                        {roomNotFound === true ? <h5 className="error">Nenhuma sala foi encontrada com esse código.</h5> : ''}
                        {roomStoped === true ? <h5 className="error">A sala que você deseja conectar foi pausada ou encerrada.</h5> : ''}
                        <Button
                            type="submit"
                            disabled={desativar}
                            color={'pattern'}
                        >
                            Acessar uma sala
                        </Button>
                    </form>
                </div>
            </main >
        </div >
    )
}