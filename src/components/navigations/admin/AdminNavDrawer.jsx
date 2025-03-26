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
} from "@chakra-ui/react";
import { NavLink, Link as RouterLink } from "react-router-dom";

const AdminNavDrawer = ({ isOpen, onClose }) => {
  const links = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "My Learning", path: "/admin/learning" },
  ];

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
          <Heading size="md">Qtr.</Heading>
        </DrawerHeader>

        <DrawerBody as="nav">
          <Stack divider={<Divider />} spacing={4}>
            {links.map((link) => (
              <Link
                key={link.path}
                as={NavLink}
                variant="nav"
                to={link.path}
                color="dark.500"
                onClick={onClose}
              >
                {link.label}
              </Link>
            ))}
          </Stack>
        </DrawerBody>
        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
};

export default AdminNavDrawer;
