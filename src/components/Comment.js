import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import {
  HStack,
  IconButton, Stack, Text
} from "@chakra-ui/react"
import { DateTime } from 'luxon'
import React from 'react'
import { BsReplyFill } from 'react-icons/bs'
import SubComment from './SubComment'

export default function Comment({comment}) {

    const {id, user, body, subComments, time, } = comment
    
    

    return (
      <>
        <Stack key={id} spacing={0} pl={2} alignSelf="flex-start"  width='full' borderRadius={5} bg='gray.50'>
                <Text fontSize="xs" textAlign="left">
                  {DateTime.fromSeconds(time.seconds).toLocaleString(
                    DateTime.DATE_SHORT
                  )}
                </Text>
                <Text fontSize="sm" fontWeight="bold">
                  {user}
                </Text>
                <Text>{body}</Text>
                <HStack>
                  <IconButton
                    size="xs"
                    variant="ghost"
                    icon={<TriangleUpIcon />}
                  />
                  <IconButton
                    size="xs"
                    variant="ghost"
                    icon={<TriangleDownIcon />}
                  />
                  <IconButton
                    size="xs"
                    variant="ghost"
                    icon={<BsReplyFill />}
                  />
                </HStack>
                
                {/* SubComments  */}
              </Stack>
                {subComments && subComments.map(comment=><SubComment comment={comment}/>)}
                </>
    )
}
