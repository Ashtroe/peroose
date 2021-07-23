import React, {useContext, useState, useEffect} from 'react'
import { auth} from '../util/firebase'

const AuthContext = React.createContext()

export const useAuth = ()=>{
    return useContext(AuthContext)
}

export  function AuthProvider({children}) {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState()

    useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged(user=>{
            setUser(user)
            setLoading(false)
        }
    )

        return unsubscribe
    },[])

    let signup = async (email, password) =>{
        return auth.createUserWithEmailAndPassword(email, password)
    }

    let login = async (email,password) =>{
        return auth.signInWithEmailAndPassword(email, password)  
    }

    let logout = async () =>{
        return auth.signOut()
    }

    let resetPassword = async (email)=>{
        return auth.sendPasswordResetEmail(email)
    }

    let changeEmail = async (email) =>{
        return auth.updateEmail(email)
    }

    const value = {
        user,
        signup,
        login,
        logout, 
        resetPassword,
        changeEmail
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
