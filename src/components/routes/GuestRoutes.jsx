import React from "react";

import { Navigate, Outlet } from "react-router-dom";

import GuestNavbar from "../navigations/guest/GuestNavbar";
// import GuestNavDrawer from "../navigations/guest/GuestNavDrawer";

import Footer from "./Footer";

import {
  Center,
  Spinner,
  Stack,
  useDisclosure,
  Container,
  Image,
  Box,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";


// import ScrollToTop from "./ScrollToTop";

import { useFetchUsersProfile } from "../../hooks/userQueries";

const GuestRoutes = () => {
  // Disclosures
  const drawer = useDisclosure();

  // Hooks
  // const contianerBg = useColorModeValue("brand.300", "brand.700");
  // const stackBg = useColorModeValue("brand.50", "brand.950");

  // Queries
  const profileQuery = useFetchUsersProfile();

  if (profileQuery.isPending) {
    return (
      <Center minH="100dvh">
        <Spinner thickness="4px" size="xl" color="brand.600" />
      </Center>
    );
  }

  if (profileQuery.isSuccess && profileQuery?.data?.data?.role === "ADMIN")
    return <Navigate to="/admin/dashboard" />;

  if (profileQuery.isSuccess && profileQuery?.data?.data?.role === "DA")
    return <Navigate to="/da/dashboard" />;

  if (profileQuery.isSuccess && profileQuery?.data?.data?.role === "TD")
    return <Navigate to="/td/dashboard" />;

  return (
    <>
    
      <GuestNavbar onOpen={drawer.onOpen} />
      <Stack
        minH="100vh"  
        direction="column"  
        justify="flex-start"
        spacing={4}  
      >
        <Outlet />  
        
        <Box mt={-4}>  
        <Footer />
      </Box> 
      </Stack>

    </>
  );
};

export default GuestRoutes;
