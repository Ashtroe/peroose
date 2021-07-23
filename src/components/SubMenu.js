import React from 'react'
import { Box, Spacer, Text, Stack, Link, Heading, } from '@chakra-ui/react'

export default function SubMenu(props) {
    
    
    
    return (
        <Box
          maxW={'445px'}
          w={'full'}
          boxShadow={'2xl'}
          rounded={'md'}
          p={6}
          overflow={'hidden'}>
          {props.subs.map(sub=>{
            <Text>{sub.name}</Text>
          })}
        </Box>
    )
}
