import {React, useEffect, useState} from 'react'
import { sortByNew, sortByScore } from '../util/sort'
import { useAuth } from '../context/authContext'
import firebase from '../util/firebase'
import Post from '../components/Post'
import { DateTime } from 'luxon'
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
  Spinner
} from "@chakra-ui/react";


export default function Home() {
    const db = firebase.firestore()
    const storage = firebase.storage()
    const [userData, setUserData] = useState(null)
    const [posts, setPosts] = useState(null)
    const [loading, setLoading] = useState(true)
    const {login, logout, user } = useAuth()

    useEffect(() => {
      db.collection("users")
        .where("email", "==", user.email)
        .get()
        .then((data) => {
          setUserData(data.docs[0].data());
        })
    },[])

    useEffect(()=>{
     userData ? db.collection("posts")
            .where("sub", "in", userData.subs)
            .get()
            .then((data) => {
              let posts = data.docs.map((post) => ({
                postID: post.id,
                date: post.date,
                ...post.data(),
              }));
              setPosts(posts);
              setLoading(false);
            }) : console.log('no user data');
        },[userData]);

    return (
      <Stack  direction={"column"} justify='center' align={"center"} >
        <Stack>
          <Menu>
            <MenuButton as={Button} >
              Home
            </MenuButton>
            <MenuList >
              {userData && userData.subs.map(sub=>(
                <Link href={`sub/${sub}`} key={sub}>
                  <MenuItem key={`menuItem-${sub}`}>{sub}</MenuItem>
                </Link>
              ))}
            </MenuList>
          </Menu>

          <HStack>
            <Button s='sm' onClick={()=>sortByNew(posts)}>New</Button>
            <Button s='sm' onClick={()=>sortByScore(posts)}>Score</Button>
          </HStack>

        </Stack>
        {loading === false && posts? (
          posts.map((post) => {
            return <Post key={post.id} post={post} />;
          })
          
        ) : (
          <Spinner/>
        )}
        <Link href="/create">New Post</Link>
      </Stack>
    );
}

