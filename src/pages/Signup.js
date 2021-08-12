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
    Stack,
    Link
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
                    email:emailRef.current.value.toLowerCase(),
                    username:usernameRef.current.value,
                    subs:['Funny'],
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
                    <FormControl isRequired>

            <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input type="email" ref={emailRef}/>
                <FormHelperText>We'll never share your email.</FormHelperText>
            </FormControl>
            
            <FormLabel>Username</FormLabel>
                <Input type="text" ref={usernameRef} isRequired/>
            </FormControl>

            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input type="password" ref={passwordRef} isRequired/>
            </FormControl>
            
            <Button onClick={handleSubmit} mt={5} colorScheme='blue'>Sign Up</Button>

            </Box>
            <Link href='/forgot' size='md'  fontWeight='semibold' color='white'>Forgot password?</Link>
            
        </Stack>
    
    )
}
