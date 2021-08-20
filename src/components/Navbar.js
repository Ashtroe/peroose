import { EditIcon, HamburgerIcon } from '@chakra-ui/icons'
import {
  Accordion,
  AccordionButton,
  AccordionIcon, AccordionItem, AccordionPanel, Avatar, Button, ButtonGroup, Divider, Drawer,
  DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter,
  DrawerOverlay, Flex,
  HStack, IconButton, Image, Link, Menu,
  MenuButton,
  MenuList, Text, useDisclosure,
  VStack
} from "@chakra-ui/react"
import { React, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router'
import { useAuth } from '../context/authContext'
import useViewport from '../hooks/useViewport'
import firebase from '../util/firebase'


export default function Navbar() {
    const db = firebase.firestore()
    const { logout, user } = useAuth()
    const { width } = useViewport()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef()

    const history = useHistory()

    const [userData, setUserData] = useState()

    useEffect(() => {
      user && db.collection("users")
        .where("email", "==", user.email.toLowerCase())
        .get()
        .then((data) => {
          data.docs[0] && setUserData(data.docs[0].data());
        })
    },[])

    // Desktop Not Signed In
    if (width >=1024 && !user){
      return(
        <HStack
        position='relative'
        width='full'
        height='fit-content'
        p={3}
        justify='space-between'
        bg='white'
        >
        

        <Link href='/'>
          <Image
            src='/img/logo.png'
            width={100}
          />
        </Link>

        <ButtonGroup>
          <Button variant='ghost'>
            <Link href="/login">
              Log In
            </Link>
          </Button>
          <Button variant='outline' colorScheme='blue'>
            <Link href="/signup">
              Sign Up
            </Link>
          </Button>
        </ButtonGroup>

      </HStack>
      )
      
    }

    // Desktop signed in
    if (width >=1024 && user){
      return(
        <HStack
        position='relative'
        width='full'
        height='fit-content'
        p={3}
        justify='space-between'
      >
        <Link href={user? '/home' : '/all'}>
          <Image
            src='/img/logo.png'
            width={100}
          />
        </Link>
        <Menu>
          <Avatar
            as={MenuButton}
            m="1rem"
            width="10"
            height="10"
            top="2"
          />
          <MenuList display="flex" flexDir="column" alignItems="center">
            <Text fontSize='xl' fontWeight='bold' color='blue.600'>{userData && userData.username}</Text>
            <Divider/>
            <Link to="/account" display="flex" justifyContent="center" fontWeight='semibold'>
              Edit Account
            </Link>
            <Button
              colorScheme="red"
              mt="1rem"
              width={"60%"}
              display="flex"
              justifyContent="center"
              onClick={() => (logout(), history.push('/all'))}
            >
              Logout
            </Button>
          </MenuList>
        </Menu>
      </HStack>
      )
      

    }

    // Mobile
    if (width < 1024){
      return(
        <Flex direction="column" mt={5}>
            <IconButton
              icon={<HamburgerIcon />}
              ref={btnRef}
              onClick={onOpen}
              alignSelf="flex-end"
              mr={8}
            />
            <Drawer
              isOpen={isOpen}
              placement="right"
              onClose={onClose}
              finalFocusRef={btnRef}
            >
              <DrawerOverlay />
              <DrawerContent pt={5}>
                <DrawerCloseButton />

                <DrawerBody position="relative">
                  <VStack>
                    {!user ? (
                      <VStack>
                        <Link href="/home">Home</Link>
                        <Link href="/signup">
                          <Button colorScheme="blue" >
                            Sign Up
                          </Button>
                        </Link>
                        <Link href="/login">
                          <Button colorScheme="blue" variant='ghost' >
                            Log In
                          </Button>
                        </Link>
                      </VStack>
                    ) : (
                      <VStack>
                        <Link href="/home">Home</Link>
                        <Accordion allowToggle={true}>
                          <AccordionItem>
                            <AccordionButton>
                              Your subs
                              <AccordionIcon />
                            </AccordionButton>
                            {userData &&
                              userData.subs.map((sub) => (
                                <AccordionPanel>
                                  <Link href={`/sub/${sub}`}>{sub}</Link>
                                </AccordionPanel>
                              ))}
                          </AccordionItem>
                        </Accordion>
                        <Link href="/account">Account</Link>
                        <Link href="/create">
                          <Button colorScheme="blue" rightIcon={<EditIcon />}>
                            Post
                          </Button>
                        </Link>
                      </VStack>
                    )}
                  </VStack>
                </DrawerBody>

                <DrawerFooter display="flex" justifyContent="center">
                  <Button colorScheme="red">Logout</Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </Flex>
      )
    }
}
