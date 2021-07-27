import {React, useEffect, useState} from 'react'
import { useParams } from 'react-router'
import { useAuth } from '../context/authContext'
import firebase from '../util/firebase'
import { DateTime } from 'luxon'
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
export default function SubPage() {

    const db = firebase.firestore()
    const storage = firebase.storage()

    const [loading, setLoading] = useState(null)
    const [userData, setUserData] = useState(null)
    const [posts, setPosts] = useState(null)

    const { user } = useAuth()
    const { sub } = useParams()

    useEffect(()=>{
        db.collection('users')
        .where('email', '==', user.email)
        .get()
        .then((data)=>{
          setUserData(data.docs[0].data())
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
          posts && console.log(posts);
          setPosts(posts)
          setLoading(false)
        })
      },[])
    
    return (
        <Stack direction={"column"} justify='center' align={"center"} >
        <Heading>{sub}</Heading>
        <Stack>

          <HStack>
            <Button s='sm' onClick={()=>setPosts(sortByNew(posts))}>New</Button>
            <Button s='sm' onClick={()=>setPosts(sortByScore(posts))}>Score</Button>
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
