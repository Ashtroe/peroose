import {useEffect, useState, useRef} from 'react'
import { useHistory } from 'react-router'
import firebase from '../util/firebase'
import React from 'react'
import { useAuth } from '../context/authContext'
import { Box, FormLabel, Input, Alert, AlertIcon, FormControl, FormHelperText, Button, Link, Stack,  } from '@chakra-ui/react'


export default function Login() {
    const { login, demoLogin } = useAuth()
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
    let handleSubmitDemo = (e) =>{
        setError(null)
        e.preventDefault()
        demoLogin()
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
        <Stack 
            overflowY='hidden'
            width='full' 
            height={'100vh-64'}
            justify='center'
            align='center'
            p={50}
        >
            <Box 
                height='fit-content'
                width='30%'
                p={10}
                display='flex'
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                boxShadow={"lg"}
                rounded={"md"}
                bg='white'
            >
               

            {error && <Alert status='error'>
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
            
            <Button onClick={handleSubmit} mt={5} colorScheme='blue'>Log In</Button>
            <Button onClick={handleSubmitDemo} mt={5} colorScheme='blue'>Demo</Button>

            </Box>
            <Link href='/forgot' size='md'  fontWeight='semibold' color='white'>Forgot password?</Link>
            
        </Stack>
        
        
    )
}
