import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom'
import { useEffect, useState, FormEvent } from 'react';

import logoImg from '../assets/images/logo.svg'
import Button from '../components/Button'
import {Loading} from '../components/Loading'
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { database } from '../Services/fisebase';

import { Questions } from '../components/Questions'

import '../styles/room.scss'
import '../styles/global.scss'
import '../styles/footerQuestions.scss'
import { useRoom } from '../hooks/useRoom';


type RoomParams = {
    id: string;
}

export function Room() {
    const { user } = useAuth();
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const [newQuestion, setNewQuestion] = useState('');
    const [loading, setLoading] = useState(true);
    //const [reply, setReply] = useState('');
    const [validate, setValidate] = useState(false)

    const { title, questions, endedAt } = useRoom(roomId);
    
    
    //Verificação de sala online 
    useEffect(() => {
        if (endedAt !== undefined) {
            if (endedAt === false) {
                setLoading(false);
            } else {
                history.push(`/`)
            }
        }
        console.log(endedAt)
    }, [endedAt])

    // Verificação de conteúdo da questão //

    useEffect(() => {
        if (newQuestion.trim() === '') {
            setValidate(true)
        } else {
            setValidate(false)
        }
    }, [newQuestion]);


    // Dar like
    async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
        if (likeId) {
            await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove()
        } else {
            await database.ref(`rooms/${roomId}/questions/${questionId}/likes/`).push({
                authorId: user?.id,
            })
        }
    }

    // Enviando a pergunta //
    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();

        if (newQuestion.trim() === '') {
            return;
        }

        if (!user) {
            console.log('Please')
        }

        const question = {
            content: newQuestion,
            replyContent: '',
            author: {
                name: user?.name,
                avatar: user?.avatar,
            },
            isHighlighted: false,
            isAnswered: false,
        };

        await database.ref(`rooms/${roomId}/questions`).push(question);

        setNewQuestion('')
    }
    // --------------------------- //

    // Link para a logo //
    function toHome() {
        history.push('/')
    }

    if (loading) {
        return <Loading />
    }
    return (
        <>
            <header>
                <div className="container-header">
                    <img className="logo" src={logoImg} alt="Logo da empresa" onClick={toHome} />
                    <div className="buttons-header">
                        <RoomCode text={"Seu código pessoal"} codeId={user?.id || "Carregando..."} />
                        <RoomCode text={"Código da sala"} code={params.id} />
                    </div>
                </div>
            </header>
            <main>
                <div className="container-questions">
                    <div className="header-questions">
                        <h2>Sala {title}</h2>
                        {questions.length > 0 && <span className="questions-lenght"> {questions.length} pergunta{questions.length === 1 ? '' : 's'} </span>}
                    </div>
                    <form onSubmit={handleSendQuestion}>
                        <textarea
                            className="question"
                            placeholder="Qual a sua dúvida?"
                            onChange={event => setNewQuestion(event.target.value)}
                            value={newQuestion}
                        >
                        </textarea>
                        <div className="footer-question">
                            {!user ?
                                <div className="message-auth">
                                    Para enviar uma pergunta, <button onClick={toHome} className="make-login">faça seu login.</button>
                                </div>
                                :
                                <div className="message-auth">
                                    <img src={user.avatar} alt={user.name} />
                                    <div>{user.name}</div>
                                </div>
                            }
                            <Button color="pattern"
                                disabled={!user || validate}
                            >Enviar pergunta</Button>
                        </div>

                    </form>
                    {questions.map(question => {
                        return (
                            <Questions
                                key={question.id}
                                moderator={question.moderator}
                                content={question.content}
                                author={question.author}
                                replyContent={question.replyContent}
                                openReply={question.openReply}
                                isHighlighted={question.isHighlighted}
                                isAnswered={question.isAnswered}
                            >
                                <button
                                    className={`like-button ${question.likeId ? 'liked' : ''}`}
                                    type="button"
                                    aria-label="Marcar como gostei"
                                    onClick={() => handleLikeQuestion(question.id, question.likeId)}>
                                    {question.likeCount > 0 && <span>{question.likeCount}</span>}
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </Questions>
                        )
                    })}
                </div>
            </main>
        </>
    )
}