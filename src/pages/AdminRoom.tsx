import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom'
import logoImg from '../assets/images/logo.svg'
import emptyQuestion from '../assets/images/empty-questions.svg'
import Button from '../components/Button'
import { RoomCode } from '../components/RoomCode';
import toast, { Toaster } from 'react-hot-toast';
//import { useAuth } from '../hooks/useAuth';
import { database } from '../Services/fisebase';

import { Questions } from '../components/Questions'
import { Loading } from '../components/Loading'

import '../styles/room.scss'
import '../styles/admin.scss'
import '../styles/global.scss'
import '../styles/questions.scss'
import { useRoom } from '../hooks/useRoom';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';


type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const { user } = useAuth();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { title, questions, authorId, moderator } = useRoom(roomId);
    const history = useHistory();
    const [replyQuestion, setReplyQuestion] = useState(false);
    const [answered, setAnswered] = useState(false);
    const [spotlight, setSpotlight] = useState(false);
    // const [validate, setValidate] = useState(false)
    const [replyText, setReplyText] = useState('')
    const [inviteModeratorCode, setInviteModeratorCode] = useState('')
    const [loading, setLoading] = useState(true);
    const [openInvite, setOpenInvite] = useState(false);
    const notify = () => toast('Monitor convidado com sucesso.');

    // Link para a logo //
    function toHome() {
        history.push('/')
    }

    // Verificação de Autorização
    useEffect(() => {
        if (authorId !== undefined && user?.id !== undefined) {
            if (authorId === user.id || moderator === user.id) {
                setLoading(false);
            } else {
                //history.push(`/`)
            }
        }
    }, [authorId])

    // console.log(authorId)
    // console.log(user?.id)

    // if (authorId == user?.id) {

    // } else {
    //     history.push('/')
    // }
    // Encerrar sala //

    async function handleQuitRoom() {
        database.ref(`rooms/${roomId}`).update({
            endedAt: true,
        })

        history.push("/")
    }

    // function handleSendAnswser(event: FormEvent, questionId: string) {
    //     event.preventDefault();
    //     database.ref(`rooms/${roomId}/questions/${questionId}`).update({
    //         isAnswered: false,
    //     });
    //     console.log(questionId)
    //     setReplyText('')
    // }

    // Abrir input de pergunta //
    async function handleOpenInputAnswer(questionId: string) {
        setReplyQuestion(!replyQuestion)
        database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            openReply: replyQuestion,
        });

        // await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        //     isAnswered: true,
        // });
    }
    // Eu do futuro, temos um bug por aqui. Quando abre mais de uma pergunta, todos os inputs tem o mesmo valor, ainda nao consegui entender como resolver.

    // Responder a Pergunta
    async function handleSendAnswser(questionId: string) {

        if (replyText.trim() !== '') {
            setAnswered(true)
            await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
                replyContent: replyText,
            });
            await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
                isAnswered: true,
            });
            database.ref(`rooms/${roomId}/questions/${questionId}`).update({
                openReply: replyQuestion,
            });
        }
        setReplyText('')
    }

    //Apagar pergunta //

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm("Tem certeza que você deseja excluir essa pergunta")) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    // Convidar monitor
    function handleInviteToModeratorRoom() {
        setOpenInvite(!openInvite);
        if (inviteModeratorCode) {
            database.ref(`rooms/${roomId}`).update({
                moderatorId: inviteModeratorCode,
            });
            notify()
            setInviteModeratorCode('')
        }
    }

    //Destacar pergunta
    async function handleSpotlightQuestion(questionId: string) {
        setSpotlight(!spotlight);
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: spotlight,
        });
    }

    // if (authorId !== user?.id){ 
    //     console.log("Foi")
    // } else {
    //     history.push('/')
    // }

    if (loading) {
        return <Loading />
    }
    return (
        <>
            <header>
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
                <div className="container-header">
                    <img className="logo" src={logoImg} alt="Logo da empresa" onClick={toHome} />
                    <div className="buttons-header">
                        <RoomCode code={params.id} />
                        {user?.id === moderator ? '' :
                            <>
                                {openInvite ? <input className="inviteModerator" value={inviteModeratorCode} onChange={event => setInviteModeratorCode(event.target.value)} /> : ''}
                                <Button onClick={handleInviteToModeratorRoom} color="pattern">Convidar monitor</Button>
                                <Button onClick={handleQuitRoom} color="pattern">Encerrar a sala </Button>
                            </>
                        }
                    </div>
                </div>
            </header>
            <main>
                <div className="container-questions">
                    <div className="header-questions">
                        <h2>Sala {title}</h2>
                        {questions.length > 0 && <span className="questions-lenght"> {questions.length} pergunta{questions.length === 1 ? '' : 's'} </span>}
                    </div>
                    {questions.length == 0 && 
                    <div className="empty"><img src={emptyQuestion} /><h2>Nenhuma pergunta por enquanto :/</h2><span>Mande o código da sala para seus alunos, <br/> para que eles tirem as dúvidas!</span></div> }
                        {questions.map(question => {
                            return (
                                <>
                                    <Questions
                                        moderatorId={question.moderatorId}
                                        key={question.id}
                                        content={question.content}
                                        author={question.author}
                                        isHighlighted={question.isHighlighted}
                                        isAnswered={question.isAnswered}
                                        replyContent={question.replyContent}
                                        openReply={question.openReply}
                                        date={question.date}
                                        admin={true}
                                        reply={
                                            question.openReply &&
                                            <div
                                                //onSubmit={() => handleSendAnswser(question.id)}
                                                className="reply"
                                            >
                                                <input value={replyText} type="text" onChange={event => setReplyText(event.target.value)}></input>
                                                <Button onClick={() => handleSendAnswser(question.id)} color="pattern">Enviar resposta</Button>
                                            </div>
                                        }
                                    >
                                        <button
                                            type="button"
                                            className="check-question"
                                            onClick={() => handleOpenInputAnswer(question.id)}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12.0003" cy="11.9998" r="9.00375" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>

                                        </button>
                                        <button
                                            type="button"
                                            className="reply-question"
                                            onClick={() => handleSpotlightQuestion(question.id)}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            className="delete-question"
                                            onClick={() => handleDeleteQuestion(question.id)}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 5.99988H5H21" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </Questions>
                                </>
                            )
                        })}
                </div>
            </main>
        </>
    )
}