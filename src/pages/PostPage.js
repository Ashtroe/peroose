import {React, useEffect, useState, useRef} from 'react'
import { useHistory } from 'react-router'
import useViewport from '../hooks/useViewport'
import Comment from '../components/Comment'
import { useParams } from 'react-router'
import { useAuth } from '../context/authContext'
import firebase from '../util/firebase'
import { DateTime } from 'luxon'
import { BsReplyFill } from 'react-icons/bs'
import { TriangleUpIcon, TriangleDownIcon, HamburgerIcon} from '@chakra-ui/icons'
import {
  Button,
  Flex,
  Heading,
  Text,
  Textarea,
  Image,
  HStack,
  IconButton,
  Stack,
  Link,
  Menu,
  MenuList,
  MenuButton
} from "@chakra-ui/react";


export default function PostPage() {
    const db = firebase.firestore()
    const { post } = useParams()
    const { user } = useAuth()

    const history = useHistory()

    const { width } = useViewport()
    
    const replyRef = useRef('')
    const commentReplyRef = useRef(null)

    const [postData, setPostData] = useState(null)
    const [commentData, setCommentData] = useState([])
    const [userData, setUserData] = useState(null)
    const [postLoading, setPostLoading] = useState(true)
    const [commentLoading, setCommentLoading] = useState(true)
    const [voted, setVoted] = useState(false)
    const [replyDisplay, setReplyDisplay] = useState('none')

    // Get Post 
    useEffect(()=>{
        db.collection('posts').doc(post)
        .get()
        .then((data)=>{
            setPostLoading(false)
            setPostData(data.data());
        })
      },[])

      // Get User data 
      useEffect(() => {
        user && db.collection("users")
          .where("email", "==", user.email)
          .get()
          .then((data) => {
            data.docs[0] && setUserData(data.docs[0].data());
          })
      },[])

    // Get Comments 
      useEffect(()=>{
        
          db.collection('comments')
          .where('postID', '==', post )
          .get()
            .then((data)=>{
             let comments = data.docs.map(comment=>(
               {
                 id:comment.id,
                 ...comment.data()
               }
             ))
             setCommentData(comments)
             setCommentLoading(false)
            })
            .catch(err=>console.log(err))

      },[])

      let postReply= () =>{
        
        db.collection('comments')
          .add({
            user:user.displayName,
            body: replyRef.current.value,
            postID: post,
            score: 1,
            time: new Date()
            
          })
          .then(()=>window.location.reload())
      }

      let upvote= ()=>{
        if(!user){
          window.location.href = '/login'
        }
        
        db.collection('posts')
          .doc(post.postID)
          .update({score:post.score + 1})
        
        setVoted(true)
      }
  
      let downVote= ()=>{
        if(!user){
          window.location.href = '/login'
        }
        
        db.collection('posts')
          .doc(post.postID)
          .update({score:post.score - 1})
        
        setVoted(true)
      }

      let commentReply = () =>{

      }

      let handleDelete = () =>{
        db.collection('posts')
          .doc(post)
          .delete()
            .then(()=>{
              console.log(`"${postData.title}" succesfully deleted`);
              history.push('/home')
            })
            .catch((error) => {
              console.error('Error removing document: ', error);
            });
      }

    
    if (postLoading || !postData){
      return (
        <Text>Loading</Text> 
      )
    }

    if(!postLoading && postData && width <= 960){
      return (
        <Stack align='center' p={2}>
          <Flex direction="column" pl={5} pr={5}>
            <Heading mb={2} size="lg">
              {postData.title}
            </Heading>
            {postData.img && <Image src={postData.img} boxSize='fit-content' fit='contain' />}
            <Text>{postData.body}</Text>
            <Link>{postData.sub}</Link>
          </Flex>
          <HStack
            w="90%"
            spacing={2}
            mt={5}
            borderTop="2px solid"
            borderBottom="2px solid"
            borderColor="gray.200"
          >
            <IconButton
              aria-label="Upvote post"
              size="xs"
              colorScheme={"blue"}
              icon={<TriangleUpIcon />}
              variant='ghost'
              isDisabled={!voted ? false : true}
              onClick={() => {
                upvote();
              }}
            />
            <Text>{postData.score}</Text>
            <IconButton
              aria-label="Downvote post"
              size="xs"
              colorScheme={"red"}
              icon={<TriangleDownIcon />}
              variant='ghost'
              isDisabled={!voted ? false : true}
              onClick={() => {
                downVote();
              }}
            />
            <IconButton
              aria-label="Reply"
              size="xs"
              ml={10}
              icon={<BsReplyFill />}
              variant='ghost'
              onClick={() => setReplyDisplay("block")}
            />
            
          </HStack>
          <Flex w="100%" alignItems="center" direction="column" p={5}>
          <Textarea
            w="xs"
            minH="10"
            pb={1}
            placeholder="Enter your Reply here"
            variant="filled"
            display={replyDisplay}
            ref={replyRef}
          />
          <Button mt={3} display={replyDisplay} onClick={postReply}>
            Reply
          </Button>
          <Stack w="100%" alignSelf="flex-start" alignItems="flex-start">
            {commentData.length > 0 && commentData.map(comment => (
              <Comment comment={comment} isSub={false} />
            ))}
            {commentData <= 0 && <Text alignSelf='center' textAlign='center' color='gray.300'>No Comments yet</Text>}
          </Stack>
        </Flex>
      </Stack>
      )
    }

    if(!postLoading && postData && width > 960){
      return (
        <Stack align='center' p={150} pt={5}>
          <Flex direction="column" width='full' >
            <Link onClick={()=>history.push(`/sub/${postData.sub}`)}>{postData.sub}</Link>
            <Heading mb={2} size="lg">
              {postData.title}
            </Heading>
            {postData.img && <Image src={postData.img} boxSize='fit-content' fit='contain' />}
            <Text>{postData.body}</Text>
          </Flex>
          <HStack
            w="full"
            spacing={2}
            p={1}
            borderTop="2px solid"
            borderBottom="2px solid"
            borderColor="gray.200"
          >
            <IconButton
              aria-label="Upvote post"
              size="lg"
              colorScheme={"blue"}
              icon={<TriangleUpIcon />}
              variant='ghost'
              isDisabled={!voted ? false : true}
              onClick={() => {
                upvote();
              }}
            />
            <Text>{postData.score}</Text>
            <IconButton
              aria-label="Downvote post"
              size="lg"
              colorScheme={"red"}
              icon={<TriangleDownIcon />}
              variant='ghost'
              isDisabled={!voted ? false : true}
              onClick={() => {
                downVote();
              }}
            />
            <IconButton
              aria-label="Reply"
              size="lg"
              ml={10}
              icon={<BsReplyFill />}
              variant='ghost'
              onClick={() => setReplyDisplay("block")}
            />
            <Menu>
              <MenuButton as={HamburgerIcon} ></MenuButton>
              <MenuList w='fit-content' display="flex" flexDir="column" alignItems="center" >
                {userData && userData.username === postData.user && <Button colorScheme='red' onClick={handleDelete}>Delete</Button>}
              </MenuList>
            </Menu>
          </HStack>
          <Flex w="100%" alignItems="center" direction="column" p={0}>
          <Textarea
            w="xs"
            minH="10"
            pb={1}
            placeholder="Enter your Reply here"
            variant="filled"
            display={replyDisplay}
            ref={replyRef}
          />
          <Button mt={3} display={replyDisplay} onClick={postReply}>
            Reply
          </Button>
          <Stack w="full" alignSelf="flex-start" alignItems="flex-start">
            {commentData.length > 0 && commentData.map(comment => (
              <Comment comment={comment} isSub={false} />
            ))}
            {commentData <= 0 && <Text alignSelf='center' textAlign='center' color='gray.300'>No Comments yet</Text>}
          </Stack>
        </Flex>
      </Stack>
      )
    }

    
}
