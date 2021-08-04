import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import firebase from "../util/firebase";
import { DateTime } from "luxon";
import {
  Box,
  Spacer,
  Text,
  Stack,
  Link,
  Heading,
  HStack,
  IconButton,
  Image,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { TriangleUpIcon, TriangleDownIcon, ChatIcon } from "@chakra-ui/icons";
import { useHistory } from "react-router-dom";

export default function PostDesktop(props) {
  const [voted, setVoted] = useState(false);
  const db = firebase.firestore();
  const { user } = useAuth();

  let history = useHistory();

  let post = props.post;

  let upvote = () => {
    if (!user) {
      window.location.href = "/login";
    }

    db.collection("posts")
      .doc(post.postID)
      .update({ score: post.score + 1 });

    setVoted(true);
  };

  let downVote = () => {
    if (!user) {
      window.location.href = "/login";
    }

    db.collection("posts")
      .doc(post.postID)
      .update({ score: post.score - 1 });

    setVoted(true);
  };

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
      <HStack>
        <VStack alignSelf='flex-start' pt={5}>
          <IconButton
            aria-label="Upvote post"
            size="xs"
            variant='ghost'
            colorScheme={"blue"}
            icon={<TriangleUpIcon />}
            isDisabled={!voted ? false : true}
            onClick={() => {
              upvote();
            }}
          />
          <Text color={post.score > 0 ? "blue" : "red"}>{post.score}</Text>
          <IconButton
            aria-label="Downvote post"
            size="xs"
            variant='ghost'
            colorScheme={"red"}
            icon={<TriangleDownIcon />}
            isDisabled={!voted ? false : true}
            onClick={() => {
              downVote();
            }}
          />
        </VStack>

        <Stack>
          <Link href={`/sub/${post.sub}`}>
            <Text
              color={"blue.600"}
              textTransform={"uppercase"}
              fontWeight={800}
              fontSize={"sm"}
              letterSpacing={1.1}
            >
              {post.sub}
            </Text>
          </Link>

          <Link onClick={() => history.push(`/post/${post.postID}`)}>
            <Heading fontSize={"2xl"} fontFamily={"body"}>
              {post.title}
            </Heading>
          </Link>
          {post.img ? <Image src={post.img} /> : null}

          <Text color={"gray.500"}>{post.body}</Text>
          <Text color={"gray.400"}>{`by ${post.user}`}</Text>
          <Text color={"gray.500"}>
            {DateTime.fromSeconds(post.date.seconds).toLocaleString(
              DateTime.DATETIME_MED
            )}
          </Text>
        <HStack>
          <ChatIcon/>
          <Text>{post.comments ? post.comments : 0 }</Text>
        </HStack>
        </Stack>
      </HStack>
    </Box>
  );
}
