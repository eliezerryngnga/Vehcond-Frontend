import React from "react";
import { 
  Box,  
  Text, 
  Flex,
  Image
} from "@chakra-ui/react";

import digitalIndia from "../../assets/digital.png";
import NIC_Logo from "../../assets/Nic_logo2-01.png";


const Footer = ({fontSize, digitalIndiaSrc, nicSrc, imageMaxWidth, imageMaxHeight}) => {

  const d_fontSize = "17px"    ;
  const d_digitalIndia = digitalIndia;
  const d_nicSrc = NIC_Logo;
  const d_imageMaxWidth = "200px";
  const d_imageMaxHeight = "200px";
  
  const currentFontSize = fontSize || d_fontSize;
  const currentDigitalIndia = digitalIndiaSrc || d_digitalIndia;
  const currentNicLogo = nicSrc || d_nicSrc;
  const currentImageMaxWidth = imageMaxWidth || d_imageMaxWidth;
  const currentImageMaxHeight = imageMaxHeight || d_imageMaxHeight;

  return (
    <Box as="footer" bg="#ffffff" py={4} boxShadow="0px -4px 5px rgba(0,0,0,0.1)">
            <Flex 
                justify="space-between" 
                align="center" 
                px={{ base: 4, md: 16 }} // Responsive padding
                direction={{ base: 'column', md: 'row' }}
            >
                {/* Left Side - Text */}
                <Box>
                  <Text fontSize={currentFontSize} color="gray.600" textAlign={{ base: 'center', md: 'left', lg: 'center' }}>
                    Content owned by Secretariat Administration Department,Government of Meghalaya
                  </Text>
                  <Text fontSize={currentFontSize} color="gray.600" textAlign={{ base: 'center', md: 'left', lg: 'center' }}>
                    Developed and hosted by National Informatics Center, Meghalaya
                  </Text>
                </Box>
              
                {/* Right Side - Images */}
                <Box 
                    display="flex" 
                    flexDirection="row" // Stack images vertically
                    alignItems="center" // Center images horizontally
                    mt={{ base: 2, md: 0 }} // Reduced margin-top for smaller spacing
                    
                >  
                    <Image 
                    src={currentDigitalIndia}
                    maxW={currentImageMaxWidth} 
                    maxH={currentImageMaxHeight}
                    alt="Digital India"
                     />
                    
                    <Image 
                    src={currentNicLogo} 
                    alt="National Informatics Centre Logo"
                    maxW={currentImageMaxWidth}
                    maxH={currentImageMaxHeight}  />
                </Box>
            </Flex>
        </Box>
  );
};

export default Footer;
