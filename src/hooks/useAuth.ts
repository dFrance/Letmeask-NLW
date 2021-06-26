import { useContext } from 'react';
import { AuthContext} from '../context/AuthContext'

export function useAuth() {
    const valueAuth = useContext(AuthContext)


    return valueAuth
}