import {React, useEffect, useState, useRef} from 'react'
import { useParams } from 'react-router'
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  Textarea,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Image,
  Center,
} from "@chakra-ui/react";
import { useAuth } from '../context/authContext'
import firebase from '../util/firebase'
import { DateTime } from 'luxon'


export default function PostPage() {
    const db = firebase.firestore()
    const { post } = useParams()
    const { user } = useAuth()

    const [postData, setPostData] = useState(null)
    const [commentData, setCommentData] = useState([])
    const [postLoading, setPostLoading] = useState(true)
    const [commentLoading, setCommentLoading] = useState(true)

    const replyRef = useRef(null)
    const commentReplyRef = useRef(null)

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

      let commentReply = () =>{

      }

    
    return (
      <div>
        {!postLoading && postData ? (
          <Flex 
            align='center'
            direction="column"
            >
            <Text>{postData.title}</Text>
            <Image src={postData.img} boxSize="xl" />
            <Text>{postData.body}</Text>
          </Flex>
        ) : (
          <Text>Loading</Text>
        )}
        <Divider />
        <Flex
          align='center'
          direction='column'
          >
          <Textarea w="lg" placeholder="Enter your Reply here" ref={replyRef} />
          <Button onClick={postReply}>Reply</Button>
          <Accordion allowToggle>
            {commentData.map((comment) =>
              comment.subComments ? (
                <AccordionItem key={comment.id}>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <Text fontSize="sm">{comment.user}</Text>
                      {comment.body}
                      <Text fontSize="xs">
                        {DateTime.fromSeconds(
                          comment.time.seconds
                        ).toLocaleString(DateTime.DATETIME_MED)}
                      </Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  {comment.subComments &&
                    comment.subComments.map((subcomment) => (
                      <AccordionPanel pb={4} key={subcomment.id}>
                        <Text fontSize="sm">{subcomment.body}</Text>
                      </AccordionPanel>
                    ))}
                </AccordionItem>
              ) : (
                <Box key={comment.id}>
                  <Text fontSize="xs">
                    {DateTime.fromSeconds(comment.time.seconds).toLocaleString(
                      DateTime.DATETIME_MED
                    )}
                  </Text>
                  <Text>{comment.body}</Text>
                </Box>
              )
            )}
          </Accordion>
        </Flex>
      </div>
    );
}
