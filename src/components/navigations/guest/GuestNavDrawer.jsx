import React from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Link,
  Stack,
  Divider,
  Button,
  Heading,
} from "@chakra-ui/react";
import { NavLink, Link as RouterLink } from "react-router-dom";

const GuestNavDrawer = ({ isOpen, onClose }) => {
  const links = [
    { label: "Home", path: "/" },
    { label: "Manual", path: "/manual" },
    { label: "FAQ", path: "/faq" },
    { label: "Contact Us", path: "/contact-us" },
    { label: "Privacy Policy", path: "/privacy-policy" },
  ];

  return (
    <Drawer
      as="header"
      isOpen={isOpen}
      placement="top"
      onClose={onClose}
      // finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      {/* <DrawerContent bg={useColorModeValue("white", "zinc.950")}> */}
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          <Heading size="md">GAD Quarters</Heading>
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
            {/* <Button
              as={RouterLink}
              variant="brand"
              to="/auth/sign-in"
              onClick={onClose}
            >
              Official's Sign In
            </Button> */}
          </Stack>
        </DrawerBody>
        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
};

export default GuestNavDrawer;
