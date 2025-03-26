import React from "react";
import Header from "../core/semantics/Header";
import { Link as RouterLink } from "react-router-dom";
import {
  Avatar,
  AvatarBadge,
  Divider,
  Heading,
  HStack,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Show,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  MdOutlineLogout,
  MdOutlineMenu,
  MdOutlinePerson,
} from "react-icons/md";

const AdminNavbar = ({ onOpen, openLogout }) => {
  const links = [
    { label: "Dashboard", path: "/user/dashboard" },
    { label: "My Learning", path: "/user/learning" },
    { label: "Courses", path: "/courses" },
  ];

  return (
    <Header maxW={null}>
      <HStack direction="row" justifyContent="space-between">
        {/* LHS */}
        <HStack>
          <Show below="lg">
            <IconButton
              variant="outline"
              icon={<MdOutlineMenu size={20} />}
              onClick={onOpen}
            />
          </Show>

          <Link as={RouterLink} variant="logo" to="/user/dashboard">
            <Heading size="md">Dashboard</Heading>{" "}
          </Link>
        </HStack>

        {/* RHS */}

        <Menu>
          <MenuButton
            rounded="full"
            _focusVisible={{
              ring: 2,
              ringColor: useColorModeValue("zinc.950", "white"),
              ringOffset: "2px",
              ringOffsetColor: "background",
            }}
          >
            <Avatar
              name="John Doe"
              ring="1px"
              ringColor={useColorModeValue("zinc.200", "zinc.800")}
              bg="background"
              color={useColorModeValue("zinc.950", "zinc.50")}
            >
              <AvatarBadge
                boxSize="1rem"
                bg="brand.600"
                borderColor={useColorModeValue("brand.100", "brand.900")}
              />
            </Avatar>
          </MenuButton>

          <MenuList>
            <MenuItem
              icon={<MdOutlinePerson size={16} />}
              onClick={() => navigate("/user/profile")}
            >
              Profile
            </MenuItem>

            <Divider />
            <MenuItem icon={<MdOutlineLogout size={16} />} onClick={openLogout}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Header>
  );
};

export default AdminNavbar;
