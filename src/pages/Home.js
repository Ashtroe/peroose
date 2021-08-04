import {React, useEffect, useState} from 'react'
import { sortByNew, sortByOld, sortByScore } from '../util/sort'
import { useAuth } from '../context/authContext'
import useViewport from '../hooks/useViewport'
import firebase from '../util/firebase'
import {BsFilterLeft} from 'react-icons/bs'
import { GrNew } from "react-icons/gr"; 
import { WiTime4 } from 'react-icons/wi'
import { ArrowDownIcon, ArrowUpIcon, EditIcon, SunIcon } from '@chakra-ui/icons'
import PostMobile from '../components/PostMobile'
import PostDesktop from '../components/PostDesktop'
import {
  Box,
  Button,
  Heading,
  HStack,
  Link,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner,
  IconButton,
  MenuDivider,
  ButtonGroup,
  useBoolean,
  Flex,
  VStack,
  Divider
} from "@chakra-ui/react";
import { useHistory } from 'react-router-dom'


export default function Home() {
    const db = firebase.firestore()
    const storage = firebase.storage()

    const [userData, setUserData] = useState(null)
    const [posts, setPosts] = useState(null)
    const [loading, setLoading] = useState(true)

    const [filterNew, setFilterNew] = useState(false)
    const [filterHot, setFilterHot] = useState(false)
    const [filterTop, setFilterTop] = useState(false)
    const [filterCont, setFilterCont] = useState(false)
    
    const {login, logout, user } = useAuth()

    const { width } = useViewport()

    const history = useHistory()


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

    

    if(width>960){
      return (
        <Flex justifyContent='center' mt={5}>
          <Stack direction={"column"} justify="center" align={"center"}>
            <ButtonGroup>
              <Button
                isActive={filterNew}
                leftIcon={<SunIcon />}
                onClick={() => {
                  setFilterNew(true);
                  setFilterHot(false);
                  setFilterTop(false);
                  setFilterCont(false);
                  sortByNew(posts, setPosts);
                }}
              >New
              </Button>

              <Button
                isActive={filterTop}
                leftIcon={<ArrowUpIcon />}
                onClick={() => {
                  setFilterNew(false);
                  setFilterHot(false);
                  setFilterTop(true);
                  setFilterCont(false);
                  sortByScore("ascend", posts, setPosts);
                }}
              >
                Top
              </Button>

              <Button
                isActive={filterCont}
                leftIcon={<ArrowDownIcon />}
                onClick={() => {
                  setFilterNew(false);
                  setFilterHot(false);
                  setFilterTop(false);
                  setFilterCont(true);
                  sortByScore('descend',posts, setPosts);
                }}
              >
                Controversial
              </Button>
            </ButtonGroup>
          {loading === false && posts ? (
            posts.map((post) => {
              return <PostDesktop key={post.id} post={post} />;
            })
          ) : (
            <Spinner />
          )}
        </Stack>
          <Stack align='center' height='fit-content' ml={10}>
            <Stack 
              align='center'
              width='xs'
              height='fit-content'
              
              p={5}
              bg='gray.50'
              rounded={"md"}
            >
              <Heading>Subs</Heading>
              {userData && userData.subs.map(sub=>(
                <Link fontWeight='semibold' onClick={()=>history.push(`/sub/${sub}`)}>{sub}</ Link>
              ))}
            </Stack>
            <Button as={Link} href='/create' size='lg' colorScheme='blue' rightIcon={<EditIcon/>}>Post</Button>

          </Stack>

        </Flex>
      );
    }else{
      return(
        <Stack justify='center' align={"center"} p={5}>
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

