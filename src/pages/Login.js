import {useEffect, useState, useRef} from 'react'
import { useHistory } from 'react-router'
import firebase from '../util/firebase'
import React from 'react'
import { useAuth } from '../context/authContext'
import { Box, FormLabel, Input, Stack, Alert, AlertIcon, FormControl, FormHelperText, Button, Link,  } from '@chakra-ui/react'


export default function Login() {
    const { login, user } = useAuth()
    const [error, setError] = useState(null)
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const history = useHistory()

    let handleSubmit = (e) =>{
        setError(null)
        e.preventDefault()
        login(emailRef.current.value, passwordRef.current.value)
        .then(()=>{
            history.push('/home')
        })
        .catch(err=>{
            if(err){
                setError(err.message)            
            }
        })
    }
    return (
        <Box>
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
                <FormLabel>Password</FormLabel>
                <Input type="password" ref={passwordRef} isRequired/>
                </FormControl>
                
                <Button type={'submit'}>Log In</Button>
            </form>

            <Link href={'/forgot'}>Forgot password?</Link>
        </Box>
        
    )
}
