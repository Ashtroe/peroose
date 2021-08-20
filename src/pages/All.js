import { ArrowDownIcon, ArrowUpIcon, EditIcon, SunIcon } from '@chakra-ui/icons'
import {
  Button, ButtonGroup, Flex, Heading, Link, Spinner, Stack
} from "@chakra-ui/react"
import { React, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import PostDesktop from '../components/PostDesktop'
import PostMobile from '../components/PostMobile'
import { useAuth } from '../context/authContext'
import useViewport from '../hooks/useViewport'
import firebase from '../util/firebase'
import { sortByNew, sortByScore } from '../util/sort'


export default function All() {
    const db = firebase.firestore()
    const storage = firebase.storage()

    const [userData, setUserData] = useState(null)
    const [posts, setPosts] = useState(null)
    const [subs, setSubs] = useState(null)
    const [loading, setLoading] = useState(true)

    const [filterNew, setFilterNew] = useState(false)
    const [filterHot, setFilterHot] = useState(false)
    const [filterTop, setFilterTop] = useState(false)
    const [filterCont, setFilterCont] = useState(false)
    
    const {user } = useAuth()

    const { width } = useViewport()

    const history = useHistory()


    useEffect(() => {
      user && db.collection("users")
        .where("email", "==", user.email)
        .get()
        .then((data) => {
          data.docs[0] && setUserData(data.docs[0].data());
        })
    },[])

    useEffect(() => {
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
            sortByScore('ascend', posts, setPosts)
          });
    }, [userData]);

   

        // Get all subs 
        useEffect(()=>{
          db.collection('subs')
          .get()
          .then((data)=>{
            let allSubs = data.docs.map((sub)=>sub.id)
            setSubs(allSubs)
          })
        },[])

    
    if(width>960){
      
      return (
        <Flex justify='center'  mt={5} pb={20}>
          <Stack  justify="center" align={"center"}>
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
            <Heading>Popular Subs</Heading>
            {subs && subs.map(sub=>(
              <Link fontWeight='semibold' textAlign='left' onClick={()=>history.push(`/sub/${sub}`)}>{sub}</ Link>
            ))}
          </Stack>
          <Button as={Link} href='/create' size='lg' colorScheme='blue' rightIcon={<EditIcon/>}>Post</Button>
        </Stack>
          

        </Flex>
      );
    }
  return (
    <Stack justify='center' align={"center"} p={5}>
      {loading === false && posts ? (

        posts.map((post) => {
          return <PostMobile key={post.id} post={post} />;
        })

      ) : (
        <Spinner />
      )}

    </Stack>
  )

    


    
    
}

