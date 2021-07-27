import React, { useState } from 'react'
import { useAuth } from '../context/authContext'
import firebase from '../util/firebase'
import { DateTime } from 'luxon'
import { Box, Spacer, Text, Stack, Link, Heading, HStack, IconButton, Image, } from '@chakra-ui/react'
import { TriangleUpIcon, TriangleDownIcon, Icon, ChatIcon, } from '@chakra-ui/icons'

export default function PostMobile(props) {
    const [voted, setVoted] = useState(false)
    const db = firebase.firestore()
    const {user} = useAuth()

    
    
    let post = props.post

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
    
    return (
      <Box
        maxW={"800px"}
        w={"full"}
        boxShadow={"lg"}
        rounded={"md"}
        p={6}
        m={10}
        overflow={"hidden"}
      >
        
        <Stack>
          <Link href={`/sub/${post.sub}`}>
            <Text
              color={"green.500"}
              textTransform={"uppercase"}
              fontWeight={800}
              fontSize={"sm"}
              letterSpacing={1.1}
              >
              {post.sub}
            </Text>
          </Link>
          <Link href={`post/${post.postID}`}>
            <Heading fontSize={"2xl"} fontFamily={"body"}>
              {post.title}
            </Heading>
          </Link>

          <Text color={"gray.500"}>{post.body}</Text>
              {post.img?<Image src={post.img} />:null}
        </Stack>
        <Stack mt={6} direction={"row"} spacing={4} align={"center"}>
          <HStack spacing={3} fontSize={"sm"}>
            <IconButton
              aria-label="Upvote post"
              size="xs"
              colorScheme={"blue"}
              icon={<TriangleUpIcon />}
              isDisabled={!voted?false:true}
              onClick={()=>{upvote()}}
            />
            <Text color={post.score > 0 ? "blue" : "red"}>{post.score}</Text>
            <IconButton
              aria-label="Downvote post"
              size="xs"
              colorScheme={"red"}
              icon={<TriangleDownIcon />}
              isDisabled={!voted?false:true}
              onClick={()=>{downVote()}}
            />
            <ChatIcon/>
            <Text>{post.comments ? post.comments : 0}</Text>
            <Text color={"gray.500"}>
              {DateTime.fromSeconds(post.date.seconds).toLocaleString(
                DateTime.DATE_SHORT
                )}
            </Text>
            <Text fontWeight={600}>{post.user}</Text>
          </HStack>
        </Stack>
      </Box>
    );
}
