import { useEffect, useState, createContext, ReactNode } from "react";
import { firebase, auth } from '../Services/fisebase'
import { Loading } from '../components/Loading'

type User = {
    id: string,
    name: string,
    avatar: string,
}

type AuthContextType = {
    user: User | undefined;
    messageError: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithFacebook: () => Promise<void>;
    logout: () => Promise<void>;
}
type AuthContextProviderProps = {
    children: ReactNode,
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {

    const [user, setUser] = useState<User>();
    const [ messageError, setMessageError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                const { displayName, photoURL, uid } = user

                if (!displayName || !photoURL) {
                    throw new Error('Sem informações da sua conta Google')
                }

                setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL,
                })

                setLoading(false)
            }
        })

        return () => {
            unsubscribe();
        }
    }, [])

    async function signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);
        if (result.user) {
            const { displayName, photoURL, uid } = result.user

            if (!displayName || !photoURL) {
                throw new Error('Sem informações da sua conta Google')
            }

            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL,
            })
        }
    };

    async function signInWithFacebook() {
        await auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).catch(function (error) {
            if (error.code === 'auth/account-exists-with-different-credential') {
                setMessageError(true)
                
            }})
        const provider = new firebase.auth.FacebookAuthProvider();
        const result = await auth.signInWithPopup(provider);

            if (result.user) {
                const { displayName, photoURL, uid } = result.user

                if (!displayName || !photoURL) {
                    throw new Error('Sem informações da sua conta Google')
                }

                setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL,
                })

            }
        

    };
    async function logout() {
        await firebase.auth().signOut();

        setUser(undefined);

    }
    return (
        <AuthContext.Provider value={{ user, signInWithGoogle, signInWithFacebook, logout, messageError }}>
            {props.children}
        </AuthContext.Provider>
    );
}