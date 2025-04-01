import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Center, Spinner, Stack, useDisclosure } from "@chakra-ui/react";
import ScrollToTop from "./ScrollToTop";
import LogoutForm from "../../forms/auth/LogoutForm";
import { useFetchUsersProfile } from "../../hooks/userQueries";

import UsersNavbar from "../navigations/users/UsersNavbar";

import UsersSidebar from "../navigations/users/UsersSidebar1";

import UsersSidebarDrawer from "../navigations/users/UsersSidebarDrawer";

import Footer from "../routes/Footer";

// import VehicleRegistrationForm from "../../pages/vehicleDataEntry/VehicleDataEntry";
 
const DARoutes = () => {

  // Disclosures
  const logout = useDisclosure();
  const drawer = useDisclosure();

  // Queries
  const profileQuery = useFetchUsersProfile();

  if (profileQuery.isPending) {
    return (
      <Center minH="100dvh">
        <Spinner thickness="4px" size="xl" color="brand.600" />
      </Center>
    );
  }

  if (profileQuery.isError) {
    return <Navigate to="/" />;
  }

  if (profileQuery.isSuccess && profileQuery?.data?.data?.role !== "DA") {
    return <Navigate to="/" />;
  }

  return (
    <>
      <ScrollToTop />
      
      <LogoutForm isOpen={logout.isOpen} onClose={logout.onClose} />
      
      <UsersNavbar
        
        onOpen={drawer.onOpen}
        openLogout={logout.onOpen}
        profile={profileQuery?.data?.data}
        
      />
    
      <Stack minH="100dvh" justifyContent="space-between" spacing={8} bg="#C8E8F5">
        <Stack direction="row" spacing={0}>
          <UsersSidebar profile={profileQuery?.data?.data} />
          {/* <UsersSidebarDrawer 
                  onOpen={drawer.onOpen} 
                  isOpen={drawer.isOpen} 
                  onClose={drawer.onClose} 
                  navHeight = {navHeight}
                /> */}
          <Stack spacing={10} w="full" ml={{ base: 0, lg: 60 }}>
            <Outlet />
          </Stack>
          
        </Stack>
        <Stack spacing={10} w="full" ml={{base: 0, lg: 60}}>
          {/* <Footer /> */}
        </Stack>
      </Stack>
      
    </>
  );
};

export default DARoutes;
