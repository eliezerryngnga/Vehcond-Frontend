import React from "react";
import Main from "../../components/core/semantics/Main";
import Section from "../../components/core/semantics/Section";
import {
  Box,
  Button,
  Center,
  Heading,
  Hide,
  HStack,
  Image,
  UnorderedList,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  ListItem,
  Flex,
  
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

import SignInForm from "../../forms/auth/SignInForm";

import mainPageImage from "../../assets/mainPage.jpg"

const HomePage = () => {
  return (
    // <Main>
    //   <Section>
    //     <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
    //       {/* LHS */}
    //       <Hide below="lg">
    //         <Center height="100vh">
    //           <Stack spacing={4} mt={16} textAlign="center">
    //             <Stack spacing={8}>
    //               <Stack spacing={12}>
    //                 <Stack spacing={2} color="brand.600">
    //                   <Heading size="xl">Vehicle Condemnation System</Heading>
    //                   <Text fontSize="2xl">
    //                     <strong>Government Of Meghalaya</strong>
    //                   </Text>
    //                 </Stack>
    //               </Stack>
    //             </Stack>
    //           </Stack>
    //         </Center>
    //       </Hide>

    //       {/* RHS */}
    //       <Center>
    //         <Box
    //           bg="paper"
    //           border="1px"
    //           borderColor="border"
    //           rounded="2xl"
    //           p={8}
    //           w="sm"
    //           maxW="sm"
    //         >
    //           <SignInForm />
    //         </Box>
    //       </Center>
    //     </SimpleGrid>
    //   </Section>
    // </Main>

    <Box as="main" py={16} px={{ base: 4, md: 16 }} bg="#C8E8F5">
      <Flex 
        justify="space-between" 
        align="center" 
        direction={{ base: 'column', md: 'row' }} 
      >
        {/* Left Section - Image */}

        <Hide below="lg">
          <Box flex="1" mb={{ base: 6, md: 0 }} textAlign="center">
            <Image
              src={mainPageImage} 
              alt="Homepage Illustration"
              w={{ base: "80%", md: "70%" }}  // 80% on small screens, 70% on larger screens
              maxHeight="500px"  // Set max height to prevent overflow
              objectFit="cover"
            />
          </Box>
        </Hide>
      

        {/* Right Section - Login Form */}
        <Box 
          bg="whitesmoke"
          border="1px"
          
          rounded="2xl"
          flex="1" 
           
          p={8} 
          w="sm"
          maxW="sm"
         
          boxShadow="lg" 
          textAlign="center"
        >
              <SignInForm />
        </Box>
      </Flex>
 
    </Box>
  );
};

export default HomePage;
