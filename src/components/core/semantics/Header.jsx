import React from "react";
import { Box, Container } from "@chakra-ui/react";

const Header = ({
  maxW = "container.xl",
  pos = "sticky",
  borderBottom = "1px",
  bg = "paper" | "background",
  children,
}) => {
  return (
    <Box
      as="header"
      maxW="full"
      pos={pos}
      top={0}
      left={0}
      w="full"
      pb={0}
      py={2}
      
      borderColor="border"
      boxShadow="0px 4px 5px rgba(0,0,0,0.1)"
      bg={bg}
      zIndex={100}
    >
      <Container as="nav" maxW={maxW}>
        {children}
      </Container>
    </Box>
  );
};

export default Header;
