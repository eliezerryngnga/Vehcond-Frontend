import React from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useColorModeValue,
  Link,
  Stack,
  Divider,
  Heading,
  HStack,
  Text,
  Box,
  IconButton,

} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

import { useFetchMenuLinks } from "../../../hooks/uiQueries";

import { MdOutlineMenu } from "react-icons/md";

import UsersSidebar from "./UsersSidebar";

import UsersSidebar1 from "./UsersSidebar1";

const UsersSidebarDrawer = ({ isOpen, onOpen, onClose, navHeight }) => {
  // Queries
  const menuQuery = useFetchMenuLinks();
  const sortedMenu = menuQuery?.data?.data?.sort(
    (a, b) => a.sortOrder - b.sortOrder
  );

  return (
  
  <Box 
    bg="blue"
    position="fixed"
    top={20}

    zIndex="10"
    roundedTopRight={29}
    roundedBottomRight={29}
  >
     <IconButton
                  variant="ghost"
                  icon={<MdOutlineMenu size={20} />}
                  onClick={onOpen}
                  color="white"
                />
                
    <Drawer
      as="header"
      isOpen={isOpen}
      placement="left"
      onClose={onClose}
      // finalFocusRef={btnRef}
      
    >
      <DrawerOverlay
        bg="blackAlpha.700"
        backdropFilter="auto"
        backdropBlur="18px"
        backdropSaturate="180%"
      />
      <DrawerContent bg={useColorModeValue("white", "zinc.950")} mt={navHeight}>
        {/* <DrawerCloseButton /> */}   
        {/* <DrawerHeader>
          <Heading size="md">GAD Quarters</Heading>
        </DrawerHeader>*/}
        <DrawerCloseButton /> 

        <DrawerBody as="nav">
          <Stack spacing={1}>

          {/* <UsersSidebar /> */}

          <UsersSidebar1 />

            {/* <Text fontSize="2xs" mb={2} letterSpacing="wider">
              MENU
            </Text>
            {sortedMenu?.map((link) => (
              <Link
                key={link.url}
                as={NavLink}
                variant="sidebar"
                to={link.url}
                onClick={onClose}
              >
                <HStack>
                  <MdIcon iconName={link.icon} />
                  <Text>{link.label}</Text>
                </HStack>
              </Link>
            ))} */}

          </Stack>
        </DrawerBody>
        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  </Box>
    
  );
};

export default UsersSidebarDrawer;
