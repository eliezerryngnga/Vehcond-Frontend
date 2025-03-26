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
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import MdIcon from "../../core/MdIcon";
import { useFetchMenuLinks } from "../../../hooks/uiQueries";

const UsersSidebarDrawer = ({ isOpen, onClose }) => {
  // Queries
  const menuQuery = useFetchMenuLinks();
  const sortedMenu = menuQuery?.data?.data?.sort(
    (a, b) => a.sortOrder - b.sortOrder
  );

  return (
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
      <DrawerContent bg={useColorModeValue("white", "zinc.950")}>
        <DrawerCloseButton />
        <DrawerHeader>
          <Heading size="md">Vehicle Condemnation System</Heading>
        </DrawerHeader>

        <DrawerBody as="nav">
          <Stack spacing={1}>
            <Text fontSize="2xs" mb={2} letterSpacing="wider">
              Main 
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
            ))}
          </Stack>
        </DrawerBody>
        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
};

export default UsersSidebarDrawer;
