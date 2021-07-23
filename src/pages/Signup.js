import {useRef, useState} from 'react'
import { useHistory } from 'react-router'
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
import firebase from '../util/firebase'


export default function Signup() {

    const db = firebase.firestore()
    const { signup, user } = useAuth()
    const [error, setError] = useState(null)
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const usernameRef = useRef(null)
    const history = useHistory()

    

    

    const handleSubmit = (e)=>{
        setError(null)
        e.preventDefault()

        signup(emailRef.current.value, passwordRef.current.value)
        .then((response)=>{
            db.collection('users')
                .add({
                    email:emailRef.current.value,
                    username:usernameRef.current.value,
                    subs:['First_sub', 'Second_sub', 'Third_sub'],
                    comments:[],
                    posts:[],
                })
        })
        .then(()=>history.push('/home'))
        .catch(err=>{
            if(err){
                setError(err.message)            
            }
        })
    }
    
    return (
    <form onSubmit={handleSubmit}>
        
        {error && 
            <Alert status='error'>
                <AlertIcon/>
                {error}

            </Alert>}
        <FormControl id="email" isRequired>
        <FormLabel>Email address</FormLabel>
        <Input type="email" ref={emailRef}/>
        <FormHelperText>We'll never share your email.</FormHelperText>
        </FormControl>

        <FormControl isRequired>
        <FormLabel>Username</FormLabel>
        <Input type="text" ref={usernameRef} isRequired/>
        </FormControl>

        <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <Input type="password" ref={passwordRef} isRequired/>
        </FormControl>

        <Button type={'submit'}>Sign Up</Button>
    </form>
    
    )
}
