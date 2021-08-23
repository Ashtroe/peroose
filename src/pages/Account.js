import React, { useRef, useState, useEffect } from 'react'
import { useAuth } from '../context/authContext'
import firebase from '../util/firebase'
import {
  Box,
  Button,
  FormControl,
  Heading,
  Input,
  Alert,
  AlertIcon,
  CloseButton,
  useDisclosure,
  Stack,
  Center
} from "@chakra-ui/react";

export default function Account() {

    const db = firebase.firestore()
    const storage = firebase.storage()

    const [userData, setUserData] = useState(null)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const { resetPassword, login, user } = useAuth()

    const emailRef = useRef()
    const passwordRef = useRef()
    const currentPasswordRef = useRef()
    const newPasswordRef = useRef()

    const { onOpen} = useDisclosure()

    useEffect(() => {
        user && db.collection("users")
          .where("email", "==", user.email)
          .get()
          .then((data) => {
            data.docs[0] && setUserData(data.docs[0].data());
          })
      },[])

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
        <Stack>
            <Stack w='80%' p={5} align='center' alignSelf='center' boxShadow={"lg"} rounded={"md"}>
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
                
                <Stack w='md' p={5}  >
                    <Heading fontSize='m' textAlign='center'>Change your email</Heading>
                    <FormControl >
                        <Input mt={3} placeholder={userData.email} ref={emailRef}/>
                        <Input mt={3} type='password' placeholder='Enter current password' ref={passwordRef}/>
                    </FormControl>
                    <Button type='submit' colorScheme='blue' onClick={handleEmailChange}>Change Email</Button>
                </Stack>
                
                
                <Stack w='md' p={5}>
                    <Heading fontSize='m' textAlign='center'>Change your Password</Heading>
                    <FormControl>
                        <Input mt={3} type='password' placeholder='Enter current password' ref={currentPasswordRef}/>
                        <Input mt={3} type='password' placeholder='Enter New Password' ref={newPasswordRef}/>
                    </FormControl>
                    <Button type='submit' colorScheme='blue' onClick={handlePasswordChange}>Change Password</Button>
                
                </Stack>
                
                <Button colorScheme='blue' variant='ghost' onClick={handleResetPassword}>Send Reset Email</Button>
            </Stack>
        </Stack>
        
    )
}
