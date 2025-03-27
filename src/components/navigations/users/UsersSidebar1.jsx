
import { Box, Collapse, Heading, HStack, Link, Stack, Text } from "@chakra-ui/react";

import { Link as RouterLink, NavLink } from "react-router-dom";

import { useFetchMenuLinks } from "../../../hooks/uiQueries";

import MdIcon from "../../core/MdIcon";

import { MdArrowDropDown, MdDirectionsCar, MdHome, MdArrowRight } from "react-icons/md";
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
            // textDecoration="none" 
            // _hover={{ textDecoration: "none" }} 
            // _focus={{ textDecoration: "none" }}
          >
          </Link>
        </Box>

        {/* Menu */}
        <Stack spacing={1} px={4} mt={10}>
          {sortedMenu?.map((link) => link.showInMenu ? (
            <Box key={link.urlCode}>
              
                <Link                
                as={NavLink}
                variant="sidebar"
                to={link.pageurl}
                onClick={(e) => handleLinkClick(e, link)}
                
                _hover={{
                  textDecor: "none", 
                  color: "blue.500", 
                }}
                _active={{
                  textDecor: "none", 
                  color: "blue.500", 
                }}
                _focus={{
                  outline: "none", 
                }}
                _visited={{
                  color: "gray.600",
                }}
              >
                <HStack>

                  {/* Icons */}
                  <MdIcon iconName={link.processIcon} color="gray.600" _hover={{ color: "blue.500" }} />
                  
                  {/* Link Label */}
                  <Text color="gray.600" _hover={{ color: "blue.500" }}>
                    {link.processName}
                  </Text>
                  {/* <MdArrowRight /> */}

                  {/* Drop down icon */}
                  {link.subProcessName && (
                    <Box ml="auto">
                      {openSubmenu[link.urlCode] ? (<MdArrowDropDown />) : (<MdArrowRight />)}
                    </Box>
                  )}
                </HStack>
              </Link>

              {/* Display submenu if exist and is open */}
              {link.subProcessName && (
                <Collapse in={openSubmenu[link.urlCode]}>
                  <Stack spacing={1} pl={6} mt={2}>
                    <Link
                      key={link.subProcessName}
                      as={NavLink}
                      variant="sidebar"
                      to={`${link.pageurl}/${link.subProcessName}`}
                      _hover={{
                        textDecor: "none", 
                        color: "blue.500", 
                      }}
                      _active={{
                        textDecor: "none", 
                        color: "blue.500", 
                      }}
                      _focus={{
                        outline: "none", 
                      }}
                      _visited={{
                        color: "gray.600",
                      }}
                    >
                      <HStack>

                        {/* Sub Process Icon */}
                        <MdIcon iconName={link.processIcon} color="gray.600" _hover={{ color: "blue.500" }} />
                        <Text color="gray.600" _hover={{ color: "blue.500" }}>
                          {link.subProcessName}
                        </Text>
                      </HStack>
                    </Link>
                  </Stack>
                </Collapse>
              )

              }


            </Box>
            
          ) : null
        )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default UsersSidebar;
