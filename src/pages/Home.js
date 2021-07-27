import {React, useEffect, useState} from 'react'
import { sortByNew, sortByOld, sortByScore } from '../util/sort'
import { useAuth } from '../context/authContext'
import useViewport from '../hooks/useViewport'
import firebase from '../util/firebase'
import {BsFilterLeft} from 'react-icons/bs'
import { GrNew } from "react-icons/gr"; 
import { WiTime4 } from 'react-icons/wi'
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons'
import PostMobile from '../components/PostMobile'
import PostDesktop from '../components/PostDesktop'
import {
  Button,
  HStack,
  Link,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner,
  IconButton,
  MenuDivider
} from "@chakra-ui/react";


export default function Home() {
    const db = firebase.firestore()
    const storage = firebase.storage()
    const [userData, setUserData] = useState(null)
    const [posts, setPosts] = useState(null)
    const [loading, setLoading] = useState(true)
    const {login, logout, user } = useAuth()
    const { width } = useViewport()

    useEffect(() => {
      user && db.collection("users")
        .where("email", "==", user.email)
        .get()
        .then((data) => {
          setUserData(data.docs[0].data());
        })

        
    },[])

    useEffect(() => {
      if (userData) {
        db.collection("posts")
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
          });
      } else {
        db.collection("posts")
          .get()
          .then((data) => {
            let posts = data.docs.map((post) => ({
              postID: post.id,
              date: post.date,
              ...post.data(),
            }));
            setPosts(posts);
            setLoading(false);
          });
      }
    }, [userData]);

    if(width>1024){
      return (
        <Stack  direction={"column"} justify='center' align={"center"} >
          <HStack>
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
  
            <Menu >
              <MenuButton as={IconButton} icon={<BsFilterLeft/>}></MenuButton>
              <MenuList >
                <MenuItem  icon={<GrNew/>} onClick={()=>sortByNew(posts, setPosts)}>Newest</MenuItem>
                <MenuItem  icon={<WiTime4/>} onClick={()=>sortByOld(posts, setPosts)}>Oldest</MenuItem>
                <MenuDivider/>
                <MenuItem  icon={<ArrowUpIcon/>} onClick={()=>sortByScore('ascend',posts,setPosts)}>Score Asc.</MenuItem>
                <MenuItem  icon={<ArrowDownIcon/>} onClick={()=>sortByScore('descend',posts,setPosts)}>Score Desc.</MenuItem>
              </MenuList>
            </Menu>
  
          </HStack>
          {loading === false && posts? (
            
            posts.map((post) => {
              return <PostDesktop key={post.id} post={post} />;
            })
            
          ) : (
            <Spinner/>
          )}
          <Link href="/create">New Post</Link>
        </Stack>
      );
    }else{
      return(
        <Stack justify='center' align={"center"}>
          {loading === false && posts? (
            
            posts.map((post) => {
              return <PostMobile key={post.id} post={post} />;
            })
            
          ) : (
            <Spinner/>
          )}

        </Stack>
      )
    }

    


    
    
}

