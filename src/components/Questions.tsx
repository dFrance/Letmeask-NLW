import '../styles/questions.scss'
import '../styles/footerQuestions.scss'
import { ReactNode } from 'react'
import cx from 'classnames'
// import Button from '../components/Button'
//import { database } from '../Services/fisebase'
//import { useParams } from 'react-router-dom'

type QuestionProps = {
    content: string;
    moderator?: string;
    replyContent: string;
    author: {
        name: string;
        avatar: string;
    };
    children?: ReactNode;
    reply?: ReactNode;
    isAnswered?: boolean;
    isHighlighted?: boolean;
    openReply?: boolean;
    admin?: boolean;
    
}

// type RoomParams = {
//     id: string;
// }

export function Questions({
    content,
    moderator,
    replyContent,
    author,
    isAnswered = false,
    isHighlighted = false,
    children,
    reply,
    // openReply = false,
    // admin = false,
}: QuestionProps) {

    // const [validate, setValidate] = useState<boolean>();

    // useEffect(() => {
    //     if (replyContent) {
    //         setValidate(true)
    //     } else {
    //         setValidate(false)
    //     }
    // }, [replyContent]);

    // Enviando a resposta //
    //const params = useParams<RoomParams>();
    //const roomId = params.id;

    //--------------------------- //


    return (
        <>
            <div className={cx(
                'questions',
                { answered: isAnswered },
                { highlighted: isHighlighted },
            )}
            >
                <p className={isAnswered ? "message" : ''}>{content}</p>
                <div className="footer-questions">
                    <div className="message-auth">
                        <img src={author.avatar} alt={author.name} />
                        <div>{author.name}</div>
                    </div>
                    <div>
                        {children}
                    </div>
                </div>
                {replyContent && 
                <div className="reply-content">
                    <span>
                        Resposta do professor ou monitor:
                    </span>
                    <p>
                        {replyContent}
                    </p>
                </div>
                }
                {/* {admin && openReply ?
                    <form 
                    onSubmit={() => handleSendAnswser(question.id)} 
                    className="reply"
                    >
                    <input value={replyText} type="text" onChange={event => setReplyText(event.target.value)}></input>
                    <Button color="pattern">Enviar resposta</Button>
                </form> : ''} */}
            </div>
            {reply}
        </>
    )
}