import {useEffect, useRef, useState} from 'react'
import { useHistory } from 'react-router'
import {firebase, auth} from '../util/firebase'
import firebaseui from 'firebaseui'
import {
    Form,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Box,
    Button,
    Text,
    Alert,
    AlertIcon,
  } from "@chakra-ui/react"
import React from 'react'
import { useAuth } from '../context/authContext'


export default function Signup() {

    const { resetPassword } = useAuth()
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)
    const emailRef = useRef(null)

    

    

    const handleSubmit = (e)=>{
        setError(null)
        e.preventDefault()

        resetPassword(emailRef.current.value)
        .then(()=>setMessage('Check your inbox for the reset link'))
        .catch(err=>{
            if(err){
                setError(err.message)            
            }
        })
    }
    
    return (
    <form onSubmit={handleSubmit}>
        
        {error && <Alert status='error'><AlertIcon/>{error}</Alert>}
        {message && <Alert status='success'><AlertIcon/>{message}</Alert>}
        <FormControl id="email" isRequired>
        <FormLabel>Email address</FormLabel>
        <Input type="email" ref={emailRef}/>
        </FormControl>

        <Button type={'submit'}>Reset Password</Button>
    </form>
    
    )
}
