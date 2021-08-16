import {React, useEffect, useState} from 'react'
import { useParams } from 'react-router'
import { useAuth } from '../context/authContext'
import firebase from '../util/firebase'

import { sortByNew, sortByScore } from '../util/sort'
import {
  Box,
  Button,
  Flex,
  HStack,
  Link,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuIcon,
  MenuCommand,
  MenuDivider,
  ChevronDownIcon,
  Spinner,
  Heading
} from "@chakra-ui/react";
import PostMobile from '../components/PostMobile'
import { AddIcon, CloseIcon } from '@chakra-ui/icons'
export default function SubPage() {

    const db = firebase.firestore()
    const storage = firebase.storage()
    const FieldValue = firebase.firestore.FieldValue

    const [loading, setLoading] = useState(null)
    const [userData, setUserData] = useState(null)
    const [posts, setPosts] = useState(null)
    const [subButtonText, setSubButtonText] = useState('Subscribe')
    const [subButtonColor, setSubButtonColor] = useState('green')

    const { user } = useAuth()
    const { sub } = useParams()

    useEffect(()=>{
        user && db.collection('users')
        .where('email', '==', user.email)
        .get()
        .then((data)=>{
          setUserData({
            id: data.docs[0].id,
            ...data.docs[0].data()
          })
        })
      },[])

      useEffect(()=>{
        db.collection('posts')
        .where('sub', '==', sub)
        .get()
        .then((data)=>{
          let posts = data.docs.map(post=>({
            postID:post.id,
            date:post.date,
            ...post.data()
          }))
          setPosts(posts)
          setLoading(false)
        })
      },[])

      useEffect(()=>{
        if(userData && userData.subs.includes(sub)){
          setSubButtonText('Unsubscribe')
          setSubButtonColor('red')
        }
      },[userData])

      let followSub = () =>{
        db.collection('users')
          .doc(userData.id)
          .update({subs:FieldValue.arrayUnion(sub)})
          .then(()=>(setSubButtonText('Unsubscribe'), setSubButtonColor('red')))
          
      }
      let unfollowSub = () =>{
        db.collection('users')
          .doc(userData.id)
          .update({subs:FieldValue.arrayRemove(sub)})
          .then(()=>(setSubButtonText('Subscribe'), setSubButtonColor('green')))
          
      }

      let handleSubscribe = () =>{
        switch (subButtonText) {
          case 'Subscribe':
            followSub()
            break;
          case 'Unsubscribe':
            unfollowSub()
            break;
        }
      }
    
    return (
        <Stack justify='center' align={"center"} >
        <Heading>{sub}</Heading>
        <Stack>

          <HStack>
            <Button s='sm' onClick={()=>setPosts(sortByNew(posts))}>New</Button>
            <Button s='sm' onClick={()=>setPosts(sortByScore(posts))}>Score</Button>
            <Button s='sm' colorScheme={subButtonColor} onClick={handleSubscribe}>{subButtonText}</Button>
          </HStack>

        </Stack>
        {loading === false && posts? (
          posts.map((post) => {
            return <PostMobile key={post.id} post={post} />;
          })
        ) : (
          <Spinner/>
        )}
        <Link href="/create">New Post</Link>
      </Stack>
    )
}
