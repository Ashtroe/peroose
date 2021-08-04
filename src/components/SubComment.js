import React from 'react'
import { DateTime } from 'luxon'
import { BsReplyFill } from 'react-icons/bs'
import { TriangleUpIcon, TriangleDownIcon, Icon, ChatIcon, } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Text,
  Textarea,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Image,
  Center,
  HStack,
  IconButton,
  useDisclosure,
  Stack
} from "@chakra-ui/react";

export default function SubComment({comment}) {

    const {id, user, body, time, } = comment

    return (
      <Stack
        key={id}
        width='full'
        spacing={0}
        p={2}
        pb={0}
        alignSelf="flex-start"
        bg='gray.50'
        borderLeft='2px solid '
        borderColor='blue.200'
      >
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
          <IconButton size="xs" variant="ghost" icon={<TriangleUpIcon />} />
          <IconButton size="xs" variant="ghost" icon={<TriangleDownIcon />} />
          <IconButton size="xs" variant="ghost" icon={<BsReplyFill />} />
        </HStack>
      </Stack>
    );
}
