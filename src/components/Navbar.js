import {React, useEffect, useState, useRef} from 'react'
import useViewport from '../hooks/useViewport'
import { useAuth } from '../context/authContext'
import firebase from '../util/firebase'
import {
    Button,
    Flex,
    HStack,
    Link,
    Text,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    IconButton,
    useDisclosure,
    VStack,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuGroup,
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionPanel,
    AccordionItem,
    Divider,
    Spacer,
    Image,
    ButtonGroup
  } from "@chakra-ui/react";
import { EditIcon, HamburgerIcon } from '@chakra-ui/icons';


export default function Navbar() {
    const db = firebase.firestore()
    const { logout, user } = useAuth()
    const { width } = useViewport()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef()

    const [userData, setUserData] = useState()

    useEffect(() => {
      user && db.collection("users")
        .where("email", "==", user.email)
        .get()
        .then((data) => {
          setUserData(data.docs[0].data());
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
        <Link href='/'>
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
            <Link to="/account" display="flex" justifyContent="center" fontWeight='semibold'>
              Edit Account
            </Link>
            <Button
              colorScheme="red"
              mt="1rem"
              width={"60%"}
              display="flex"
              justifyContent="center"
              onClick={() => logout()}
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
                        <Accordion>
                          <AccordionButton>
                            Popular Subs
                            <AccordionIcon />
                          </AccordionButton>
                        </Accordion>
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
                      </VStack>
                    )}
                    <Link href="/create">
                      <Button colorScheme="blue" rightIcon={<EditIcon />}>
                        Post
                      </Button>
                    </Link>
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
