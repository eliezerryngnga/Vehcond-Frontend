import React from "react";
import {
  Box,
  Heading,
  HStack,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink, NavLink } from "react-router-dom";
import { MdOutlineSpaceDashboard } from "react-icons/md";

const AdminSidebar = () => {
  const links = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: <MdOutlineSpaceDashboard size={20} />,
    },
    {
      path: "/admin/applications",
      label: "Applications",
      icon: <MdOutlineSpaceDashboard size={20} />,
    },
    {
      path: "/admin/settings",
      label: "Settings",
      icon: <MdOutlineSpaceDashboard size={20} />,
    },
  ];

  return (
    <Stack
      display={{ base: "none", lg: "block" }}
      w={256}
      borderRight="1px"
      borderColor="border"
      bg={useColorModeValue("zinc.100", "zinc.950")}
      minH="100dvh"
      pos="fixed"
      top={0}
      left={0}
      py={7}
    >
      <Stack spacing={8}>
        <Box px={4}>
          <Link as={RouterLink} variant="logo" to="/admin/dashboard">
            <Heading size="md">Qtr.</Heading>{" "}
          </Link>
        </Box>

        <Stack px={4}>
          {links.map((link) => (
            <Link key={link.path} as={NavLink} variant="sidebar" to={link.path}>
              <HStack>
                <Box>{link.icon}</Box>
                <Text>{link.label}</Text>
              </HStack>
            </Link>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default AdminSidebar;
