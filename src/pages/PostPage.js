import {React, useEffect, useState, useRef} from 'react'
import Comment from '../components/Comment'
import { useParams } from 'react-router'
import { useAuth } from '../context/authContext'
import firebase from '../util/firebase'
import { DateTime } from 'luxon'
import { BsReplyFill } from 'react-icons/bs'
import { TriangleUpIcon, TriangleDownIcon} from '@chakra-ui/icons'
import {
  Button,
  Flex,
  Heading,
  Text,
  Textarea,
  Image,
  HStack,
  IconButton,
  Stack
} from "@chakra-ui/react";


export default function PostPage() {
    const db = firebase.firestore()
    const { post } = useParams()
    const { user } = useAuth()
    
    const replyRef = useRef('')
    const commentReplyRef = useRef(null)

    const [postData, setPostData] = useState(null)
    const [commentData, setCommentData] = useState([])
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

    
    return (
      <Stack alignItems="center">
        {!postLoading && postData ? (
          <>
            <Flex direction="column" pl={5} pr={5}>
              <Heading mb={2} size="lg">
                {postData.title}
              </Heading>
              {postData.img && <Image src={postData.img} boxSize='fit-content' fit='contain' />}
              <Text>{postData.body}</Text>
            </Flex>
            <HStack
              w="90%"
              spacing={2}
              mt={5}
              pt={2}
              pb={2}
              borderTop="2px solid"
              borderBottom="2px solid"
              borderColor="gray.200"
            >
              <IconButton
                aria-label="Upvote post"
                size="xs"
                colorScheme={"blue"}
                icon={<TriangleUpIcon />}
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
                onClick={() => setReplyDisplay("block")}
              />
            </HStack>
          </>
        ) : (
          <Text>Loading</Text>
        )}

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
            {commentData.map(comment => (
              <Comment comment={comment} />
            ))}
          </Stack>
        </Flex>
      </Stack>
    );
}
