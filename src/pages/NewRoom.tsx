import illustrationImg from '../assets/images/illustration.svg'
import LogoLMA from '../assets/images/logo.svg'
import Button from '../components/Button'
import { useState, useEffect } from 'react'
import {Link, useHistory} from 'react-router-dom';
import { FormEvent } from 'react';
import {database, firestore} from '../Services/fisebase'
import { useAuth } from '../hooks/useAuth';

export function NewRoom() {
    
    const [disabled, setDisabled] = useState(true);
    const [value, setValue] = useState('');
    const {user} = useAuth();
    const history = useHistory();
    const date = +new Date();

    function makeid(length: any) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
     charactersLength));
       }
       return result;
    }

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();

        if (value.trim() === '') {
            return
        }

        const roomRef = database.ref(`rooms/`);
        const roomRefFire = firestore.collection(`rooms`).doc(makeid(6)).set({
            title: value,
            authorId: user?.id,
            moderatorId: '',
            endedAt: false,
        });

        const firebaseRoom = await roomRef.push({
            title: value,
            authorId: user?.id,
            moderatorId: '',
            endedAt: false,
        })

        history.push(`/admin/rooms/${firebaseRoom.key}`)
    }

    useEffect(() => {
        setDisabled(!value);
      }, [value]);

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Illustração simbolizando perguntas e respostas" />
                <strong>
                    Todas as duvidas sobre sua apresentação!
                </strong>
                <p>
                    Uma platafoma para unificar e organizar as perguntas sobre sua apresentação
                </p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={LogoLMA} alt="" />
                    {/* <button className="create-room">
                        <img src={GoogleImg} alt=""/>
                        Entre com sua conta do Google
                    </button> */}
                    {/* <div className="separator">
                        ou entre em uma sala
                    </div> */}
                    <h1>
                        
                    </h1>
                    <h2>
                        Olá {user?.name}, quer criar uma nova sala?
                     </h2>
                    <form onSubmit={handleCreateRoom}>
                        <input
                            value={value}
                            type="text"
                            onChange={event => setValue(event.target.value)}
                            placeholder="Nome da sala"
                        />
                        <Button
                            type="submit"
                            disabled={disabled}
                            color="pattern"
                        >
                            Criar uma sala
                        </Button>
                        <p>
                            Quer entrar em uma sala já existente? <Link to="/">Clique aqui</Link>
                        </p>
                    </form>
                </div>
            </main>
        </div>
    )
}