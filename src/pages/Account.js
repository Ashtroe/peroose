import React, { useRef, useState } from 'react'
import { useAuth } from '../context/authContext'
import {
  Box,
  Button,
  FormControl,
  Heading,
  Input,
  Textarea,
  Alert,
  AlertIcon,
  CloseButton,
  useDisclosure
} from "@chakra-ui/react";

export default function Account() {

    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const { resetPassword,changeEmail, login, logout, user } = useAuth()

    const emailRef = useRef()
    const passwordRef = useRef()
    const currentPasswordRef = useRef()
    const newPasswordRef = useRef()

    const {isOpen, onOpen, isClosed} = useDisclosure()

    let handleEmailChange = (e) =>{
        e.preventDefault()
        login(user.email, passwordRef.current.value)
        .then(userCred=>userCred.user.updateEmail(emailRef.current.value))
        .then(()=>setSuccess('email succesfully updated'))
        .then(()=>console.log(user.email))
        .catch((err)=>{
            console.log(err);
            setError('Failed to update email')
        })
    }

    let handlePasswordChange = (e) =>{
        e.preventDefault()
        console.log(currentPasswordRef.current.value);
        login(user.email, currentPasswordRef.current.value)
        .then(userCred=>userCred.user.updateProfile(
            {
                password:newPasswordRef.current.value
            })
        )
        .then(()=>setSuccess('password succesfully updated'))
        .catch((err)=>{
            console.log(err);
            setError('Failed to update password')
        })
    }

    const handleResetPassword = (e)=>{
        setError(null)
        e.preventDefault()

        resetPassword(user.email)
        .then(()=>setSuccess('Check your inbox for the reset link'))
        .catch(err=>{
            if(err){
                setError('Failed to send email')            
            }
        })
    }


    return (
        <Box>

            {error && 
            <Alert status='error'>
                <AlertIcon/>
                {error}
                <CloseButton onClick={onOpen} position="absolute" right="8px"/>
            </Alert>}

            {success && 
            <Alert status='success'>
                <AlertIcon/>
                {success}
                <CloseButton onClick={onOpen} position="absolute" right="8px"/>
            </Alert>}

            <form onSubmit={handleEmailChange}>
                <Heading fontSize='m' textAlign='center'>Change your email</Heading>
                <FormControl>
                    <Input placeholder={user.email} ref={emailRef}/>
                    <Input type='password' placeholder='Enter current password' ref={passwordRef}/>
                </FormControl>
                <Button type='submit'>Change Email</Button>

            </form>

            <form onSubmit={handlePasswordChange}>
                <Heading fontSize='m' textAlign='center'>Change your Password</Heading>
                <FormControl>
                    <Input type='password' placeholder='Enter current password' ref={currentPasswordRef}/>
                    <Input type='password' placeholder='Enter New Password' ref={newPasswordRef}/>
                </FormControl>
                <Button type='submit'>Change Password</Button>

            </form>

            <Button onClick={handleResetPassword}>Send Reset Email</Button>

            
        </Box>
    )
}
