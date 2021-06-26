import { useEffect, useState } from "react";
import { database } from "../Services/fisebase";
import { useAuth } from "./useAuth";

type QuestionType = {
    id: string;
    replyContent: string;
    openReply: boolean;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount: number;
    likeId: string | undefined;
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    openReply: boolean;
    replyContent: string;
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<string, {
        authorId: string;
    }>
}>

export function useRoom(roomId: string) {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState();
    const [authorId, setAuthorId] = useState();
    const openReply = useState(false);
    
    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', room => {
            const databaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    openReply: value.openReply,
                    replyContent: value.replyContent,
                    author: value.author,
                    isAnswered: value.isAnswered,
                    isHighlighted: value.isHighlighted,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
                }
            })
            setTitle(databaseRoom.title)
            setAuthorId(databaseRoom.authorId)
            setQuestions(parsedQuestions)
        })

        return ( ) => {
            roomRef.off('value')
        }
    }, [roomId, user?.id]);

    return {questions, title, openReply, authorId}

    
    
}