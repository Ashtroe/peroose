import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {
  HStack,
  IconButton, Stack, Text
} from "@chakra-ui/react";
import { DateTime } from 'luxon';
import React from 'react';
import { BsReplyFill } from 'react-icons/bs';

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
