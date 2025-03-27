import { Box, Collapse, Heading, HStack, Link, Stack, Text } from "@chakra-ui/react";

import { Link as RouterLink, NavLink } from "react-router-dom";

import { useFetchMenuLinks } from "../../../hooks/uiQueries";

import MdIcon from "../../core/MdIcon";

import { MdArrowDropDown, MdDirectionsCar, MdArrowRight } from "react-icons/md";
import { useState } from "react";

const UsersSidebar = ({ profile }) => {

  // Queries
  const menuQuery = useFetchMenuLinks();

  const sortedMenu = menuQuery?.data?.data?.sort(
    (a, b) => a.sortOrder - b.sortOrder
  );

  const[openSubmenu, setOpenSubMenu] = useState({});

  const toggleSubMenu = (urlCode) =>
  {
    setOpenSubMenu((prev) => ({
      ...prev,
      [urlCode] : !prev[urlCode],
    }));
  };

  const handleLinkClick = (event, link) => 
  {
    if(link.subProcessName)
    {
      event.preventDefault();
      toggleSubMenu(link.urlCode);
    }
  }

  const groupMenuItems = (menuItems) => {
    return menuItems?.reduce((groups, item) => {
      if (item.showInMenu) {
        if (!groups[item.processName]) {
          groups[item.processName] = [];
        }
        groups[item.processName].push(item);
      }
      return groups;
    }, {});
  };

  const groupedMenu = groupMenuItems(sortedMenu);

  return (
    <Stack
      display={{ base: "none", lg: "block" }}
      w={256}
      borderColor="border"
      bg="paperSecondary"
      minH="100dvh"
      pos="fixed"
      top={0}
      left={0}
      py={7}
    >
      <Stack spacing={8}>

        <Box px={4} textAlign="left">
          <Link
            as={RouterLink}
            variant="logo"
            to={
              profile?.role === "USER"
                ? "/user/dashboard"
                : profile?.role === "DA"
                ? "/da/dashboard"
                : profile?.role === "CH"
                ? "/ch/dashboard"
                : profile?.role === "CS"
                ? "/cs/dashboard"
                : ""
            }
          >
          </Link>
        </Box>

        {/* Menu */}
        <Stack spacing={1} mt={10}>
          {Object.entries(groupedMenu || {}).map(([processName, items]) => {
            const mainLink = items[0]; 
            return (
              <Box key={processName}>
                <Link
                  as={NavLink}
                  // variant="sidebar"
                  to={mainLink.pageurl}
                  onClick={(e) => handleLinkClick(e, mainLink)}
                  _hover={{ textDecor: "none", color: "blue.500" }}
                  _active={{ textDecor: "none", color: "blue.500" }}
                  _focus={{ outline: "none" }}
                  _visited={{ color: "gray.600" }}
                >
                  <HStack>
                    <MdIcon iconName={mainLink.processIcon} color="gray.600" _hover={{ color: "blue.500" }} />
                    <Text color="gray.600" _hover={{ color: "blue.500" }}>
                      {processName}
                    </Text>
                    {items.some((item) => item.subProcessName) && (
                      <Box ml="auto">
                        {openSubmenu[mainLink.urlCode] ? <MdArrowDropDown /> : <MdArrowRight />}
                      </Box>
                    )}
                  </HStack>
                </Link>

                {items.some((item) => item.subProcessName) && (
                  <Collapse in={openSubmenu[mainLink.urlCode]}>
                    <Stack spacing={1} pl={6} mt={2}>
                      {items.map((item) => {
                        if (item.subProcessName) {
                          return (
                            <Link
                              key={item.subProcessName}
                              as={NavLink}
                              variant="sidebar"
                              to={`${item.pageurl}/${item.subProcessName}`}
                              _hover={{ textDecor: "none", color: "blue.500" }}
                              _active={{ textDecor: "none", color: "blue.500" }}
                              _focus={{ outline: "none" }}
                              _visited={{ color: "gray.600" }}
                            >
                              <HStack>
                                <MdIcon iconName={item.processIcon} color="gray.600" _hover={{ color: "blue.500" }} />
                                <Text color="gray.600" _hover={{ color: "blue.500" }}>
                                  {item.subProcessName}
                                </Text>
                              </HStack>
                            </Link>
                          );
                        }
                        return null;
                      })}
                    </Stack>
                  </Collapse>
                )}
              </Box>
            );
          })}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default UsersSidebar;
