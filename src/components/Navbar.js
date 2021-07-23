import React from 'react'
import useViewport from '../hooks/useViewport'
import { useAuth } from '../context/authContext'
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
    MenuGroup
  } from "@chakra-ui/react";
import { HamburgerIcon } from '@chakra-ui/icons';


export default function Navbar() {
    const { logout, user } = useAuth()
    const { width } = useViewport()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()
    
    return (
      <>
        {width >= 1024 ? (
          <HStack spacing={3} p={1} as="nav" justify="center" align="center">
            {!user ? (
              <>
                <Link href="/home">
                  <Text fontSize="lg">Home</Text>
                </Link>
                <Link href="/signup">
                  <Text fontSize="lg">sign up</Text>
                </Link>
                <Link href="/account">
                  <Text fontSize="lg">account</Text>
                </Link>
                <Link right={2} position={"absolute"} href="/login">
                  SignIn
                </Link>
              </>
            ) : (
              <Menu>
                <Avatar
                  as={MenuButton}
                  m="1rem"
                  position="absolute"
                  right={3}
                  width="10"
                  height="10"
                  top="2"
                />
                <MenuList display="flex" flexDir="column" alignItems="center">
                  <Link to="/account" display="flex" justifyContent="center">
                    Account
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
            )}
          </HStack>
        ) : (
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
              placement="top"
              onClose={onClose}
              finalFocusRef={btnRef}
            >
              <DrawerOverlay />
              <DrawerContent pt={5}>
                <DrawerCloseButton />

                <DrawerBody>
                  <VStack>
                    <Link href="/home">
                      <Text fontSize="med">Home</Text>
                    </Link>
                    <Link href="/signup">
                      <Text fontSize="med">sign up</Text>
                    </Link>
                    <Link href="/account">
                      <Text fontSize="med">account</Text>
                    </Link>
                  </VStack>
                </DrawerBody>

                <DrawerFooter></DrawerFooter>
              </DrawerContent>
            </Drawer>
          </Flex>
        )}
      </>
    );
}
