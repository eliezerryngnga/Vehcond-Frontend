
import { Box, Heading, HStack, Link, Stack, Text } from "@chakra-ui/react";

import { Link as RouterLink, NavLink } from "react-router-dom";

import { useFetchMenuLinks } from "../../../hooks/uiQueries";

import MdIcon from "../../core/MdIcon";

import { MdDirectionsCar, MdHome } from "react-icons/md";

const UsersSidebar = ({ profile, rolecode }) => {
  
  // Queries
  const menuQuery = useFetchMenuLinks(rolecode);

  const sortedMenu = menuQuery?.data?.data?.sort(
    (a, b) => a.sortOrder - b.sortOrder
  );

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
        <Stack spacing={1} px={4}>
        
          {menuQuery.isLoading && <Text>Loading...</Text>}  {/* Show loading text when data is fetching */}
          {menuQuery.isError && <Text>Error fetching menu links</Text>}  {/* Show error text if fetch fails */}
          {!menuQuery.isLoading && !menuQuery.isError && sortedMenu?.length === 0 && <Text>No menu items available</Text>}  {/* Show message if no menu items */}
          
          {sortedMenu?.map((link) => (
            <Link
              key={link.url}
              as={NavLink}
              variant="sidebar"
              to={link.url}
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

                <MdIcon iconName={link.icon} color="gray.600" _hover={{ color: "blue.500" }} />
                
                <Text color="gray.600" _hover={{ color: "blue.500" }}>
                  {link.label}
                </Text>
              
              </HStack>
            
            </Link>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default UsersSidebar;
