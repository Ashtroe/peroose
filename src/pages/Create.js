import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/authContext'
import firebase from '../util/firebase'
import { DateTime } from 'luxon'
import {
  Button,
  Flex,
  FormControl,
  Input,
  InputGroup,
  Textarea,
  Alert, 
  AlertIcon
} from "@chakra-ui/react";

export default function Create() {
    const db = firebase.firestore()
    const { user } = useAuth()

    const [userData, setUserData] = useState(null)
    const [error, setError] = useState(null)

    let titleRef = useRef()
    let imgRef = useRef()
    let bodyRef = useRef()
    let subRef = useRef()

    useEffect(()=>{
        db.collection('users')
            .where('email', '==', user.email)
            .get()
                .then((data)=>{
                    setUserData(data.docs[0].data())
                })
    },[])

    let createPost = (e) =>{
        e.preventDefault()
        if(titleRef.current.value === ''){
            setError('Title cannot be empty')
        }else{
            db.collection('posts')
          .add({
            sub:subRef.current.value,
            user:userData.username,
            body: bodyRef.current.value,
            img:imgRef.current.value,
            score: 1,
            time: new Date()
            
          })
          .then((response)=>window.location.href = `/post/${response.id}`)
          .catch((err)=>{
              setError(err)
          })
        }
        
    }
    return (
        <form onSubmit= {createPost}>
            {error && 
            <Alert status='error'>
                <AlertIcon/>
                {error}

            </Alert>}
            <FormControl isRequired>
                <Input placeholder='Sub' ref={subRef} />
            </FormControl>
            <FormControl isRequired>
                <Input placeholder='Post title' ref={titleRef} />
            </FormControl>
            <FormControl >
                <Input placeholder='Image URL' ref={imgRef} />
            </FormControl>
            <FormControl isRequired>
                <Textarea placeholder='Write post here' ref={bodyRef} />
            </FormControl>
            <Button type='submit'>Create Post</Button>
        </form>
    )
}
